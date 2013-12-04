({
  baseUrl: '..',
  map: {
    // '*' means all modules will get 'jquery-private'
    // for their 'jquery' dependency.
    '*': { 'jquery': 'jquery/jquery-private' }

  },
  paths: {
    underscore: 'underscore-amd/underscore',
    backbone: 'backbone-amd/backbone',
    ultraform: 'ultraform',
    almond: 'almond/almond',
    require: 'require/require'
  },
  include: 'almond',
  name: 'ultraform/ultraform',
  out: 'ultraform-min.js',
  optimize: "uglify2"
})