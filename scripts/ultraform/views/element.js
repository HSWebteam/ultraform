//Filename: ultraform/views/element.js

define([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/views/option'
], function($, _, Backbone, OptionView){

  // check for ie8
  var dummy = document.createElement('div');
  dummy.innerHTML = '<!' + '--[if IE 8]>x<![endif]-->';
  var isIE8 = dummy.innerHTML === 'x';


  var ElementView = Backbone.View.extend({

  	initialize: function(options) {
      this.options = options; // fix upgrade to 1.1.0 from 1.0.0

      var that = this;

      // *** CREATE AN ARRAY OPTION VIEWS FOR RADIOBUTTONGROUP, CHECKBOXGROUP AND SELECT ***
      // the server gives us something like: {"color1":"Red", "color2":"Blue", "anotherkey":"anothervalue"}

      this.optionViews = _.sortBy(_.map(this.options.options, function(value, key){


        var modelValue = that.model.attributes.value || [];
        var checked = (_.isArray(modelValue) ? _.indexOf(modelValue, key) !== -1 : modelValue == key);

        // selector of radio-inputs are combination of radio-input-group + radio-input value
        var selector = that.options.selector+'-'+key+', '+that.options.selector+' option[value="'+key+'"]';

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
            if (_.indexOf(modelValueArray, view.options.value) !== -1) {
              // this option is in the modelValue, check the dom element
              view.$el.prop('checked', true);
            }
          });
        }
        else if (! _.isEqual(DOMValue.sort(), modelValueArray.sort())) {
          console.error(this.model.id + ': The DOM and the API show a different initial value!!', {modelValue:modelValue, DOMValue:DOMValue});
        }

        // if selectbox is empty show placeholder
        if (this.$elFind(this.$el, 'select').length > 0 && this.getValue().length === 0 && this.model.attributes.placeholder) {

        }
      }

      // some more special care for select inputs
      if (this.$input.is('select') || this.$input.find('select').length > 0) {
        // it is a selectbox
        // on change remove the empty option and change colors and placeholder,
        this.listenTo(this.model, 'change', this.checkSelectRequired);
        this.checkSelectRequired();

      }

      // *** ATTACH TO SOME MODEL EVENTS ***
      // *** trigger some jQuery events on change nd validation
      this.listenTo(this.model, 'change:value', function(model, value, options){

        that.$el.trigger('changed.el.ufo', {
          $element: that.$el,
          $input: that.$input,
          newValue: value,
          oldValue: model.get('oldValue'),
          label: model.get('label')
        });

      });

      this.listenTo(this.model, 'change:validationError', function(model, value, options){

        var state = model.get('validationState');

        this.$el.toggleClass('error ufo-invalid', state=='invalid');
        this.$el.toggleClass('success ufo-valid', state=='valid');
        this.$el.toggleClass('ufo-pending', state=='pending');

        that.$el.trigger(state+'.el.ufo', {
          $element: that.$el,
          $input: that.$input,
          newValue: model.get('value'),
          oldValue: model.get('oldValue'),
          error: (state == 'valid' ? '' : value),
          label: model.get('label')
        });

      });

      this.listenTo(this.model, 'change:changeState', function(model, value, options){

        var state = model.get('changeState');

        this.$el.toggleClass('ufo-changed', state=='changed');
        this.$el.toggleClass('ufo-unchanged', state=='unchanged');

        that.$el.trigger(state+'.el.ufo', {
          $element: that.$el,
          $input: that.$input,
          newValue: model.get('value'),
          oldValue: model.get('oldValue'),
          label: model.get('label')
        });
      });

      // Set events depending on validateOn setting of the form
      var validateOn = this.model.parentModel.get('settings').validate_on; // blur, change

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

    // If selectbox is required and a non-empty option is chosen -> remove the empty option
    // If placeholder was set, remove it & change color to original
    checkSelectRequired: function() {

      var rules = this.model.getRules();
      var requiredRule = _.where(rules, {'name' : 'required'});
      var removeEmpty = false;
      if (requiredRule.length > 0) {
        if (this.model.parentModel.get('settings').remove_empty) {
          // required field AND remove_empty-setting true, so remove empty option when non-empty is chosen
          removeEmpty = true;
        }
      }

      var originalColor;

      // get the empty option
      var $emptyOption = this.$el.find('option[value=""]');
      var $select = this.$el.find('select');

      var value = this.model.get('value');

      if (value && value.length > 0) {

        // a value was chosen, remove placeholder and make text color normal
        originalColor = $select.data('ufoOriginalColor');
        if (originalColor) {
          // revert to original text color
          $select.css('color', $select.data('ufoOriginalColor'));
        }
        // remove 'hint' class
        $select.removeClass('hint');

        // if this field was required AND remove_empty was set to true,
        // then remove the empty option
        if (removeEmpty) {
          _.each(this.emptyOptions, function(view, index) {
            view.remove();
          });
        }
        else
        {
          // show the empty option that might have been hidden before
          if ($emptyOption.data('ufoOriginalDisplay')) {
            $emptyOption.css('display', $emptyOption.data('ufoOriginalDisplay')); // make visible
            $emptyOption.text(''); // hide the text
          }
        }

      }
      else
      {
        // no value was chosen, add placeholder and make text color gray
        // get original text color
        originalColor = $select.css('color');

        // add class 'hint' and placeholder text
        $emptyOption.addClass('hint').text(this.model.attributes.placeholder);
        $select.addClass('hint');
        // get new text color
        var newColor = $select.css('color');
        // if old and new color are the same, then there is no css to 'fade' the text
        // we assume normal text is black #000 and we make it gray #DDD
        if (originalColor == newColor) {
          if (! $select.data('ufoOriginalColor')) {
            // remember original color
            $select.data('ufoOriginalColor', originalColor);
          }
          $select.css('color', '#bbb');
          // hide the empty option
          if (! $emptyOption.data('ufoOriginalDisplay')) {
            $emptyOption.data('ufoOriginalDisplay', $emptyOption.css('display'));
          }
          $emptyOption.css('display', 'none'); // hide
          $emptyOption.text(isIE8 ? '' : this.model.attributes.placeholder); // make text visible
        }

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
      this.model.setValueAndValidate( this.getValue() ); // also include the $el for triggering events
    }


  });

  // What we return here will be used by other modules
  return ElementView;
});