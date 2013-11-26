requirejs.config({
  baseUrl: 'scripts',
  paths: {
    jquery: 'jquery/jquery',
    underscore: 'underscore/underscore',
    backbone: 'backbone/backbone'
  },
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});


define(
  ['jquery', 'underscore', 'backbone', 'ultraform'],

  function ($, _, Backbone, Ultraform) {

    // configuration which field to show when which other field is valid
    var showWhenValid = {
      alphanumeric: 'alpha', // show the alphanumeric input only if the alpha input is valid and visible
      alphadash: 'alphanumeric',
      numeric: 'alphadash', // show the numeric input only if the alphadash is valid and visible
      is_numeric: 'numeric',
      age: 'is_numeric',
      decimal: 'age',
      is_natural: 'decimal',
      is_natural_no_zero: 'is_natural',
      email: 'is_natural_no_zero',
      emails: 'email',
      sushi: 'emails',
      color: 'sushi',
      sauce: 'color',
      sushitype: 'sauce'
    };

    // modify the Ultraform ElementModel
    Ultraform.beforeExtend.ElementModel = function(obj) {

      // change initialize function
      var oldInitialize = obj.initialize;
      obj.initialize = function(attributes, options){
        // first execute the original initialize function
        var result = oldInitialize.call(this, attributes, options);

        // see if this elementModel has visibility rules
        if (this.get('name') in showWhenValid) {
          // then set isVisible of current model
          this.initializeVisibility();
        }
        else {
          // no visibility rule for this model -> always visible
          this.set({isVisible: true});
        }
      }

      // add a function to add listeners
      obj.initializeVisibility = function() {
        // get the model that the visibility depends on
        var dependOnName = showWhenValid[this.get('name')];
        var dependOnModel = this.collection.findWhere({name: dependOnName});

        if (_.isUndefined(dependOnModel)) {
          // dependOnModel does not yet exist, wait for it to be added and then start listening to it
          this.listenTo(this.collection, 'add', function(addedModel) {
            if (addedModel.get('name') == dependOnName) {
              // listen to validation changes and visibility changes on the depend-on model
              this.listenTo(addedModel, 'change', this.handleVisibility);
              // set visibility depending on current state of other elementModels
              this.handleVisibility(addedModel);
            }
          });
        }
        else {
          // listen to validation changes and visibility changes on the depend-on model
          this.listenTo(dependOnModel, 'change', this.handleVisibility);
          // set visibility depending on current state of other elementModels
          this.handleVisibility(dependOnModel);
        }
      };

      // add a function for handling visibility
      obj.handleVisibility = function(dependOnModel) {
        if (_.isUndefined(dependOnModel)) {
          // if the dependon model does not exist, make this model invisible
          this.set({isVisible: false});
        }
        else {
          // check if the depend-on model is visible and valid
          var dependOnIsVisible = dependOnModel.get('isVisible');
          var dependOnIsValid = dependOnModel.get('validationState')!='invalid';

          // make the current model visible/invisible depending on the dependOn model
          this.set({isVisible: dependOnIsVisible && dependOnIsValid});
        }
      };

      // the returned object will be used in Backbone.Model.extend(obj)
      return obj;
    }

    // modify the Ultraform ElementView
    Ultraform.beforeExtend.ElementView = function(obj) {

      var oldInitialize = obj.initialize;
      obj.initialize = function(){
        // first execute the original initialize function
        var result = oldInitialize.call(this);

        // then start listening
        this.listenTo(this.model, 'change', this.updateVisibility)
      };

      obj.updateVisibility = function(model) {
        if (model.get('isVisible')) {
          this.$el.fadeIn();
        }
        else {
          this.$el.fadeOut();
        }
      };

      // the returned object will be used in Backbone.View.extend(obj)
      // see Backbone documentation for more information on views
      return obj;
    };

  }
);