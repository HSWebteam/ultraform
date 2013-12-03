//Filename: ultraform/collections/element.js

define([
  'backbone',
  'ultraform/models/element'
], function(Backbone, ElementModel){

  var ElementCollection = Backbone.Collection.extend({
    model: ElementModel
  });

  // What we return here will be used by other modules
  return ElementCollection;
});