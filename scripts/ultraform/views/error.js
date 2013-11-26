//Filename: ultraform/views/error.js

define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

	console.log('loading views/error.js');

  var ErrorView = Backbone.View.extend({

    initialize: function( attributes, options ){

      // set some properties of the error
      this.parentView = options.parentView;
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
      this.listenTo(this.model, 'change:validationError', this.onValidation);
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
      this.$el.slideUp();
    },

    // show the validationerror in the DOM
    onInvalid: function(model) {
      var oldel = this.el;
      // create new element from template
      this.setElement( $(_.template(this.template, {message: model.get('validationError')})) );

      // if the errorblock was hidden before this validation -> show without animation
      // because the errorblock will have an animation
      // (We are creating a dependency here. Suggestions for any better coding without dependency?)
      if (this.parentView.model.get('invalidCount') === 0) {
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

  // What we return here will be used by other modules
  return ErrorView;
});