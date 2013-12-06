//Filename: ultraform/collections/form.js

define([
  'backbone',
  'ultraform/models/submitButton'
], function(Backbone, SubmitButtonModel){

  var SubmitButtonCollection = Backbone.Collection.extend({
    model: SubmitButtonModel
  });


  // What we return here will be used by other modules
  return SubmitButtonCollection;
});