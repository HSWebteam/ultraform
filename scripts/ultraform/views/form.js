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

        that.$el.trigger('ufo_'+state, {
          $element: that.$el,
          change: (that.model.get('changeState') == 'changed'),
          valid: (that.model.get('validationState') == 'valid'),
          errors: that.model.get('validationErrors')
        });
      });

      this.listenTo(this.model, 'change:validationState', function(model, value, options){

        var state = model.get('validationState');

        this.$el.toggleClass('ufo-valid', state=='valid');
        this.$el.toggleClass('ufo-invalid', state=='invalid');

        that.$el.trigger('ufo_'+state, {
          $element: that.$el,
          change: (that.model.get('changeState') == 'changed'),
          valid: (that.model.get('validationState') == 'valid'),
          errors: that.model.get('validationErrors')
        });
      });

      // trigger a jquery ready when the form is ready
      this.listenTo(this.model, 'ready', function(model, value, options){
        that.$el.trigger('ufo-ready'); // form and elements are loaded; the firsttime silent validation of all input elements has not yet been done
      });

		}

  });

  // What we return here will be used by other modules
  return FormView;
});