//Filename: ultraform/models/form.js

define([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/views/form',
  'ultraform/collections/element',
  'ultraform/views/errorBlock'
], function($, _, Backbone, FormView, ElementCollection, ErrorBlockView){

  var FormModel = Backbone.Model.extend({

    initialize: function(initoptions) {

      var model = this;

      // create the view for the form
      var view = new FormView({
        model: this,
        el: $('#' + initoptions.domid)
      });

      // create the collection of elements
      this.elementCollection = new ElementCollection();

      // create the view for the error block
      var errorView = new ErrorBlockView({
        model: this,
        el: $('#' + initoptions.domid + '_error')
      });

      // load the model from the server
      // since we ar NOT using RESTfull communication, we do a custom POST
      $.ajax({
        type: 'POST',
        data: {
          "ufo-action" : "json",
          "ufo-form" : initoptions.name,
          "ufo-id" : initoptions.id
        },
        success: function(data){
          model.parse(data);
        },
        error: function() {
          console.error('the model '+this.cid+' could not be loaded');
        }
      });

      this.set({
        validationState: 'valid', // whether all elements in the form are valid
        invalidCount: 0 // number of invalid elements in the form
      }, {silent:true});

      // return created views so we can extend functionality in the afterExtend function
      return {
        view: view,
        errorView: errorView
      };
    },

    defaults: {
      settings: {
        validate_on: 'blur'
      }
    },

    // alternative url, allways talk to the current url
    url: location.pathname,

    // perform when the data is returned by the server,
    // make submodels for every element in the returned object,
    // return the new attributes property for the model
    parse: function(response) {

      this.set('messages', response.messages || {});

      // get the settings for this form
      this.set({
        settings: _.extend(this.get('settings'), response.settings)
      });

      this.elementCollection.add(response.elements, {
        parentModel: this
      });

    },

    // see if there are any invalid elements and act on it
    // this function needs to be called by the elementModels on any validation change
    updateValidation: function() {
      var model = this;
      var invalidCount = this.elementCollection.where({validationState:'invalid'}).length;
      var set = {invalidCount: invalidCount};

      if (invalidCount > 0) {
        set.validationState = 'invalid';
      } else if (this.elementCollection.findWhere({validationState:'pending'})) {
        set.validationState = 'pending';
      } else {
        set.validationState = 'valid';
      }

      // use _.defer here so that the change events for the elementModels can be finished
      // before the change events for this formModel are handled
      // this is usefull for animations where we want ErrorView to be changed before
      // the ErrorBlockView is changed
      _.defer(function(){model.set(set);});
    }

  });

  // What we return here will be used by other modules
  return FormModel;
});