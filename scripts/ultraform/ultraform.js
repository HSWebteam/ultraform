//Filename: ultraform/ultraform.js
require.config({
  baseUrl: 'scripts',
  paths: {
    jquery: 'jquery/jquery',
    underscore: 'underscore-amd/underscore',
    backbone: 'backbone-amd/backbone',
    ultraform: 'ultraform',
    almond: 'almond/almond',
    require: 'require/require'
  },
  name: 'ultraform/ultraform'
});


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
    new FormCollection( collectionData );

  };

  initialize();

});