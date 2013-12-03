//Filename: ultraform/views/errorBlock.js

define([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/views/error'
], function($, _, Backbone, ErrorView){

  var ErrorBlockView = Backbone.View.extend({

    initialize: function(){

      // hide the error block because we have no errors yet
      this.$el.hide();

      // find the ul element inside the error block
      this.$ul = this.$el.find('ul');
      this.ul = this.$el.get(0);

      var template, $attach;
      if (this.$ul.length > 0) {
        // we have an <ul> element and need to add <li> elements to it
        template = "<li><%=message%></li>";
        $attach = this.$ul;
      } else {
        // we have another element. A <div> element will be used for the message
        template = "<div><%=message%></div>";
        $attach = this.$el;
      }

      // add ErrorView for elementModel
      function addErrorBlockError(elementModel){

        var errorView = new ErrorView({
          model: elementModel
        },{
          template: template,
          parentView: this,
          $attach: $attach
        });

      }

      // create an ErrorView for every elementModel that is allready in the elementCollection
      this.model.elementCollection.forEach(addErrorBlockError);

      // create an ErrorView for every elementModel that is added to the elementCollection
      this.listenTo(this.model.elementCollection, 'add', addErrorBlockError);

      // update the visibility of this errorblock when invalidCount changes on the formModel
      this.listenTo(this.model, 'change:invalidCount', this.updateValidation);
    },

    updateValidation: function(formModel){
      // update the visibility of the errorblock (if it is present)
      // visibility of the errors in the block are handled in the ErrorView
      if (formModel.get('validationState') == 'invalid') {
        this.$el.slideDown().fadeIn();
      }
      else {
        this.$el.slideUp().fadeOut();
      }

    }

  });

  // What we return here will be used by other modules
  return ErrorBlockView;
});