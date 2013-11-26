//Filename: ultraform/ultraform.js

define([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/collections/form'
], function($, _, Backbone, FormCollection){

  console.log('loading ultraform.js');

  // initialize the FormModels
  var initialize = function() {

    // for every ufo-* form in the document gather some information
    var collectionData = $('form[id^="ufo-"]').map(function(index, value){

      var idParts = this.id.split('-');

      // return the object to create a form of
      return {
        domid: this.id,
        id: idParts[2],
        name: idParts[1]
      };

    }).get(); // $().map().get() creates an array of return values

    // create a FormModel for every form while adding it to a new FormCollection
    return new FormCollection( collectionData );

  };

  // What we return here will be used by other modules
  return {
  	initialize: initialize
  };
});