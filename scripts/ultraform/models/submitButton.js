//Filename: ultraform/models/form.js

define([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/views/submitButton'
], function($, _, Backbone, SubmitButtonView){

  var SubmitButtonModel = Backbone.Model.extend({

    initialize: function(options) {

      // set parents
      this.parentModel = options.parentModel;

      // create view for this models element
      var view = new SubmitButtonView({
        model: this,
        el: options.el
      });

    },

    defaults: {
      settings: {
      }
    },


  });

  // What we return here will be used by other modules
  return SubmitButtonModel;
});