({
  baseUrl: '..',
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
  include: 'require',
  name: 'ultraform/ultraform',
  out: 'ultraform-min.js'
})