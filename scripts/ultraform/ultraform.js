//Filename: ultraform/ultraform.js
require.config({
  baseUrl: 'scripts',
  map: {
    // '*' means all modules will get 'jquery-private'
    // for their 'jquery' dependency.
    '*': { 'jquery': 'jquery/jquery-private' },

    // 'jquery-private' wants the real jQuery module
    // though. If this line was not here, there would
    // be an unresolvable cyclic dependency.
    'jquery-private': { 'jquery': 'jquery' }
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

  console.log('loading ultraform.js');

  $(document).ready(function(){

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
  });



});