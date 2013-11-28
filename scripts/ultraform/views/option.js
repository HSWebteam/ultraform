//Filename: ultraform/views/option.js

define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

	console.log('loading views/option.js');

  var OptionView = Backbone.View.extend({

    initialize: function(options) {
      this.options = options; // fix upgrade to 1.1.0 from 1.0.0

      this.$input = this.$elFind(this.$el, 'option, input[type="radio"], input[type="checkbox"]');
      this.input = this.$input.get(0);

    },

    // like $().find, but also checks the element itself for a match
  	$elFind: function($el, selector) {
    	return $el.is(selector) ? $el : $el.find(selector);
  	},

    getValue: function() {
      return this.$input.is(':checked') ? this.$input.val() : null;
    },

    updateModel: function() {
      this.options.elementView.updateModel.call(this.options.elementView);
    }

  });

  // What we return here will be used by other modules
  return OptionView;
});