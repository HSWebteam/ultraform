/* Ultraform.js
 * Part of the CodeIgniter Ultraform framework
 * Generate and validate forms that were prepared on the server
 */

/* Requirements:
 * - Backbone.js
 * - jQuery.validVal
 */

//alias the global object
//alias jQuery so we can potentially use other libraries that utilize $
//alias Backbone to save us on some typing
(function(exports, $, bb){

  //document ready
  $(function(){

    /**
    ***************************************
    * Cached Globals
    ***************************************
    */
    var $window, $body, $document;

    $window  = $(window);
    $document = $(document);
    $body   = $('body');

    /**
    ***************************************
    * The Ultraform model
    ***************************************
    */

    var UltraformModel = bb.Model.extend({

      initialize: function() {
        this.on('change', function() {
          console.log('MODEL -- model "' + this.cid + '" has been changed');
          console.dir({'model-attributes':this.attributes});
        });
      }

    });

    /**
    ***************************************
    * All Ultraforms on a page
    ***************************************
    */

    var UltraformList = bb.Collection.extend({
      model: UltraformModel
    });

    /**
    ***************************************
    * An Ultraform view
    ***************************************
    */

    var UltraformView = bb.View.extend({

      initialize: function() {

        var that = this;

        // activate jQuery.validVal on the form
        this.$el.validVal({

          validate: {
            onBlur: false,    // disable validVal automatic validation on blur
            onSubmit: false   // disable validVal automatic validation on submit
          },

          fields: {
            onValid: function() {

              // update the DOM to show this input field is invalid
              var $f = $(this);
              $f.add( $f.parent() ).removeClass( 'invalid' );

              // propagate the change to the model
              var fieldName = that.getFieldName(this);

              // for debugging
              console.log('VIEW -- ' + fieldName + ' changed to ' + JSON.stringify($(this).val()) + ' (valid)');

              // udpate the model
              that.model.set(fieldName, $f.val());
            },
            onInvalid: function() {

              // update the DOM to NOT show this input field is invalid
              var $f = $(this);
              $f.add( $f.parent() ).addClass( 'invalid' );

              // for debugging
              var fieldName = that.getFieldName(this);
              console.log('VIEW -- ' + fieldName + ' changed to ' + JSON.stringify($(this).val()) + ' (INVALID)');
            }
          }

        });

      },

      events: {
        "blur input" : "validate",
        "change select": "validate"
      },

      validate: function(event) {

        // call jQuery.validVal on the input element
        $(event.target).trigger( "validate.vv" );

      },

      // get the model property name that corresponds with the DOM element
      getFieldName: function(DomElement) {
        // get the element id
        var id = $(DomElement).attr('id');

        // do something with it ????

        // return the result
        return id;
      }
    });


    /**
    ***************************************
    * Export the Ultraform model and list
    ***************************************
    */

     exports.UltraformModel = UltraformModel;
     exports.UltraformList = UltraformList;
     exports.UltraformView = UltraformView;

  });//end document ready

}(this, jQuery, Backbone));