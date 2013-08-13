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


  /**
  ***************************************
  * MODEL: ElementModel
  * The Ultraform Model for a DOM element
  ***************************************
  */

  var ElementModel = Backbone.Model.extend({

    initialize: function(attributes, options) {

      // set parents
      this.parentModel = options.parentModel;
      this.parentCollection = options.parentCollection;

      // set id
      this.set({
        id: 'ufo-' + this.parentModel.get('name') + '-' + this.parentModel.id + '-' + attributes.name
      }, {silent: true});

      // create view for this models element
      var view = new ElementView({
        model: this,
        el: $('#' + this.id)
      });

      // create element error view if an error-element can be found (elementId + _error)
      var $errorElement = $('#' + this.id + '_error');
      var $errorBlock = $('#ufo-' + this.parentModel.get('name') + '-' + this.parentModel.id);

      // if there is no errorElement and also no global errorblock, create an errorElement
      if ($errorElement.length === 0 && $errorBlock.length === 0) {
        $errorElement = $('<span id="'+this.id+'_error"></span>').insertAfter(view.$el);
      }

      // if there is en errorBlock now, create an ElementErrorView for it
      if ($errorElement.length > 0) {
        var elementErrorView = new ElementErrorView({},{

          elementModel: this,
          $el: $errorElement

        });
      }

      // initialize validations
      this.initializeValidations.call(this);
    },

    // first set the value, then validate
    // (this differs from set('value',value,{validate:true})) in that
    // the an invalid validation will not prevent setting the value
    setValueAndValidate: function(value) {

      // set the value, regardless of the validation results
      this.set('value', value);

      // do the validation
      this.validate(this.attributes);
    },

    // state after the last validation, can be valid, invalid or pending
    validationState: 'valid',

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
      var rules = this.getRules();

      var model = this;
      var error = '';
      var oldState = this.validationState;
      var oldError = this.validationError;

      // reject all old pending validations
      $.each(this._pendingValidations, function(index, deferred){
        deferred.reject();
      });

      this._pendingValidations = [];

      // loop through all rules and perform all validations
      $.each(rules, function(index, rule){

        if (rule.name in model.validations) {

          // execute the validation
          var validationResult = model.validations[rule.name].call(model, attributes.value, rule, model);

          if (validationResult === false) {
            // inValid

            // set validation error message
            var message;
            if (typeof model.parentModel.attributes.messages !== 'undefined') {
              message = model.parentModel.attributes.messages[rule.name];
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

            // if state changes, trigger an event
            if (model.validationState!=='pending') {
              model.validationState = 'pending';
              model.trigger('validate', model);
            }
          }

        }
        else if (rule.name.slice(0, 'callback_'.length)==='callback_') {

          // this is a callback function, send the validation request to the server
          var data = {
            rule: rule.rule,
            //action: rule.name,
            //args: rule.args,
            value: attributes.value,
            name: model.get('name'),
            label: model.get('label')
          };

          // prepare the result
          var deferred = new $.Deferred();

          // execute the ajax call
          $.ajax({
            url: ultraformOptions.validateUrl,
            type: 'POST',
            data: data
          }).done(function(result){
            deferred.resolve( result );
          });

          // result is a deferred
          // create a pending validation
          model._pendingValidations.push( deferred );

          // if state changes, trigger an event
          if (model.validationState!=='pending') {
            model.validationState = 'pending';
            model.trigger('validate', model);
          }

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
        var oldState = model.validationState;
        var oldError = model.validationError;
        model.validationState = isValid ? 'valid' : 'invalid';
        model.validationError = firstError;

        // if state or error changed, trigger an event
        if (oldState !== model.validationState || oldError !== model.validationError) {
          model.trigger('validate', model);

          // execute updateValidation() on the parent model
          model.parentModel.updateValidation();
        }

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
        var matchWith = this.parentCollection.where({name: args[0]});

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
          this.listenTo(this.parentCollection, 'add', function(addedModel){
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
        var valid_modifiers = {i:true, m:true};

        // find the end delimiter
        while (preg.length > 0) {
          // remove last char from preg
          var last_char = preg.slice(-1);
          preg = preg.slice(0,preg.length-1);

          // if last character is not the delimiter, add it to the list of modifiers
          if (last_char === delimiter) {
            // break the loop
            break;
          }
          else if (last_char in valid_modifiers) {
            // add to list of modifiers
            modifiers += last_char;
          }
          else {
            // warn for invalid modifier (might be valid in PHP but not in JS)
            alert('Invalid modifier for RegExp, Ultraform does not know what to do with '+last_char);
          }
        }

        var regex = new RegExp(preg, modifiers);

        return regex.test(value);
      },

      // MARK: this is not a pure function, the "args" argument can be changed
      matches: function(value, rule){

        var matchWithModel = this.parentCollection.findWhere({name:rule.args[0]});
        var matchWithValue = matchWithModel.attributes.value;

        // change the args[0] to the label of the field, for when the message gets generated
        rule.args[0] = matchWithModel.attributes.label;

        return (value === matchWithValue);
      },
      is_unique: function(value, rule, model){
        var data = {
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
          url: ultraformOptions.validateUrl,
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
        elementmodel = this;
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

  });

  /**
  ***************************************
  * COLLECTION: ElementCollection
  * The Collection of Elements in a form
  ***************************************
  */

  var ElementCollection = Backbone.Collection.extend({
    model: ElementModel
  });

  /**
  ***************************************
  * MODEL: FormModel
  * The Ultraform Model for a <form>
  ***************************************
  */

  var FormModel = Backbone.Model.extend({

    initialize: function(initoptions) {

      // create the view for the form
      var view = new FormView({
        model: this,
        el: $('#ufo-' + initoptions.name + '-' + initoptions.id)
      });

      // create the collection of elements
      this.elementCollection = new ElementCollection();

      // create the view for the error block
      var errorView = new ErrorBlockView({
        model: this,
        el: $('#ufo-' + initoptions.name + '-' + initoptions.id + '_error')
      });

      // load the model from the server
      this.fetch({
        error: function() {
          console.error('the model '+this.cid+' could not be loaded');
        }
      });

    },

    validationState: 'valid', // whether all elements in the form are valid
    invalidCount: 0, // number of invalid elements in the form

    // alternative url() function.
    // for a form named "ufo-forms-33" and a collection apiUrl "http://mysite.com/api"
    // the resulting url will be "http://mysite.com/api/forms/"
    url: function() {
      var url = ultraformOptions.apiUrl;
      var base = url + (url.charAt(url.length - 1) === '/' ? '' : '/') + this.get('name');
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // perform when the data is returned by the server,
    // make submodels for every element in the returned object,
    // return the new attributes property for the model
    parse: function(response) {

      this.set('messages', response.messages);

      this.elementCollection.add(response.elements, {
        parentCollection: this.elementCollection,
        parentModel: this
      });

    },

    // see if there are any invalid elements and act on it
    // this function needs to be called by the elementModels on any validation change
    updateValidation: function() {
      var oldState = this.validationState;
      this.invalidCount = _.where(this.elementCollection.models, {validationState:'invalid'}).length;

      if (this.invalidCount > 0) {
        this.validationState = 'invalid';
      } else if (! _.isUndefined(_.findWhere(this.elementCollection.models, {validationState:'pending'}))) {
        this.validationState = 'pending';
      } else {
        this.validationState = 'valid';
      }

      if (oldState !== this.validationState) {
        this.trigger('validate', this);
      }
    }

  });

  /**
  ***************************************
  * COLLECTION: FormCollection
  * The Collection of FormModels
  ***************************************
  */

  var FormCollection = Backbone.Collection.extend({
    model: FormModel
  });

  /**
  ***************************************
  * VIEW: ErrorView
  * The View for an error
  ***************************************
  */

  var ErrorView = Backbone.View.extend({

    initialize: function( attributes, options ){

      // set some properties of the error
      this.parentView = options.parentView;
      this.elementModel = options.elementModel;
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
      this.listenTo(this.elementModel, 'validate', this.onValidation);
    },

    // to be run when validation was performed
    onValidation: function(model) {
      if (model.validationState==='valid') {
        this.onValid(model);
      }
      else if (model.validationState==='invalid') {
        this.onInvalid(model);
      }
      else if (model.validationState==='pending') {
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
      this.setElement( $(_.template(this.template, {message: model.validationError})) );

      // if the errorblock was hidden before this validation -> show without animation
      // because the errorblock will have an animation
      // (We are creating a dependency here. Suggestions for any better coding without dependency?)
      if (this.parentView.model.invalidCount === 0) {
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

  });

  /**
  ***************************************
  * VIEW: ElementErrorView
  * The View for errors per element
  ***************************************
  */

  var ElementErrorView = Backbone.View.extend({

    initialize: function( attributes, options ){

      // set some properties of the error
      this.elementModel = options.elementModel;

      // set $el
      this.setElement(options.$el);

      // listen to model validation
      this.listenTo(this.elementModel, 'validate', this.onValidation);
    },

    // to be run when validation was performed
    onValidation: function(model) {
      if (model.validationState==='valid') {
        this.onValid(model);
      }
      else if (model.validationState==='invalid') {
        this.onInvalid(model);
      }
      else if (model.validationState==='pending') {
        this.onValidationPending(model);
      }
    },

    onValid: function(model) {
      this.$el.fadeOut();
    },

    onInvalid: function(model) {
      this.$el.text(model.validationError);
      this.$el.fadeIn();
    },

    onValidationPending: function(model) {
      // actions to perform while waiting for validation
    }

  });

  /**
  ***************************************
  * VIEW: ErrorBlockView
  * The View for the centralized error block
  ***************************************
  */

  var ErrorBlockView = Backbone.View.extend({

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

        var errorView = new ErrorView({},{
          elementModel: elementModel,
          template: template,
          parentView: this,
          $attach: $attach
        });

      }

      // create an ErrorView for every elementModel that is allready in the elementCollection
      this.model.elementCollection.forEach(addErrorBlockError);

      // create an ErrorView for every elementModel that is added to the elementCollection
      this.listenTo(this.model.elementCollection, 'add', addErrorBlockError);

      // update the visibility of this errorblock when validationState changes on the formModel
      this.listenTo(this.model, 'validate', this.updateValidation);

    },

    updateValidation: function(formModel){
      // update the visibility of the errorblock (if it is present)
      // visibility of the errors in the block are handled in the ErrorView
      if (formModel.validationState === 'invalid') {
        this.$el.slideDown().fadeIn();
      }
      else {
        this.$el.slideUp().fadeOut();
      }

    }

  });


  var FormView = Backbone.View.extend({
  });

  /**
  ***************************************
  * The Ultraform View for an <input>
  ***************************************
  */

  var ElementView = Backbone.View.extend({

    initialize: function() {

      // *** UPDATE THE MODEL OR THE UI IF NEEDED ***
      // compare the value in the DOM with the value that we got from the model
      var modelValue = this.model.attributes.value;
      var DOMValue = this.$el_find('input, select').val();
      if (modelValue === null || typeof modelValue == 'undefined') {
        // the model did not give a value
        // fill the model with the values from the DOM
        this.model.set('value', DOMValue);
      }
      else if (DOMValue === '') {
        // the DOM seems empty, set the model value to the DOM value
        this.$el_find('input, select, textarea').val(modelValue);
      }
      else if (modelValue !== DOMValue) {
        console.error(this.el.id + ': The DOM and the API show a different initial value!!');
      }

      // Set the $input to the input element
      this.$input = this.$el_find('input, select, textarea');
      this.input = this.$input.get(0);

      // *** ATTACH TO SOME MODEL EVENTS ***
      this.listenTo(this.model, 'validate', this.onValidation);

      // Set events depending on the root element
      if (this.input === this.el) {
        // root element is the input, select or textarea element
        this.events = {
          "blur" : "updateModel",
          "keypress" : "handleKey"
        };
      }
      else {
        // root element is not the same as the input elemnent
        this.events = {
          "blur input,select,textarea" : "updateModel",
          "keypress input,select,textarea" : "handleKey"
        };
      }

      // activate the event handlers
      this.delegateEvents();
    },

    events: {
      // no events here, they are initialized in the initialize method and may differ
      // slightly depending on which element was found
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
    updateModel: function(event) {
      this.model.setValueAndValidate( $(event.target).val() );
    },

    // to be run when validation was performed
    onValidation: function(model) {
      if (model.validationState==='valid') {
        this.onValid(model);
      }
      else if (model.validationState==='invalid') {
        this.onInvalid(model);
      }
      else if (model.validationState==='pending') {
        this.onValidationPending(model);
      }
    },

    // hide the validationerror from the DOM
    onValid: function(model) {
      this.$el.removeClass('error');
    },

    // show the validationerror in the DOM
    onInvalid: function(model) {
      this.$el.addClass('error');
    },

    onValidationPending: function(model) {
      // actions to perform while waiting for validation
    },

    // like $().find, but also checks the element itself for a match
    $el_find: function(selector) {
      return this.$el.is(selector) ? this.$el : this.$el.find(selector);
    }

  });

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
        id: idParts[2],
        name: idParts[1]
      };

    }).get(); // $().map().get() creates an array of return values

    // create a FormModel for every form while adding it to a new FormCollection
    that.formCollection = new FormCollection( collectionData );
  });

};

