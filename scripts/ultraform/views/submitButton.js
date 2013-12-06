//Filename: ultraform/views/form.js

define([
  'backbone'
], function(Backbone){

	var SubmitButtonView = Backbone.View.extend({

		initialize: function(){

			console.log('this view: ', this);

			// check state initially
			this.checkState.call(this);

			// update DOM to reflect the submit state
			this.listenTo(this.model, 'change', this.checkState);

			console.log('model state', this.model.get('state'));

			console.log('submit button view created');
		},

		checkState: function() {
			// button state kan be:
			// - unchanged-invalid (this is the initial value)
			// - unchanged-valid (this should be the value after a first validation run (the server should not send us invalid forms))
			// - changed-invalid
			// - changed-valid (the button should only in this case be enabled)

			// update the button class to reflect the state
			var state = this.model.get('state');
			var states = _.map( state.split('-'), function(s){return 'ufo-'+s;} ).join(' ');
			this.$el.removeClass( 'ufo-valid ufo-invalid ufo-changed ufo-unchanged' );
			this.$el.addClass( states );


		}

  });

  // What we return here will be used by other modules
  return SubmitButtonView;
});