//Filename: ultraform/collections/form.js

define([
  'backbone',
  'ultraform/models/form'
], function(Backbone, FormModel){

	console.log('loading collections/form.js');

  var FormCollection = Backbone.Collection.extend({
    model: FormModel
  });


  // What we return here will be used by other modules
  return FormCollection;
});