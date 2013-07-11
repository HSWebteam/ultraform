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

console.log('loading ultraform');


/**
***************************************
* The Ultraform Namespace
***************************************
*/

var Ultraform = {};

/**
***************************************
* MODEL: FormModel
* The Ultraform Model for a <form>
***************************************
*/

Ultraform.FormModel = Backbone.Model.extend({

  initialize: function() {

    console.log('initializing FormModel');

    // load the model from the server
    this.fetch({
      error: function() {
        console.error('the model '+this.cid+' could not be loaded');
      }
    });

    console.dir({after:this});

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
        id: 'ufo-' + model.id + '-' + value.field
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
    console.log('initializing ElementModel '+this.attributes.name);

    var view = new Ultraform.ElementView({
      model: this,
      el: $('#' + this.id)
    });
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

    $.each(rules, function(index, rule){

      // name of the rule
      var ruleName = rule.split(START_ARGS_AT)[0];

      // find start and end of arguments
      var argsStart = rule.indexOf(START_ARGS_AT);
      var argsEnd = rule.lastIndexOf(END_ARGS_AT);
      // string containing the arguments
      var ruleArgs = (argsStart==-1) ? [] : rule.slice(argsStart+1, argsEnd).split(SPLIT_ARGS_AT);

      console.log('NAME: '+ruleName+' ARGS: '+ruleArgs.join('|')+' argsStart: '+argsStart+' argsEnd: '+argsEnd+' rule: '+rule );

      if (ruleName in model.validations) {

        // execute the validation
        if (! model.validations[ruleName].call(model, attributes.value, ruleArgs)) {
          // not valid, set message and break the loop
          var message = model.parent.attributes.messages[ruleName];
          error = model.processMessage(message, attributes.label, ruleArgs);
          return false; // break
        }

      }
    });

    if (error !== '') return error;
  },

  // validation return true for valid values
  validations: {

    required: function(value, args){
      return (value !== '');
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

    },
    alpha_numeric: function(value, args){

    },
    alpha_dash: function(value, args){

    },
    numeric: function(value, args){

    },
    integer: function(value, args){

    },
    decimal: function(value, args){

    },
    is_natural: function(value, args){

    },
    is_natural_no_zero: function(value, args){

    },
    valid_email: function(value, args){

    },
    valid_emails: function(value, args){

    },
    valid_ip: function(value, args){

    },
    valid_base64: function(value, args){

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
    console.log('initializing FormView');
  }

});

/**
***************************************
* The Ultraform View for an <input>
***************************************
*/

Ultraform.ElementView = Backbone.View.extend({

  initialize: function() {
    console.log('initializing ElementView '+this.$el.prop('id'));

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

  },

  events: {
    "blur input" : "updateModel",
    "change select": "updateModel"
  },

  updateModel: function(event) {

    var currentValidationError = this.model.validationError;
    this.model.set('value', $(event.target).val(), {validate: true});

    // check if view needs to update because validation feedback changed
    if (currentValidationError != this.model.validationError) {
      // something has changed in the model validation state --> re-render
      this.render();
    }
  },

  render: function() {
    if (this.model.validationError==='')
    {
      this.hideValidationError();
    }
    else
    {
      this.showValidationError( this.model.validationError );
    }
  },

  // hide the validationerror from the DOM
  hideValidationError: function() {
    this.$el.find('.validationError').fadeOut();
    this.$el.removeClass('error');
  },

  // show the validationerror in the DOM
  showValidationError: function(html) {
    this.$el.find('.validationError').html(html).fadeIn();
    this.$el.addClass('error');
  }

});

