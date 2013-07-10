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

  elementModels: {},

  initialize: function() {

    console.log('initializing FormModel');

    var model = this;

    // load the model from the server
    this.fetch({
      success: function() {
        model.onLoadForm.apply(model);
      },
      error: function() {
        console.error('the model '+this.cid+' could not be loaded');
      }
    });

  },

  // perform after the form model was loaded
  onLoadForm: function() {
    var that = this;

    console.dir({attrs:this.attributes});

    // generate the models for the elements
    // every attribute is an element
    $.each(this.attributes, function(index, value) {

      // create model for the element
      if (! isNaN(parseInt(index, 10))) {
        that.elementModels[value.name] = new Ultraform.ElementModel({
          name: value.name,
          type: value.type,
          rules: value.rules,
          id: 'ufo-' + that.id + '-' + value.name
        }, {
          parent: that
        });
      }

    });
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

    var rules = this.get('rules').split(' ');
    var error = '';

    var model = this;
    var result = false;

    $.each(rules, function(index, rule){
      var ruleParts = rule.split(':');
      var ruleName = ruleParts[0];
      var ruleArgs = ruleParts.splice(1);

      if (ruleName in model.validations) {
        // execute the validation
        result = model.validations[ruleName](attributes.value, ruleArgs);

        // break when an error was encountered
        if (result) return false;
      }
    });

    if (result) return result;
  },

  validations: {
    required: function(value, args){
      return (value === '') ? 'Dit veld is verplicht' : false;
    }
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
      this.hideValidation();
    }
    else
    {
      this.showValidation( this.model.validationError );
    }
  },

  // hide the validationerror from the DOM
  hideValidation: function() {
    this.$el.find('.validationError').fadeOut();
    this.$el.removeClass('error');
  },

  // show the validationerror in the DOM
  showValidation: function(html) {
    this.$el.find('.validationError').html(html).fadeIn();
    this.$el.addClass('error');
  }

});

