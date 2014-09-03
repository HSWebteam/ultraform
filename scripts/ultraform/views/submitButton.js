//Filename: ultraform/views/form.js

define([
  'backbone'
], function(Backbone){

	var SubmitButtonView = Backbone.View.extend({

    constructor: function(){
      Backbone.View.apply( this, arguments );
      // disable button to prevent clicks before config is loaded
      this.$el.addClass('ufo-disabled disabled').removeClass('ufo-enabled enabled');
    },

		initialize: function(){

      var that = this;

			// update DOM to reflect the submit state
      this.listenToOnce(this.model.parentModel, 'ready', function(){
        // check state initially
        that.checkState.call(that);
        // start listening for model change
        that.listenTo(that.model, 'change', that.checkState);
      });

      // discard button action when button class is ufo-disabled
      this.$el.click(function(e){
        if (that.$el.hasClass('ufo-disabled')) {
          e.preventDefault();
        }
      });

		},


		checkState: function() {

			var changeState = this.model.get('changeState');
      var validationState = this.model.get('validationState');
			var validationErrors = this.model.get('validationErrors');
			var $el = this.$el;
      var settings = this.model.parentModel.get('settings');

      // get original color so we can after setting classes if any color has changed
      // in which case we do not have to change the color with Javascript
      var originalColor = $el.css('color');

			// update the button class to reflect the state
			$el.removeClass( 'ufo-valid ufo-invalid ufo-changed ufo-unchanged ufo-pending ufo-disabled disabled ufo-enabled enabled' );
			$el.addClass( 'ufo-' + changeState );
			$el.addClass( 'ufo-' + validationState );

      // if we do not disable submit -> end here
      if (! settings.disable_submit) return;

			// change button display
      if (validationState == 'valid' && changeState == 'changed') {

        this.$el.removeClass(settings.use_disabled_class ? 'ufo-disabled disabled' : 'ufo-disabled')
                .addClass(settings.use_disabled_class ? 'ufo-enabled enabled' : 'ufo-enabled');

        // remove title
        if (settings.submit_set_title)
        this.$el.prop('title', '');

      }
      else
      {
        // form is invalid or there are not changes to save --> set button to disabled
        this.$el.addClass(settings.use_disabled_class ? 'ufo-disabled disabled' : 'ufo-disabled')
                .removeClass(settings.use_disabled_class ? 'ufo-enabled enabled' : 'ufo-enabled');

        // update current tooltip
        if (settings.submit_set_title) {

          var title = settings.submit_title_text;

          if (changeState == 'unchanged') {
            title += '\n - ' + settings.submit_title_nochange;
          } else {
            _.forEach(validationErrors, function(error){
              title += '\n - ' + error;
            });
          }

          this.$el.prop('title', title);
        }
      }


		}

  });

  // What we return here will be used by other modules
  return SubmitButtonView;
});