//Filename: ultraform/models/element.js

define([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/views/element',
  'ultraform/views/elementError'
], function($, _, Backbone, ElementView, ElementErrorView){

  var ElementModel = Backbone.Model.extend({

    initialize: function(attributes, options) {

      var that = this;

      // set parents
      this.parentModel = options.parentModel;

      // set id and some other values
      this.set({
        id: this.parentModel.get('domid') + '-' + attributes.name,
        validationState: 'unknown', // state after the last validation, can be valid, invalid or pending
        validationError: 'unknown', // last validation error message or 'valid' or 'pending'
        changeState: 'unchanged',
        oldValue: this.get('value')
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
      this.initializeValidations.call(this, $domElement);

      // when validation values change, update the parent model
      this.parentModel.listenTo(this, 'change:validationError', this.parentModel.updateState);
      this.parentModel.listenTo(this, 'change:changeState', this.parentModel.updateState);

      // do a silent validation then the model is ready (has loaded all elements)
      this.listenTo(this.parentModel, 'ready', function(){
        that.validate(that.attributes, /*silent*/true);
      });

      // return the created views so we can extend the initialize functionality
      return {
        view: view,
        elementErrorView: elementErrorView
      };
    },

    // if input is an array, concatenate it with , to create a string to compare against
    serialize: function(input) {
      return _.isArray(input) ? input.sort().join(',') : input;
    },

    // first set the value, then validate
    // (this differs from set('value',value,{validate:true})) in that
    // the an invalid validation will not prevent setting the value
    setValueAndValidate: function(value) {

      // set the value, regardless of the validation results
      this.set({
        value: value,
        oldValue: this.get('value'),
        changeState: (this.get('changeState')=='changed' || value != this.get('value')) ? 'changed' : 'unchanged'
      });

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
        var argsStart = _.indexOf(rule, START_ARGS_AT);
        var argsEnd = _.lastIndexOf(rule, END_ARGS_AT);
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

    // validate the element
    // silent - if true, do not change the input element display,
    //          which enable the submit button so 'see' which input elements are invalid
    validate: function(attributes, silent) {

      if (silent == null) {
        silent = false;
      }

      // in case of an array, make a concatenated string of it
      var serializedValue = this.serialize(attributes.value);

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
            model.set({validationState:'pending', validationError:'pending'}, {silent: silent});
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
          model.set({validationState:'pending', validationError:'pending'}, {silent: silent});
          model.parentModel.updateState();
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
        }, {silent: silent});
        model.parentModel.updateState();

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
        var matchWithValue = this.serialize(matchWithModel.attributes.value);

        // change the args[0] to the label of the field, for when the message gets generated
        rule.args[0] = matchWithModel.attributes.label;

        return (value === matchWithValue);
      },
      is_unique: function(value, rule, model){
        var data = {
          "ufo-action": "callback",
          "ufo-rule": rule.rule,
          //action: rule.name,
          //args: rule.args,
          "ufo-value": value,
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

  });

  // What we return here will be used by other modules
  return ElementModel;
});