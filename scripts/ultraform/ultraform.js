//Filename: ultraform/ultraform.js
require.config({
  baseUrl: 'scripts',
  map: {
    // '*' means all modules will get 'jquery-private'
    // for their 'jquery' dependency.
    '*': { 'jquery': 'jquery/jquery-private' }

  },
  paths: {
//    jquery: 'jquery/jquery',
    underscore: 'underscore-amd/underscore',
    backbone: 'backbone-amd/backbone',
    ultraform: 'ultraform',
    almond: 'almond/almond',
    require: 'require/require'
  },
  name: 'ultraform/ultraform'
});


require([
  'jquery',
  'underscore',
  'backbone',
  'ultraform/collections/form'
], function($, _, Backbone, FormCollection){

  $(document).ready(function(){

    // for every ufo-* form in the document gather some information
    var collectionData = $('form[id^="ufo-"]').map(function(index, value){

      var idParts = this.id.split('-');

      // return the object to create a form of
      return {
        domid: this.id,
        id: (idParts.length < 3) ? idParts[1] : idParts[2],
        name: idParts[1]
      };

    }).get(); // $().map().get() creates an array of return values

    // create a FormModel for every form while adding it to a new FormCollection
    // register "ufo_formcollection" on the window object to make it possible for users to call the collection
    window.ufo_formcollection = new FormCollection( collectionData );
  });



});