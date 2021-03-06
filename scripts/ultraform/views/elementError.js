//Filename: ultraform/views/elementError.js

define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

  var ElementErrorView = Backbone.View.extend({

    initialize: function( attributes, options ){

      // set $el
      this.setElement(options.$el);

      // listen to model validation changes
      this.listenTo(this.model, 'change:validationError', this.onValidation);
      // in the case where the same value is first silently and then non-silently updated
      // whe validationError stays the same but we still need to update the elementError
      // for that case the validationSilency needs to be checked
      this.listenTo(this.model, 'change:validationSilency', this.onValidation);
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

  });

  // What we return here will be used by other modules
  return ElementErrorView;
});