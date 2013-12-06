//Filename: ultraform/views/form.js

define([
  'backbone'
], function(Backbone){

	var FormView = Backbone.View.extend({

		initialize: function(){

     	var that = this;

			// start unchanged and valid
			this.$el.addClass('ufo-unchanged ufo-valid');

      this.listenTo(this.model, 'change:changeState', function(model, value, options){

        var state = model.get('changeState');

        this.$el.toggleClass('ufo-changed', state=='changed');
        this.$el.toggleClass('ufo-unchanged', state=='unchanged');

        that.$el.trigger(state+'.form.ufo', {
          $element: that.$el,
        });
      });

      this.listenTo(this.model, 'change:validationState', function(model, value, options){

        var state = model.get('validationState');

        this.$el.toggleClass('ufo-valid', state=='valid');
        this.$el.toggleClass('ufo-invalid', state=='invalid');

        that.$el.trigger(state+'.form.ufo', {
          $element: that.$el,
        });
      });
		}

  });

  // What we return here will be used by other modules
  return FormView;
});