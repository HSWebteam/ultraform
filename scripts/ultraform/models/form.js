//Filename: ultraform/models/form.js

define([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/views/form',
  'ultraform/collections/element',
  'ultraform/collections/submitButton',
  'ultraform/views/errorBlock'
], function($, _, Backbone, FormView, ElementCollection, SubmitButtonCollection, ErrorBlockView){

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

      // find the commit button(s) and add them to a collection
      var submitButtonElements = view.$el.find('input[type="submit"], button[type="submit"]');

      // create the collection of submit buttons (usually one but we want to be prepared for a form with more than one button)
      this.submitButtonCollection = new SubmitButtonCollection(

        _.map(
          submitButtonElements,
          function(element){
            return {
              parentModel: model,
              el: element,
              state: 'unchanged-invalid'
            };
          }
        )

      );

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
        success: function(data, status, xhr){
          var contentType = xhr.getResponseHeader("content-type") || "";
          if (contentType.indexOf('json') == -1) {
            console.error('Ultraform: the response Content-Type was "'+contentType+'" but should be "application/json"');
          }

          model.parse(data);
        },
        error: function() {
          console.error('the model '+this.cid+' could not be loaded');
        }
      });

      this.set({
        changeState: 'unchanged',
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
        validate_on: 'blur', // validate inputs on the 'validate_on' event
        remove_empty: false, // remove empty options from required select inputs when a non-empty option is chosen
        disable_submit: true, // disable the submit button when there are no unsaved changes or when there are validation errors
        use_disabled_class: false, // use the disabled class on a button (forces twitter bootstrap to add the disabled property, disabling hover events and titles)
        submit_set_title: true, // show a basic tooltip on the submit button indicating why you cannot save
        submit_title_text: 'You cannot save because', // start text for simple tooltip
        submit_title_nochange: 'there are no changes to save' // reason to display when there are no changes to save
      }
    },

    // alternative url, allways talk to the current url
    url: location.pathname,

    // perform when the data is returned by the server,
    // make submodels for every element in the returned object,
    // return the new attributes property for the model
    parse: function(response) {

      var formModel = this;

      this.set('messages', response.messages || {});


      // get the settings for this form
      this.set({
        settings: _.extend(this.get('settings'), response.config)
      });


      // submitbutton names
      var submitButtonNames = this.submitButtonCollection.map( function(model){
        return model.get('el').name;
      });

      // remove submitbutton from elements
      var elements = _.filter( response.elements, function(element){
        return ! _.contains( submitButtonNames, element.name );
      });

      this.elementCollection.add( elements, {
        parentModel: this
      });

      // trigger ready event
      this.trigger('ready');

    },

    // see if there are any invalid elements and act on it
    // this function needs to be called by the elementModels on any validation change
    updateState: function() {
      var model = this;
      var invalids = this.elementCollection.where({validationState:'invalid'});

      var invalidCount = invalids.length;
      var set = {
        invalidCount: invalidCount,
        validationErrors: invalids.map(function(invalid){return invalid.get('validationError');})
      };

      if (invalidCount > 0) {
        set.validationState = 'invalid';
      } else if (this.elementCollection.findWhere({validationState:'pending'})) {
        set.validationState = 'pending';
      } else {
        set.validationState = 'valid';
      }

      var changeCount = this.elementCollection.where({changeState:'changed'}).length;

      if (changeCount > 0) {
        set.changeState = 'changed';
      } else {
        set.changeState = 'unchanged';
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