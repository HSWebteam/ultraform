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

//console.log('loading ultraform');


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


Ultraform.initialize = function(baseUrl){

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
          urlRoot: baseUrl + '/api/' + idParts[1]
        }
      );

      // set the url for validations
      model.validateUrl = baseUrl + '/validate/' + idParts[1] + '/' + idParts[2];
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

    //console.log('initializing FormModel');

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

    // generate the models for the elements
    // every attribute is an element
    $.each(response.elements, function(index, value) {

      // create model for the element
      elementModels[value.field] = new Ultraform.ElementModel({
        name: value.field,
        label: value.label,
        rules: value.rules,
        value: value.value,
        id: 'ufo-' + model.name + '-' + model.id + '-' + value.field
      }, {
        url: model.validateUrl
      });

      // set the parent model
      elementModels[value.field].parent = model;

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

  initialize: function() {
    //console.log('initializing ElementModel '+this.attributes.name);

    var view = new Ultraform.ElementView({
      model: this,
      el: $('#' + this.id)
    });
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

  // keep the validate function in the model small
  // the real work is done in Backbone.Validate
  validate: function(attributes) {

    var SPLIT_RULE_AT = '|';
    var START_ARGS_AT = '[';
    var SPLIT_ARGS_AT = ',';
    var END_ARGS_AT = ']';

    var rules = this.get('rules').split(SPLIT_RULE_AT);

    var model = this;
    var error = '';

    var oldState = this.validationState;
    var oldError = this.validationError;

    var _pendingValidations = [];

    // loop through all rules and perform all validations
    $.each(rules, function(index, rule){

      // name of the rule
      var ruleName = rule.split(START_ARGS_AT)[0];

      // find start and end of arguments
      var argsStart = rule.indexOf(START_ARGS_AT);
      var argsEnd = rule.lastIndexOf(END_ARGS_AT);
      // string containing the arguments
      var ruleArgs = (argsStart==-1) ? [] : rule.slice(argsStart+1, argsEnd).split(SPLIT_ARGS_AT);

      if (ruleName in model.validations) {

        // execute the validation
        var validationResult = model.validations[ruleName].call(model, attributes.value, ruleArgs);

        if (validationResult === false) {
          // inValid

          // set validation error message
          var message = model.parent.attributes.messages[ruleName];
          var validationError = model.processMessage(message, attributes.label, ruleArgs);

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
    is_unique: function(value, args){
      var data = {
        action: 'is_unique',
        args: args,
        value: value
      };

      // prepare the result
      var deferred = new $.Deferred();

      // execute the ajax call
      $.ajax({
        url: this.url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data)
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
    // replace %0, %1 with the corresponding arguments and %s with the label.
    $.each(args, function(index, value){
      message = message.replace('%'+index, value);
    });

    // replace %s with the label
    message = message.replace('%s', label);

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
    //console.log('initializing FormView');
  }

});

/**
***************************************
* The Ultraform View for an <input>
***************************************
*/

Ultraform.ElementView = Backbone.View.extend({

  initialize: function() {
    //console.log('initializing ElementView '+this.$el.prop('id'));

    // *** UPDATE THE MODEL OR THE UI IF NEEDED ***
    // compare the value in the DOM with the value that we got from the model
    var modelValue = this.model.attributes.value;
    var DOMValue = this.$el.find('input, select').val();

    if (typeof modelValue == 'undefined') {
      // the model did not give a value
      // fill the model with the values from the DOM
      this.model.set('value', DOMValue);
    }
    else if (DOMValue === '') {
      // the DOM seems empty, set the model value to the DOM value
      this.$el.find('input, select').val(modelValue);
    }
    else if (modelValue !== DOMValue) {
      console.error(this.el.id + ': The DOM and the API show a different initial value!!');
    }

    // *** ATTACH TO SOME MODEL EVENTS ***
    this.listenTo(this.model, 'validate:valid', this.onValid);
    this.listenTo(this.model, 'validate:invalid', this.onInvalid);
    this.listenTo(this.model, 'validate:pending', this.onValidationPending);
  },

  events: {
    "blur input" : "updateModel",
    "change select": "updateModel"
  },

  // sync the model with the UI
  updateModel: function(event) {
    this.model.setValueAndValidate( $(event.target).val() );
  },

  // hide the validationerror from the DOM
  onValid: function() {
    this.$el.find('.validationError').fadeOut();
    this.$el.removeClass('error');
  },

  // show the validationerror in the DOM
  onInvalid: function(error) {
    this.$el.find('.validationError').html(error).fadeIn();
    this.$el.addClass('error');
  },

  onValidationPending: function() {
    // actions to perform while waiting for validation
  }

});

