// and the 'jquery-private' module, in the
// jquery-private.js file:
define(['jquery'], function (jq) {

		console.log('loading jquery module');

    return jQuery.noConflict( true );
});