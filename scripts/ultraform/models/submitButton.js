//Filename: ultraform/models/form.js

define([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/views/submitButton'
], function($, _, Backbone, SubmitButtonView){

  var SubmitButtonModel = Backbone.Model.extend({

    initialize: function(options) {

      var that = this;

      this.set({
        validationState: 'invalid',
        changeState: 'unchanged'
      }, {silent: true});


      // set parents
      this.parentModel = options.parentModel;

      // create view for this models element
      var view = new SubmitButtonView({
        model: this,
        el: options.el
      });

      // update state with parent state
      this.listenTo(this.parentModel, 'change', function(model, value, options){
        console.log('change !!! ' + model.get('changeState') + ' ' + model.get('validationState'), model.get('validationErrors'));
        that.set({
          changeState: model.get('changeState'),
          validationState: model.get('validationState'),
          validationErrors: model.get('validationErrors')
        });
      });

    }

  });

  // What we return here will be used by other modules
  return SubmitButtonModel;
});