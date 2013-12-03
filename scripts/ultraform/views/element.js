//Filename: ultraform/views/element.js

define([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/views/option'
], function($, _, Backbone, OptionView){

  var ElementView = Backbone.View.extend({

  	initialize: function(options) {
      this.options = options; // fix upgrade to 1.1.0 from 1.0.0

      var that = this;

      // *** CREATE AN ARRAY OPTION VIEWS FOR RADIOBUTTONGROUP, CHECKBOXGROUP AND SELECT ***
      // the server gives us something like: {"color1":"Red", "color2":"Blue", "anotherkey":"anothervalue"}

      this.optionViews = _.sortBy(_.map(this.options.options, function(value, key){
        var modelValue = that.model.attributes.value;
        var checked = (_.isArray(modelValue) ? modelValue.indexOf(key) !== -1 : modelValue == key);

        // selector of radio-inputs are combination of radio-input-group + radio-input value
        var selector = that.options.selector+'-'+key;

        // get the dom element for this option
        var $domElement = $(selector);

        // create view
        var view = new OptionView({
          elementView: that,
          el: $domElement,
          checked: checked,
          value: key
        });

        return view;
      }), function(val) {
        // we also sort the checked elements to the end
        // this is to make sure that the DOM/API difference check works
        return val.checked;
      });

      // Set the $input to the input element
      this.$input = this.$elFind(this.$el, 'input, select, textarea');
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
          this.$elFind(this.$el, 'input, select, textarea').val(modelValue);
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
          _.each(this.optionViews, function(view, index) {
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

      // *** ATTACH TO SOME MODEL EVENTS ***
      this.listenTo(this.model, 'change:validationError', this.onValidation);

      // Set events depending on validateOn setting of the form
      var validateOn = this.model.parentModel.get('settings').validateOn; // blur, change

      // Add events to this view or to the optionsviews
      if (this.optionViews.length > 0) {
        _.each(this.optionViews, function(view, index) {

          // Set events depending on the root element
          var elementSelector = (view.input === view.el) ? '' : ' input,textarea';

          view.events = {};
          view.events['change' + elementSelector] = 'updateModel';

          // activate the event handlers
          view.delegateEvents();
        });

      }
      else {
        // Set events depending on the root element
        var elementSelector = (this.input === this.el) ? '' : ' input,textarea';

        this.events = {};
        this.events['keypress' + elementSelector] = 'handleKey';
        this.events[validateOn + elementSelector] = 'updateModel';

        // activate the event handlers
        this.delegateEvents();
      }


    },

    // like $().find, but also checks the element itself for a match
  	$elFind: function($el, selector) {
    	return $el.is(selector) ? $el : $el.find(selector);
  	},

    events: {
      // no events here, they are initialized in the initialize method and may differ
      // slightly depending on which element was found
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

  });

  // What we return here will be used by other modules
  return ElementView;
});