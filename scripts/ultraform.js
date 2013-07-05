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
        Backbone.FormModelOnReady.apply(model);
      },
      error: function() {
        console.error('the model '+this.cid+' could not be loaded');
      }
    });

  }

});

// load all element models of the form model
Backbone.FormModelOnReady = function() {

  var that = this;

  // generate the models for the elements
  // every attribute is an element
  $.each(this.attributes, function(index, value) {

    // create model for the element
    that.elementModels[value.name] = new Ultraform.ElementModel({
      name: value.name,
      type: value.type,
      rules: value.rules
    }, {
      parent: that
    });

  });

  // bind the change event after the initialization fetch was performed
  this.on('change', function() {
    console.log('MODEL -- model "' + this.cid + '" has been changed');
    console.dir({'model-attributes':this.attributes});
  });
};

/**
***************************************
* MODEL: ElementModel
* The Ultraform Model for a DOM element
***************************************
*/

Ultraform.ElementModel = Backbone.Model.extend({

  initialize: function() {
    console.log('initializing ElementModel '+this.attributes.name);
  },

  // keep the validate function in the model small
  // the real work is done in Backbone.Validate
  validate: function(changedAttributes) {
    this.validationError = Backbone.Validate(this);
    if (!_.isEmpty(this.validationError)) {
      return this.validationError;
    }
  }

});

/**
***************************************
* The Ultraform Collection
***************************************
*/

Ultraform.Collection = Backbone.Collection.extend({
  model: Ultraform.FormModel
});

/**
***************************************
* The Ultraform View for a <form>
***************************************
*/

Ultraform.FormView = Backbone.View.extend({

  initialize: function() {
  },

  events: {
    "blur input" : "validate",
    "change select": "validate"
  },

  validate: function(event) {
  },

  // get the model property name that corresponds with the DOM element
  getFieldName: function(DomElement) {
    // get the element id
    var id = $(DomElement).attr('id');

    // do something with it ????

    // return the result
    return id;
  }

});

/**
***************************************
* The Ultraform View for an <input>
***************************************
*/

Ultraform.ElementView = Backbone.View.extend({

  initialize: function() {
  },

  events: {
    "blur input" : "validate",
    "change select": "validate"
  },

  validate: function(event) {
  },

  // get the model property name that corresponds with the DOM element
  getFieldName: function(DomElement) {
    // get the element id
    var id = $(DomElement).attr('id');

    // do something with it ????

    // return the result
    return id;
  }

});

/**
***************************************
* Validation
***************************************
*/

Backbone.Validate = function(model, changedAttributes) {
};