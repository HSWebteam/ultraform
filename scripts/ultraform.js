/* Ultraform.js
 * Part of the CodeIgniter Ultraform framework
 * Generate and validate forms that were prepared on the server
 */

/* Requirements:
 * - Backbone.js
 * - Mustache.js
 * - Underscore.js
 * - jQuery.js
 */

/**
***************************************
* The Ultraform Namespace
***************************************
*/

var Ultraform = function(ultraformOptions) {

  "use strict";

  /**
  ***************************************
  * MODEL: ElementModel
  * The Ultraform Model for a DOM element
  ***************************************
  */

  var ElementModel = Backbone.Model.extend(Ultraform.beforeExtend.ElementModel.call(this, {

    initialize: function(attributes, options) {

      // set parents
      this.parentModel = options.parentModel;

      // set id and some other values
      this.set({
        id: this.parentModel.get('domid') + '-' + attributes.name,
        validationState: 'unknown', // state after the last validation, can be valid, invalid or pending
        validationError: 'unknown' // last validation error message or 'valid' or 'pending'
      }, {silent: true});

      var domSelector = '#' + this.id;
      var $domElement = $(domSelector);

      // create view for this models element
      var view = new ElementView({
        model: this,
        options: attributes.options || {}, // options like radiobuttons, checkboxes, options
        selector: domSelector,
        el: $domElement
      });

      // create element error view if an error-element can be found (elementId + _error)
      var $errorElement = $('#' + this.id + '_error');
      var $errorBlock = $('#' + this.parentModel.get('domid'));

      // if there is no errorElement and also no global errorblock, create an errorElement
      if ($errorElement.length === 0 && $errorBlock.length === 0) {
        $errorElement = $('<span id="'+this.id+'_error"></span>').insertAfter(view.$el);
      }

      // if there is en errorBlock now, create an ElementErrorView for it
      var elementErrorView;
      if ($errorElement.length > 0) {
        elementErrorView = new ElementErrorView({
          model: this
        },{

          $el: $errorElement

        });
      }

      // initialize validations
      this.initializeValidations.call(this);

      // when validation values change, update the parent model
      this.parentModel.listenTo(this, 'change:validationError', this.parentModel.updateValidation);

      // return the created views so we can extend the initialize functionality
      return {
        view: view,
        elementErrorView: elementErrorView
      };
    },

    // first set the value, then validate
    // (this differs from set('value',value,{validate:true})) in that
    // an invalid validation will not prevent setting the value
    setValueAndValidate: function(value) {

      // set the value, regardless of the validation results
      this.set('value', value);

      // do the validation
      this.validate(this.attributes);
    },

    // pending validations
    pendingValidations: $.when(''),

    // pending validations array
    _pendingValidations: [],

    // check if the current validation state is valid
    isValid: function() {
      return this.validationState === 'valid';
    },

    // return the current rules of the model as an array
    getRules: function() {
      var SPLIT_RULE_AT = '|';
      var START_ARGS_AT = '[';
      var SPLIT_ARGS_AT = ',';
      var END_ARGS_AT = ']';

      var _rules = this.get('rules');
      var rules = (_rules===null ? [''] : _rules.split(SPLIT_RULE_AT));

      // array with the rules
      var result = [];

      // loop through all rules and perform all validations
      return $.map(rules, function(rule){

        // name of the rule
        var ruleName = rule.split(START_ARGS_AT)[0];

        // find start and end of arguments
        var argsStart = rule.indexOf(START_ARGS_AT);
        var argsEnd = rule.lastIndexOf(END_ARGS_AT);
        // string containing the arguments
        var ruleArgs = (argsStart==-1) ? [] : rule.slice(argsStart+1, argsEnd).split(SPLIT_ARGS_AT);

        // save the rule in the results
        return {
          name: ruleName,
          args: ruleArgs,
          rule: rule
        };
      });

    },

    // keep the validate function in the model small
    // the real work is done in Backbone.Validate
    validate: function(attributes) {

      // in case of an array, make a concatenated string of it
      var serializedValue = serialize(attributes.value);

      var rules = this.getRules();

      var model = this;

      // reject all old pending validations
      $.each(this._pendingValidations, function(index, deferred){
        deferred.reject();
      });

      this._pendingValidations = [];

      // loop through all rules and perform all validations
      $.each(rules, function(index, rule){

        if (rule.name in model.validations) {

          // execute the validation
          var validationResult = model.validations[rule.name].call(model, serializedValue, rule, model);

          if (validationResult === false) {
            // inValid

            // set validation error message
            var message;
            if (model.parentModel.attributes.messages) {
              message = model.parentModel.attributes.messages[rule.name] || '';
            }
            else {
              message = 'ERROR';
            }

            var validationError = model.processMessage(message, attributes.label, rule.args);

            // create a resolved validation (resolved with a validation error)
            model._pendingValidations.push( $.Deferred().resolve({valid:false , error:validationError}) );

            // break the loop
            //return false; // break
          }
          else if (validationResult === true) {
            // Valid
            // create a resolved validation (resolved with no validation error)
            model._pendingValidations.push( $.Deferred().resolve({valid:true}) );
          }
          else {
            // result is a deferred
            // create a pending validation
            model._pendingValidations.push( validationResult );

            // update validationState
            model.set({validationState:'pending', validationError:'pending'});
          }

        }
        else if (rule.name.slice(0, 'callback_'.length)==='callback_') {

          // this is a callback function, send the validation request to the server
          var data = {
            "ufo-action": "callback",
            "ufo-rule": rule.rule,
            //action: rule.name,
            //args: rule.args,
            "ufo-value": serializedValue,
            "ufo-name": model.get('name'),
            "ufo-label": model.get('label')
          };

          // prepare the result
          var deferred = new $.Deferred();

          // execute the ajax call
          $.ajax({
            url: location.pathname,
            type: 'POST',
            data: data
          }).done(function(result){
            deferred.resolve( result );
          });

          // result is a deferred
          // create a pending validation
          model._pendingValidations.push( deferred );

          // update validation state
          model.set({validationState:'pending', validationError:'pending'});
        }
      });

      // create a new Deferred for the new validation results
      this.pendingValidations = $.when.apply(this, this._pendingValidations);

      // trigger an event if the validation state or errors change
      this.pendingValidations.then(function(){
        // translate the arguments to a regular array
        var data = Array.prototype.slice.call(arguments, 0);

        // get the first error
        var isValid = true;
        var firstError = '';
        $.each(data, function(index, value){
          if (! value.valid) {
            isValid = false;
            firstError = value.error;
            return false;
          }
        });

        // if no validation errors were found: set validation state to valid
        model.set({
          validationState: isValid ? 'valid' : 'invalid',
          validationError: isValid ? 'valid' : firstError
        });

      });

    },

    // some validations need initialization
    // for instance the matching rule needs to listen to changes in the matching model
    // this needs to be called after all element models are created
    initializeValidations: function() {
      var rules = this.getRules();
      var model = this;

      // loop through all rules and perform all validations
      $.each(rules, function(index, rule){
        if (rule.name in model.validationInitializations) {
          // initialize the validation
          model.validationInitializations[rule.name].call(model, rule.args);
        }
      });

    },

    // list of rules with initialization functions
    validationInitializations: {
      matches: function(args) {
        var model = this;

        // get the model that this element matches with
        var matchWith = this.collection.where({name: args[0]});

        // start listening to changes to matching model to validate this model
        function validateOnModelChange(matchingModel) {
          model.listenTo(matchingModel, 'change', function(){
            model.validate(model.attributes);
          });
        }

        // if matching model was found, listen to changes in the matching model
        // otherwise wait till the matching model is added
        if (matchWith.length > 0) {

          // listen to changes on the model
          validateOnModelChange(matchWith[0]);

        }
        else {

          // listen for models being added
          this.listenTo(this.collection, 'add', function(addedModel){

            if (addedModel.attributes.name === args[0]) {
              // then when the model is added, listen to changes on the model
              validateOnModelChange(addedModel);
            }
          });

        }


      }
    },

    // prevalidations modify a value to conform to some validation rule
    // for instance, if a string with max_length becomes to long, the string will be truncated
    // type is the type of event (onChange or onKey)
    // the modified value is returned
    preValidations: {

      // prevent typing longer strings
      max_length: function(value, args, type) {
        return (value.length > args[0]) ? value.slice(0, args[0]) : value;
      },

      // change comma (,) to point (.)
      numeric: function(value, args, type) {
        if (type !== 'change') return;
        return value.replace(/\,/g, '.');
      },

      // change comma (,) to point (.)
      is_numeric: function(value, args, type) {
        if (type !== 'change') return;
        return value.replace(/\,/g, '.');
      },

      // change comma (,) to point (.)
      decimal: function(value, args, type) {
        if (type !== 'change') return;
        return value.replace(/\,/g, '.');
      }

    },

    // validation return true for valid values
    validations: {

      required: function(value){
        return ($.trim(value) !== '');
      },

      // MARK: this is not a pure function, the "args" argument can be changed
      regexp_match: function(value, rule){

        // change args to a single argument
        // if the regexp contains a comma (,) the args would have become split, revert the splitting
        rule.args[0] = rule.args.join(',');

        // the PHP version of the regex
        var preg = rule.args[0];
        var modifiers = '';

        // character that starts end ends the regexp (example: regexp '/^def/' has delimiter '/')
        var delimiter = preg.slice(0,1);
        preg = preg.slice(1); // remove the first delimiter

        // modifiers that are valid in JS and PHP
        var validModifiers = {i:true, m:true};

        // find the end delimiter
        while (preg.length > 0) {
          // remove last char from preg
          var lastChar = preg.slice(-1);
          preg = preg.slice(0,preg.length-1);

          // if last character is not the delimiter, add it to the list of modifiers
          if (lastChar === delimiter) {
            // break the loop
            break;
          }
          else if (lastChar in validModifiers) {
            // add to list of modifiers
            modifiers += lastChar;
          }
          else {
            // warn for invalid modifier (might be valid in PHP but not in JS)
            alert('Invalid modifier for RegExp, Ultraform does not know what to do with '+lastChar);
          }
        }

        var regex = new RegExp(preg, modifiers);

        return regex.test(value);
      },

      // MARK: this is not a pure function, the "args" argument can be changed
      matches: function(value, rule){

        var matchWithModel = this.collection.findWhere({name:rule.args[0]});
        var matchWithValue = serialize(matchWithModel.attributes.value);

        // change the args[0] to the label of the field, for when the message gets generated
        rule.args[0] = matchWithModel.attributes.label;

        return (value === matchWithValue);
      },
      is_unique: function(value, rule, model){
        var data = {
          "ufo-action": "callback",
          rule: rule.rule,
          //action: rule.name,
          //args: rule.args,
          value: value,
          name: model.get('name'),
          label: model.get('label')
        };

        // prepare the result
        var deferred = new $.Deferred();

        // execute the ajax call
        $.ajax({
          url: location.pathname,
          type: 'POST',
          data: data
        }).done(function(result){
          deferred.resolve( result );
        });

        return deferred;
      },
      min_length: function(value, rule){
        return (value.length >= rule.args[0]);
      },
      max_length: function(value, rule){
        return (value.length <= rule.args[0]);
      },
      exact_length: function(value, rule){
        return (value.length === rule.args[0]);
      },
      greater_than: function(value, rule){
        return ((! isNaN(value)) && Number(value) > Number(rule.args[0]));
      },
      less_than: function(value, rule){
        return ((! isNaN(value)) && Number(value) < Number(rule.args[0]));
      },
      alpha: function(value){
        return (/^[a-zA-Z]+$/).test(value);
      },
      alpha_numeric: function(value){
        return (/^[a-zA-Z0-9]+$/).test(value);
      },
      alpha_dash: function(value){
        return (/^[a-zA-Z0-9_-]+$/).test(value);
      },
      numeric: function(value){
        return (/^[\-+]?[0-9]*\.?[0-9]+$/).test(value);
      },
      is_numeric: function(value){
        return (! isNaN(value));
      },
      integer: function(value){
        return (/^[\-+]?[0-9]+$/).test(value);
      },
      decimal: function(value){
        return (/^[\-+]?[0-9]+\.[0-9]+$/).test(value);
      },
      is_natural: function(value){
        return (/^[0-9]+$/).test(value);
      },
      is_natural_no_zero: function(value){
        return parseInt(value,10)===0 ? false : (/^[0-9]+$/).test(value);
      },
      valid_email: function(value){
        return (/^([a-zA-Z0-9\+_\-]+)(\.[a-zA-Z0-9\+_\-]+)*@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}$/).test($.trim(value));
      },
      valid_emails: function(value){
        var elementmodel = this;
        var emails = value.split(',');
        var result = true;
        $.each(emails, function(i, v){
          if (! elementmodel.validations.valid_email($.trim(v))) {
            result = false;
            return false;
          }
        });
        return result;
      }
    },

    // replace variables in messages
    processMessage: function(message, label, args){
      // replace %s with the label
      message = message.replace('%s', label);

      // replace all following %s with the arguments
      $.each(args, function(index, value){
        message = message.replace('%s', value);
      });

      // return the result
      return message;
    }

  }));

  /**
  ***************************************
  * COLLECTION: ElementCollection
  * The Collection of Elements in a form
  ***************************************
  */

  var ElementCollection = Backbone.Collection.extend(Ultraform.beforeExtend.ElementCollection.call(this, {
    model: ElementModel
  }));

  /**
  ***************************************
  * MODEL: FormModel
  * The Ultraform Model for a <form>
  ***************************************
  */

  var FormModel = Backbone.Model.extend(Ultraform.beforeExtend.FormModel.call(this, {

    initialize: function(initoptions) {

      var model = this;

      // create the view for the form
      var view = new FormView({
        model: this,
        el: $('#' + initoptions.domid)
      });

      // create the collection of elements
      this.elementCollection = new ElementCollection();

      // create the view for the error block
      var errorView = new ErrorBlockView({
        model: this,
        el: $('#' + initoptions.domid + '_error')
      });

      // load the model from the server
      // since we ar NOT using RESTfull communication, we do a custom POST
      $.ajax({
        type: 'POST',
        data: {
          "ufo-action" : "json",
          "ufo-form" : initoptions.name,
          "ufo-id" : initoptions.id
        },
        success: function(data){
          model.parse(data);
        },
        error: function() {
          console.error('the model '+this.cid+' could not be loaded');
        }
      });

      this.set({
        validationState: 'valid', // whether all elements in the form are valid
        invalidCount: 0 // number of invalid elements in the form
      }, {silent:true});

      // return created views so we can extend functionality in the afterExtend function
      return {
        view: view,
        errorView: errorView
      };
    },

    defaults: {
      settings: {
        validateOn: 'blur'
      }
    },

    // alternative url, allways talk to the current url
    url: location.pathname,

    // perform when the data is returned by the server,
    // make submodels for every element in the returned object,
    // return the new attributes property for the model
    parse: function(response) {

      this.set('messages', response.messages || {});

      // get the settings for this form
      this.set({
        settings: _.extend(this.get('settings'), response.settings)
      });

      this.elementCollection.add(response.elements, {
        parentModel: this
      });

    },

    // see if there are any invalid elements and act on it
    // this function needs to be called by the elementModels on any validation change
    updateValidation: function() {
      var model = this;
      var invalidCount = this.elementCollection.where({validationState:'invalid'}).length;
      var set = {invalidCount: invalidCount};

      if (invalidCount > 0) {
        set.validationState = 'invalid';
      } else if (this.elementCollection.findWhere({validationState:'pending'})) {
        set.validationState = 'pending';
      } else {
        set.validationState = 'valid';
      }

      // use _.defer here so that the change events for the elementModels can be finished
      // before the change events for this formModel are handled
      // this is usefull for animations where we want ErrorView to be changed before
      // the ErrorBlockView is changed
      _.defer(function(){model.set(set);});
    }

  }));

  /**
  ***************************************
  * COLLECTION: FormCollection
  * The Collection of FormModels
  ***************************************
  */

  var FormCollection = Backbone.Collection.extend(Ultraform.beforeExtend.FormCollection.call(this, {
    model: FormModel
  }));

  /**
  ***************************************
  * VIEW: ErrorView
  * The View for an error
  ***************************************
  */

  var ErrorView = Backbone.View.extend(Ultraform.beforeExtend.ErrorView.call(this, {

    initialize: function( attributes, options ){

      // set some properties of the error
      this.parentView = options.parentView;
      this.template = options.template;

      // create the el from template
      this.setElement(
        $( _.template(this.template, {message:''}) )
      );

      // hide the element before we add it to the DOM
      this.$el.hide();

      // add the invisible element to the DOM
      options.$attach.append( this.$el );

      // listen to model validation
      this.listenTo(this.model, 'change:validationError', this.onValidation);
    },

    // to be run when validation was performed
    onValidation: function(model) {
      if (model.get('validationState')=='valid') {
        this.onValid(model);
      }
      else if (model.get('validationState')=='invalid') {
        this.onInvalid(model);
      }
      else if (model.get('validationState')=='pending') {
        this.onValidationPending(model);
      }
    },

    // hide the validationerror from the DOM
    onValid: function(model) {
      this.$el.slideUp();
    },

    // show the validationerror in the DOM
    onInvalid: function(model) {
      var oldel = this.el;
      // create new element from template
      this.setElement( $(_.template(this.template, {message: model.get('validationError')})) );

      // if the errorblock was hidden before this validation -> show without animation
      // because the errorblock will have an animation
      // (We are creating a dependency here. Suggestions for any better coding without dependency?)
      if (this.parentView.model.get('invalidCount') === 0) {
        // do nothing, the newly created element is allready not-hidden
      }
      else if ($(oldel).is(':hidden')) {
        // the old element was hidden, hide the new element
        this.$el.hide();
      }

      // replace the old with the new
      $(oldel).replaceWith( this.$el );
      // display the new error element if it is not allready visible
      this.$el.slideDown();
    },

    onValidationPending: function(model) {
      // actions to perform while waiting for validation
    }

  }));

  /**
  ***************************************
  * VIEW: ElementErrorView
  * The View for errors per element
  ***************************************
  */

  var ElementErrorView = Backbone.View.extend(Ultraform.beforeExtend.ElementErrorView.call(this, {

    initialize: function( attributes, options ){

      // set $el
      this.setElement(options.$el);

      // listen to model validation changes
      this.listenTo(this.model, 'change:validationError', this.onValidation);
    },

    // to be run when validation was performed
    onValidation: function(model) {
      if (model.get('validationState')=='valid') {
        this.onValid(model);
      }
      else if (model.get('validationState')=='invalid') {
        this.onInvalid(model);
      }
      else if (model.get('validationState')=='pending') {
        this.onValidationPending(model);
      }
    },

    onValid: function(model) {
      this.$el.fadeOut();
    },

    onInvalid: function(model) {
      this.$el.text(model.get('validationError'));
      this.$el.fadeIn();
    },

    onValidationPending: function(model) {
      // actions to perform while waiting for validation
    }

  }));

  /**
  ***************************************
  * VIEW: ErrorBlockView
  * The View for the centralized error block
  ***************************************
  */

  var ErrorBlockView = Backbone.View.extend(Ultraform.beforeExtend.ErrorBlockView.call(this, {

    initialize: function(){

      // hide the error block because we have no errors yet
      this.$el.hide();

      // find the ul element inside the error block
      this.$ul = this.$el.find('ul');
      this.ul = this.$el.get(0);

      var template, $attach;
      if (this.$ul.length > 0) {
        // we have an <ul> element and need to add <li> elements to it
        template = "<li><%=message%></li>";
        $attach = this.$ul;
      } else {
        // we have another element. A <div> element will be used for the message
        template = "<div><%=message%></div>";
        $attach = this.$el;
      }

      // add ErrorView for elementModel
      function addErrorBlockError(elementModel){

        var errorView = new ErrorView({
          model: elementModel
        },{
          template: template,
          parentView: this,
          $attach: $attach
        });

      }

      // create an ErrorView for every elementModel that is allready in the elementCollection
      this.model.elementCollection.forEach(addErrorBlockError);

      // create an ErrorView for every elementModel that is added to the elementCollection
      this.listenTo(this.model.elementCollection, 'add', addErrorBlockError);

      // update the visibility of this errorblock when invalidCount changes on the formModel
      this.listenTo(this.model, 'change:invalidCount', this.updateValidation);
    },

    updateValidation: function(formModel){
      // update the visibility of the errorblock (if it is present)
      // visibility of the errors in the block are handled in the ErrorView
      if (formModel.get('validationState') == 'invalid') {
        this.$el.slideDown().fadeIn();
      }
      else {
        this.$el.slideUp().fadeOut();
      }

    }

  }));


  var FormView = Backbone.View.extend(Ultraform.beforeExtend.FormView.call(this, {
  }));

  /**
  ***************************************
  * The Ultraform View for an <input>
  ***************************************
  */

  var ElementView = Backbone.View.extend(Ultraform.beforeExtend.ElementView.call(this, {

    initialize: function() {

      var that = this;

      // list of empty options
      this.emptyOptions = [];

      // *** CREATE AN ARRAY OPTION VIEWS FOR RADIOBUTTONGROUP, CHECKBOXGROUP AND SELECT ***
      // the server gives us something like: {"color1":"Red", "color2":"Blue", "anotherkey":"anothervalue"}
      this.optionViews = _.sortBy(_.map(this.options.options, function(value, key){
        var modelValue = that.model.attributes.value;
        var checked = (_.isArray(modelValue) ? modelValue.indexOf(key) !== -1 : modelValue == key);

        // selector of radio-inputs are combination of radio-input-group + radio-input value
        var selector = that.options.selector+'-'+key;

        // get the dom element for this option
        var $domElement = $(selector);
        // in case of selectbox, the options might not have an id, get by value
        if ($domElement.length === 0) {
          selector = that.options.selector+' option[value="'+key+'"]';
          $domElement = $(selector);
        }

        // create view
        var view = new OptionView({
          elementView: that,
          el: $domElement,
          checked: checked,
          value: key
        });

        if (key==='') that.emptyOptions.push(view);

        return view;
      }), function(val) {
        // we also sort the checked elements to the end
        // this is to make sure that the DOM/API difference check works
        return val.checked;
      });

      // Set the $input to the input element
      this.$input = $elFind(this.$el, 'input, select, textarea');
      this.input = this.$input.get(0);

      // *** UPDATE THE MODEL OR THE UI IF NEEDED ***
      // compare the value in the DOM with the value that we got from the model
      var modelValue = this.model.attributes.value;
      var DOMValue = this.getValue();

      if (this.optionViews.length === 0) {
        // this is not an element with options, we get the value directly from the dom element
        if (modelValue === null || typeof modelValue == 'undefined') {
          // the model did not give a value
          // fill the model with the values from the DOM
          this.model.set('value', DOMValue);
        }
        else if (DOMValue === '') {
          // the DOM seems empty, set the DOM value to the model value
          $elFind(this.$el, 'input, select, textarea').val(modelValue);
        }
        else if (modelValue != DOMValue) {
          console.error(this.model.id + ': The DOM and the API show a different initial value!!', {modelValue:modelValue, DOMValue:DOMValue});
        }
      }
      else {

        var modelValueArray = (_.isArray(modelValue)) ? modelValue : [modelValue];

        if (modelValue === null || typeof modelValue == 'undefined') {
          // the model did not give a value
          // fill the model with the values from the DOM
          this.model.set('value', DOMValue);
        }
        else if (DOMValue.length === 0) {
          // the DOM seems empty, set the DOM value to the model value
          this.$el.val(modelValue); // for selectbox
          _.each(this.optionViews, function(view, index) { // for radio and checkbox
            if (modelValueArray.indexOf(view.options.value) !== -1) {
              // this option is in the modelValue, check the dom element
              view.$el.prop('checked', true);
            }
          });
        }
        else if (! _.isEqual(DOMValue.sort(), modelValueArray.sort())) {
          console.error(this.model.id + ': The DOM and the API show a different initial value!!', {modelValue:modelValue, DOMValue:DOMValue});
        }
      }

      // some special care for select inputs
      if (this.$input.is('select') || this.$input.find('select').length > 0) {
        // it is a selectbox
        var rules = this.model.getRules();
        var requiredRule = _.where(rules, {'name' : 'required'});
        if (requiredRule.length > 0) {

          var removeEmpty = this.model.parentModel.get('settings').removeEmpty || false; // if true, remove empty options from selectboxes
          if (removeEmpty) {
            if (this.model.attributes.value !== '') {
              // the select is required AND the value is not empty
              // so the user has no need anymore (should not be able to) choose <empty>
              // therefore remove the empty option
              _.each(that.emptyOptions, function(view, index) {
                view.remove();
              });
            }
            else {
              // on change remove the empty option,
              this.listenTo(this.model, 'change', this.checkSelectRequired);
            }
          }

        }
        else {
          // this value is not required -- make sure there is an empty option
        }
      }

      // *** ATTACH TO SOME MODEL EVENTS ***
      this.listenTo(this.model, 'change:validationError', this.onValidation);

      // Set events depending on validateOn setting of the form
      var validateOn = this.model.parentModel.get('settings').validateOn; // blur, change

      var elementSelector;

      // Add events to this view or to the optionsviews
      if (this.$input.is('select')) {
        // selectbox triggers changes on the select element and not on the options
        elementSelector = (this.input === this.el) ? '' : ' select';

        this.events = {};
        this.events['change' + elementSelector] = 'updateModel';
        this.events[validateOn + elementSelector] = 'updateModel';

        // activate the event handlers
        this.delegateEvents();
      }
      if (this.optionViews.length > 0) {

        _.each(this.optionViews, function(view, index) {

          // Set events depending on the root element
          var elementSelector = (view.input === view.el) ? '' : ' input';

          view.events = {};
          view.events['change' + elementSelector] = 'updateModel';
          view.events[validateOn + elementSelector] = 'updateModel';

          // activate the event handlers
          view.delegateEvents();
        });

      }
      else {
        // Set events depending on the root element
        elementSelector = (this.input === this.el) ? '' : ' input,textarea';

        this.events = {};
        this.events['keypress' + elementSelector] = 'handleKey';
        this.events[validateOn + elementSelector] = 'updateModel';

        // activate the event handlers
        this.delegateEvents();
      }


    },

    events: {
      // no events here, they are initialized in the initialize method and may differ
      // slightly depending on which element was found
    },

    // If selectbox is required and a non-empty option is chosen -> remove the empty option
    checkSelectRequired: function() {
      var value = this.model.get('value');
      if (value && value.length > 0) {
        // remove the empty option
        _.each(this.emptyOptions, function(view, index) {
          view.remove();
        });
      }
    },

    // get the value of the view
    // if the view contains a single input element (has an empty collection), get the value from the input
    // if the view contains subview (a collection with models with subviews), get the value from the subviews
    getValue: function() {
      if (this.optionViews.length === 0) {
        // get the value of the one input element as a string
        return this.$input.val();
      }
      else {
        // get the values of the option elements as an array
        var result = [];
        _.each(this.optionViews, function(view, index) {
          var value = view.getValue();
          if (value) result.push(value);
        });

        return result;
      }
    },

    // change the resulting character when typing, depending on the rules
    // the keypresses may not even be visible for a split second, so we cannot use the model.validate
    // we must therefore resort to handling the keypress before the result becomes visible
    // and preventDefault() when we want to alter the result
    handleKey: function(event) {
      var rules = this.model.getRules();
      var view = this;
      var value = $(event.target).val();

      // loop through all rules and perform all handlers
      $.each(rules, function(index, rule){

        if (rule.name in view.keyHandlers) {
          var result = view.keyHandlers[rule.name](value, rule.args, event);

          if (result !== true) {
            // the input key was not valid, insert the alternative key that was given
            event.preventDefault();
            view.insertTextAtCursor(result);
          }
        }

      });

    },

    // keyHandlers return true for a valid input, otherwise the alternative string to insert at the cursor
    keyHandlers: {
      max_length: function(value, args, e) {
        return (value.length < args[0]) || (e.which < 32) || ''; // e.which==0 for non-character keys
      },

      numeric: function(value, args, e) {
        return (String.fromCharCode(e.which) !== ',') || '.';
      },

      is_numeric: function(value, args, e) {
        return (String.fromCharCode(e.which) !== ',') || '.';
      },

      decimal: function(value, args, e) {
        return (String.fromCharCode(e.which) !== ',') || '.';
      }

    },

    insertTextAtCursor: function(valueString){

      //IE support
      if (document.selection) {
          this.$input.focus();
          sel = document.selection.createRange();
          sel.text = valueString;
      }
      //MOZILLA/NETSCAPE support
      else if (this.input.selectionStart || this.input.selectionStart == '0') {
          var startPos = this.input.selectionStart;
          var endPos = this.input.selectionEnd;
          this.input.value = this.input.value.substring(0, startPos) +
          valueString +
          this.input.value.substring(endPos, this.input.value.length);
          this.input.selectionStart = startPos + valueString.length;
          this.input.selectionEnd = startPos + valueString.length;
      }
      else{
          this.$input.value += valueString;
      }

    },

    // sync the model with the UI
    updateModel: function() {
      this.model.setValueAndValidate( this.getValue() );
    },

    // to be run when validation was performed
    onValidation: function(model) {
      if (model.get('validationState')=='valid') {
        this.onValid(model);
      }
      else if (model.get('validationState')=='invalid') {
        this.onInvalid(model);
      }
      else if (model.get('validationState')=='pending') {
        this.onValidationPending(model);
      }
    },

    // hide the validationerror from the DOM
    onValid: function(model) {
      this.$el.removeClass('error').addClass('success');
    },

    // show the validationerror in the DOM
    onInvalid: function(model) {
      this.$el.removeClass('success').addClass('error');
    },

    onValidationPending: function(model) {
      this.$el.removeClass('success').removeClass('error');
      // actions to perform while waiting for validation
    }

  }));

  /**
  ***************************************
  * Options
  ***************************************
  */

  var OptionView = Backbone.View.extend(Ultraform.beforeExtend.OptionView.call(this, {

    initialize: function() {

      this.$input = $elFind(this.$el, 'option, input[type="radio"], input[type="checkbox"]');
      this.input = this.$input.get(0);

    },

    getValue: function() {
      return this.$input.is(':checked') ? this.$input.val() : null;
    },

    updateModel: function() {
      this.options.elementView.updateModel.call(this.options.elementView);
    }

  }));

  // like $().find, but also checks the element itself for a match
  var $elFind = function($el, selector) {
    return $el.is(selector) ? $el : $el.find(selector);
  };

  // if input is an array, concatenate it with , to create a string to compare against
  var serialize = function(input) {
    return _.isArray(input) ? input.sort().join(',') : input;
  };


  /**
  ***************************************
  * The Ultraform Initialization
  ***************************************
  */

  var that = this;

  // initialize the FormModels
  $(document).ready(function(){

    // for every ufo-* form in the document gather some information
    var collectionData = $('form[id^="ufo-"]').map(function(index, value){

      var idParts = this.id.split('-');

      // return the object to create a form of
      return {
        domid: this.id,
        id: idParts[2],
        name: idParts[1]
      };

    }).get(); // $().map().get() creates an array of return values

    // create a FormModel for every form while adding it to a new FormCollection
    that.formCollection = new FormCollection( collectionData );
  });

};

// functions to pre-process when extending backbone objects
Ultraform.beforeExtend = {
  FormCollection: function(obj)    {return obj;},
  FormModel: function(obj)         {return obj;},
  FormView: function(obj)          {return obj;},
  ElementCollection: function(obj) {return obj;},
  ElementModel: function(obj)      {return obj;},
  ElementView: function(obj)       {return obj;},
  ElementErrorView: function(obj)  {return obj;},
  OptionView: function(obj)       {return obj;},
  ErrorView: function(obj)         {return obj;},
  ErrorBlockView: function(obj)    {return obj;}
};

var ultraform;

// initialize
$(document).ready(function(){

  "use strict";
  ultraform = new Ultraform();

});