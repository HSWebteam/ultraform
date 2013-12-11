//Filename: ultraform/views/form.js

define([
  'backbone'
], function(Backbone){

	var SubmitButtonView = Backbone.View.extend({

		initialize: function(){

			// check state initially
			this.checkState.call(this);

			// update DOM to reflect the submit state
			this.listenTo(this.model, 'change', this.checkState);

		},

		checkState: function() {

			var changeState = this.model.get('changeState');
			var validationState = this.model.get('validationState');
			var $el = this.$el;

			// update the button class to reflect the state
			$el.removeClass( 'ufo-valid ufo-invalid ufo-changed ufo-unchanged ufo-pending' );
			$el.addClass( 'ufo-' + changeState );
			$el.addClass( 'ufo-' + validationState );

			// change button display
      if (validationState == 'valid' && changeState == 'changed') {

        // changed and valid --> we can use the button
        originalColor = $el.data('ufoOriginalColor');
        if (originalColor) {
          // revert to original text color
          $el.css('color', $el.data('ufoOriginalColor'));
        }

      }
      else
      {
        // form is invalid or there are not changes to save --> set button to disabled
        originalColor = $el.css('color');

        // get new text color
        var newColor = $el.css('color');
        // if old and new color are the same, then there is no css to 'fade' the text
        // we assume normal text is black #000 and we make it gray #DDD
        if (originalColor == newColor) {
          if (! $el.data('ufoOriginalColor')) {
            // remember original color
            $el.data('ufoOriginalColor', originalColor);
          }
          $el.css('color', 'red');
        }
      }


		}

  });

  // What we return here will be used by other modules
  return SubmitButtonView;
});