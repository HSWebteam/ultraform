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

var Ultraform = {};

/**
***************************************
* The Ultraform Initialization
***************************************
*/


Ultraform.initialize = function(options){

  // initialize the FormModels
  $(document).ready(function(){

    // for every ufo-* form in the document
    $('form[id^="ufo-"]').each(function(index, value){

      var idParts = this.id.split('-');

      // craete the form model for this form
      var model = new Ultraform.FormModel(
        {
          id: idParts[2]
        },
        {
          urlRoot: options.apiUrl + idParts[1]
        }
      );

      // set the url for validations
      model.validateUrl = options.validateUrl + idParts[1] + '/' + idParts[2];
      model.name = idParts[1];

    });
  });

};

/**
***************************************
* MODEL: FormModel
* The Ultraform Model for a <form>
***************************************
*/

Ultraform.FormModel = Backbone.Model.extend({



  initialize: function(options) {

    // load the model from the server
    this.fetch({
      error: function() {
        console.error('the model '+this.cid+' could not be loaded');
      }
    });

  },

  // perform when the data is returned by the server,
  // make submodels for every element in the returned object,
  // return the new attributes property for the model
  parse: function(response, options) {

    var model = this;

    // list of models for the elements
    var elementModels = {};

    // first add promises for the elements
    // so that if an element needs to reference
    // another element that is not yet initialized
    // we still can go ahead
    $.each(response.elements, function(index, value) {
      elementModels[value.name] = $.Deferred();
    });

    // add to the model
    model.set('elements', elementModels);

    // generate the models for the elements
    // every attribute is an element
    $.each(response.elements, function(index, value) {

      // create model for the element
      elementModel = new Ultraform.ElementModel({
        name: value.name,
        label: value.label,
        rules: value.rules,
        value: value.value,
        id: 'ufo-' + model.name + '-' + model.id + '-' + value.name
      }, {
        url: model.validateUrl,
        parent: model
      });

      // get the deferred
      var deferred = model.get('elements')[value.name];

      // resolve
      deferred.resolve(elementModel);

      // replace the defered
      elementModels[value.name] = elementModel;

    });

    // return the result
    return {elements:elementModels, messages:response.messages};
  }

});

/**
***************************************
* MODEL: ElementModel
* The Ultraform Model for a DOM element
***************************************
*/

Ultraform.ElementModel = Backbone.Model.extend({

  // extend the constructor
  constructor: function(attributes, options) {

    // set the parent model
    this.parent = options.parent;

    // call the default constructor
    Backbone.Model.apply( this, arguments );
  },

  initialize: function() {

    var view = new Ultraform.ElementView({
      model: this,
      el: $('#' + this.id)
    });

    this.initializeValidations.call(this);
  },

  parent: null, // the parent model

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
        args: ruleArgs
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

    var _pendingValidations = [];

    // loop through all rules and perform all validations
    $.each(rules, function(index, rule){

      if (rule.name in model.validations) {

        // execute the validation
        var validationResult = model.validations[rule.name].call(model, attributes.value, rule.args, model);

        if (validationResult === false) {
          // inValid

          // set validation error message
          var message;
          if (typeof model.parent.attributes.messages !== 'undefined') {
            message = model.parent.attributes.messages[rule.name];
          }
          else {
            message = 'ERROR';
          }
          var validationError = model.processMessage(message, attributes.label, rule.args);

          // create a resolved validation (resolved with a validation error)
          _pendingValidations.push( $.Deferred().resolve(validationError) );

          // break the loop
          //return false; // break
        }
        else if (validationResult === true) {
          // Valid
          // create a resolved validation (resolved with no validation error)
          _pendingValidations.push( $.Deferred().resolve('') );
        }
        else {
          // result is a deferred
          // create a pending validation
          _pendingValidations.push( validationResult );

          // if state changes, trigger an event
          if (model.validationState!=='pending') {
            model.trigger('validate:pending');
            model.validationState = 'pending';
          }
        }

      }
      else if (rule.name.slice(0, 'callback_'.length)==='callback_') {

        // this is a callback function, send the validation request to the server
        var data = {
          rule: rule.name,
          args: rule.args,
          value: attributes.value,
          name: model.get('name'),
          label: model.get('label')
        };

        // prepare the result
        var deferred = new $.Deferred();

        // execute the ajax call
        $.ajax({
          url: model.url,
          type: 'POST',
          data: data
        }).done(function(result){
          deferred.resolve( result.error );
        });

        // result is a deferred
        // create a pending validation
        _pendingValidations.push( deferred );

        // if state changes, trigger an event
        if (model.validationState!=='pending') {
          model.trigger('validate:pending');
          model.validationState = 'pending';
        }

      }
    });

    // reject all old pending validations
    $.each(this._pendingValidations, function(index, deferred){
      deferred.reject();
    });

    // create a new Deferred for the new validation results
    this._pendingValidations = _pendingValidations;
    this.pendingValidations = $.when.apply(this, this._pendingValidations);

    // trigger an event if the validation state or errors change
    this.pendingValidations.then(function(){

      // translate the arguments to a regular array
      var data = Array.prototype.slice.call(arguments, 0);

      // get the first error
      var firstError = '';
      $.each(data, function(index, value){
        if (value !== '') {
          firstError = value;
          return false;
        }
      });

      // if no validation errors were found: set validation state to valid
      var oldState = model.validationState;
      var oldError = model.validationError;
      model.validationState = (firstError==='') ? 'valid' : 'invalid';
      model.validationError = firstError;

      // if state or error changed, trigger an event
      if (oldState !== model.validationState || oldError !== model.validationError) {
        model.trigger('validate:'+model.validationState, model.validationError);
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
      // the result can be a promise
      var matchWithModel = this.parent.attributes.elements[args[0]];

      $.when(matchWithModel).then(function(){
        model.listenTo(matchWithModel, 'change', function(){
          model.validate(model.attributes);
        });
      });

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

    required: function(value, args){
      return ($.trim(value) !== '');
    },

    // MARK: this is not a pure function, the "args" argument can be changed
    regexp_match: function(value, args){

      // change args to a single argument
      // if the regexp contains a comma (,) the args would have become split, revert the splitting
      args[0] = args.join(',');

      // the PHP version of the regex
      var preg = args[0];
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
    matches: function(value, args){

      var matchWithModel = this.parent.attributes.elements[args[0]];
      var matchWithValue = matchWithModel.attributes.value;

      // change the args[0] to the label of the field, for when the message gets generated
      args[0] = matchWithModel.attributes.label;

      return (value === matchWithValue);
    },
    is_unique: function(value, args, model){
      var data = {
        rule: 'is_unique',
        args: args,
        value: value,
        name: model.get('name'),
        label: model.get('label')
      };

      // prepare the result
      var deferred = new $.Deferred();

      // execute the ajax call
      $.ajax({
        url: this.url,
        type: 'POST',
        data: data
      }).done(function(result){
        deferred.resolve( result.error );
      });

      return deferred;
    },
    min_length: function(value, args){
      return (value.length >= args[0]);
    },
    max_length: function(value, args){
      return (value.length <= args[0]);
    },
    exact_length: function(value, args){
      return (value.length === args[0]);
    },
    greater_than: function(value, args){
      return ((! isNaN(value)) && Number(value) > Number(args[0]));
    },
    less_than: function(value, args){
      return ((! isNaN(value)) && Number(value) < Number(args[0]));
    },
    alpha: function(value, args){
      return (/^[a-zA-Z]+$/).test(value);
    },
    alpha_numeric: function(value, args){
      return (/^[a-zA-Z0-9]+$/).test(value);
    },
    alpha_dash: function(value, args){
      return (/^[a-zA-Z0-9_-]+$/).test(value);
    },
    numeric: function(value, args){
      return (/^[\-+]?[0-9]*\.?[0-9]+$/).test(value);
    },
    is_numeric: function(value, args){
      return (! isNaN(value));
    },
    integer: function(value, args){
      return (/^[\-+]?[0-9]+$/).test(value);
    },
    decimal: function(value, args){
      return (/^[\-+]?[0-9]+\.[0-9]+$/).test(value);
    },
    is_natural: function(value, args){
      return (/^[0-9]+$/).test(value);
    },
    is_natural_no_zero: function(value, args){
      return parseInt(value,10)===0 ? false : (/^[0-9]+$/).test(value);
    },
    valid_email: function(value, args){
      return (/^([a-zA-Z0-9\+_\-]+)(\.[a-zA-Z0-9\+_\-]+)*@([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,6}$/).test($.trim(value));
    },
    valid_emails: function(value, args){
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
* The Ultraform View for a <form>
***************************************
*/

Ultraform.FormView = Backbone.View.extend({

  initialize: function() {
  }

});

/**
***************************************
* The Ultraform View for an <input>
***************************************
*/

Ultraform.ElementView = Backbone.View.extend({

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
      this.$el_find('input, select').val(modelValue);
    }
    else if (modelValue !== DOMValue) {
      console.error(this.el.id + ': The DOM and the API show a different initial value!!');
    }

    // Set the $input to the input element
    this.$input = this.$el_find('input, select');
    this.input = this.$input.get(0);

    // set the error element
    this.$err = $('#' + this.$el.prop('id') + '_error');
    this.err = this.$err.get(0);

    // *** ATTACH TO SOME MODEL EVENTS ***
    this.listenTo(this.model, 'validate:valid', this.onValid);
    this.listenTo(this.model, 'validate:invalid', this.onInvalid);
    this.listenTo(this.model, 'validate:pending', this.onValidationPending);
  },

  events: {
    "blur input" : "updateModel",
    "blur" : "updateModel",
    "change select": "updateModel",
    "change": "updateModel",
    "keypress input" : "handleKey",
    "keypress" : "handleKey"
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

  // hide the validationerror from the DOM
  onValid: function() {
    this.$err.fadeOut();
    this.$err.removeClass('error');
  },

  // show the validationerror in the DOM
  onInvalid: function(error) {
    this.$err.html(error).fadeIn();
    this.$err.addClass('error');
  },

  onValidationPending: function() {
    // actions to perform while waiting for validation
  },

  // like $().find, but also checks the element itself for a match
  $el_find: function(selector) {
    return this.$el.is(selector) ? this.$el : this.$el.find(selector);
  }

});

