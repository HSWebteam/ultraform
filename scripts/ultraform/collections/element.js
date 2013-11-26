//Filename: ultraform/collections/element.js

define([
  'backbone',
  'ultraform/models/element'
], function(Backbone, ElementModel){

	console.log('loading collections/element.js');

  var ElementCollection = Backbone.Collection.extend({
    model: ElementModel
  });

  // What we return here will be used by other modules
  return ElementCollection;
});