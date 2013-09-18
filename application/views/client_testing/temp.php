<!DOCTYPE html>
<html>
<head>
	<title>Temp</title>
	<link rel="stylesheet" href="<?php echo base_url('css/qunit-1.12.0.css'); ?>">
<style>
/* reset.css
 * The purpose of this stylesheet is to set default styles for common browsers and address common issues (missing scrollbar, extended buttons in IE, gap below images, etc.)
 */


html, body { height: 100%; }
html { overflow-y: scroll; }
body { background: #fff; color: #000; }

pre, tt, code, kbd, samp, var { font-family: "Courier New", Courier, monospace; }

h1 { font-size: 35px; }
h2 { font-size: 30px; }
h3 { font-size: 25px; }
h4 { font-size: 20px; }
h5 { font-size: 18px; }
h6 { font-size: 16px; }

a:link, a:visited, a:hover, a:focus, a:active { text-decoration: underline; }

h1 a:link, h2 a:link, h3 a:link, h4 a:link, h5 a:link, h6 a:link,
h1 a:visited, h2 a:visited, h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited,
h1 a:hover, h2 a:hover, h3 a:hover, h4 a:hover, h5 a:hover, h6 a:hover,
h1 a:focus, h2 a:focus, h3 a:focus, h4 a:focus, h5 a:focus, h6 a:focus,
h1 a:active, h2 a:active, h3 a:active, h4 a:active, h5 a:active, h6 a:active {
	color: inherit;
}

a, input, textarea, select, optgroup, option { outline: none; }

body, p, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, button, textarea, blockquote, th, td {
	margin: 0;
	padding: 0;
}
h1 { margin-top: 2pt; }
h2 { margin-top: 8pt; }
h3 { margin-top: 7pt; }
h4, h5, h6 { margin-top: 6pt; }
h1, h2, h3, h4, h5, h6 { margin-bottom: 5pt; }
p, li { margin-bottom: 5pt; margin-top: 0; }

fieldset, img, a img { border: 0; }
img { vertical-align: bottom; }

ol li { list-style-type: decimal; }
ol ol li { list-style-type: lower-alpha; }
ol ol ol li { list-style-type: lower-roman; }
ul li { list-style-type: disc; }
ul ul li { list-style-type: circle; }
ul ul ul li { list-style-type: square; }

sub { vertical-align: sub; font-size: smaller; }
sup {  vertical-align: super; font-size: smaller; }

legend { color: #000;  padding-bottom: .5em; }
table {  border-collapse: collapse;  border-spacing: 0; }
caption { display: none; }

code { color: #06f; }
code, pre { font-size: small; }
blockquote p:before, blockquote p:after, q:before, q:after { content: ''; }

th, strong, dt, b { font-weight: bold; }
dd {
	padding-left: 20px;
	margin-top: .5em;
}
li { margin-left: 40px; }

label { padding-top: 1.2em; }

fieldset { line-height: 1; }
input.checkbox {  vertical-align: bottom;  *vertical-align: baseline; }
input.radio { vertical-align: text-bottom; }
input.text { _vertical-align: text-bottom; }
input, button, textarea, select, optgroup, option {
	font-size: 90%;
}
button, input.button, input.submit, input.reset {
	*overflow: visible;
	_width: 0;
	padding: .2em .4em;
	cursor: pointer;
}

/* style.css
 * The purpose of this stylesheet is to set default styles for basic html elements.
 */

body {
	position: relative;
}
body, div, td, li, p, input, textarea, select, option {
	font-family: Arial, Geneva, SunSans-Regular, sans-serif;
	font-size: 14px;
	color: #333;
	font-style: normal;
}

body, div, td, li, p {
	line-height: 1.6;
	text-align: left;
	vertical-align: top;
}

h1, h2, h3, h4, h5, h6 {
	line-height: 1.2;
	color: #BE1E2D;
	font-weight: bold;
}
h1 {
	font-size: 22px;
	margin: 5px 0 20px 0;
}
h2 {
	font-size: 20px;
	margin: 50px 0 16px 0;
}
h3 {
	font-size: 18px;
	margin: 40px 0 14px 0;
}
h4 {
	font-size: 16px;
	margin: 35px 0 12px 0;
}
h5 {
	font-size: 14px;
	margin: 25px 0 10px 0;
}
h6 {
	font-size: 14px;
	margin: 20px 0 10px 0;
}

p {
	margin: 0 0 10px 0;
}

a, a:link, a:active, a:visited {
	color: #8BC53F;
	text-decoration: none;
}
a:hover {
	color: #8BC53F;
	text-decoration: underline;
}

img {
	border: none;
}

code {
}

label {
	padding: 3px 0 0 20px;
	width: 130px;
	display: block;
	float: left;
}


textarea, select,
input[type='text'], input[type='password'], input.number, input[type='email'], input[type='url'] {
	background-color: #fff;
	border: solid 1px #999;
	padding: 5px;
	margin: 0 0 5px 0;

	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	border-radius: 5px;
}
textarea {
	height: 100px;
}
textarea,
input[type='text'], input[type='password'], input.number, input[type='email'], input[type='url'] {
	width: 240px;
}
select {
	width: 250px;
}
select.small {
	width: 75px;
}

input[type='radio'], input[type='checkbox'] {
}

textarea.focus, select.focus,
input[type='text'].focus, input[type='password'].focus, input.number.focus, input[type='email'].focus, input[type='url'].focus {
	border-color: #000 !important;
}
textarea.inactive, select.inactive, option.inactive,
input[type='text'].inactive, input[type='password'].inactive, input.number.inactive, input[type='email'].inactive, input[type='url'].inactive {
	color: #999;
	font-style: italic;
}
textarea.invalid, select.invalid,
input[type='text'].invalid, input[type='password'].invalid, input.number.invalid, input[type='email'].invalid, input[type='url'].invalid {
	border-color: red;
}

/* prevent FireFox default invalid style */
*:invalid {
	box-shadow: none !important;
}

input[maxlength='3'] {  width: 30px;    }
input[maxlength='4'] {  width: 40px;    }
input[maxlength='5'] {  width: 45px;    }

input[type='text'], textarea, select {
	border: solid 1px #999;
}
input[type='text'].focus, textarea.focus, select.focus {
	border-color: #000 !important;
}
input[type='text'].invalid, textarea.invalid, select.invalid {
	border-color: red;
}
input[type='text'].inactive, textarea.inactive, select.inactive, option.inactive {
	color: #999;
	font-style: italic;
}
input[type='text'].required, textarea.required {
	background: url(../images/required-input.png) right 5px no-repeat;
}
.red {
	color:lightgray;
	font-style:italic;
}
.error .red {
	display:none;
}
.validationError {
	font-weight:bold;
	color:red;
}

.error label {
	color:red;
}
.error input {
	border:1px solid red;
}

#ufo-forms-33_error {
	background-color: lightblue;
	border: 1px solid darkblue;
	border-radius: 5px;
	margin-left: 40px;
	width: 500px;
}
#ufo-forms-33_error li {
	border-bottom: 0px;
	height:21px;
}

</style>
</head>
<body>
	<h1 id="qunit-header">Backbone test page</h1>
	<h2 id="qunit-banner"></h2>
	<div id="qunit-testrunner-toolbar"></div>
	<h2 id="qunit-userAgent"></h2>
	<ol id="qunit-tests">

<div id="ufo-forms-33_error">
The following errors were encountered in the form:<br>
<ul>
</ul>
</div>

<h1>A test form:</h1>
<p><b>See firebug console for some extra feedback</b></p>
<form id="ufo-forms-33" class="form-wrapper" action="#ex2" method="post">
	<div id="ufo-forms-33-name">
		<label for="name">Name</label>
		<input id="name" type="text" name="name" value="" size="24" placeholder="Default value" />
		<span id="ufo-forms-33-name_error" class="validationError"></span>
		<span class="red">(is required AND may not be longer than 30 characters)</span>
	</div>
	<div id="ufo-forms-33-regexp">
		<label for="regexp">RegExp (^[abc,]+$)</label>
		<input type="text" name="regexp" value="" size="24" />
		<span id="ufo-forms-33-regexp_error" class="validationError"></span>
		<span class="red">(regexp /^[abc,]+$/i must match)</span>
	</div>
	<div id="ufo-forms-33-matches">
		<label for="matches">Matches Name</label>
		<input id="matches" type="text" name="matches" value="" size="24" />
		<span id="ufo-forms-33-matches_error" class="validationError"></span>
		<span class="red">(must be the same as "Name")</span>
	</div>
	<div id="ufo-forms-33-is_unique">
		<label for="is_unique">Is Unique</label>
		<input id="is_unique" type="text" name="is_unique" value="" size="24" />
		<span id="ufo-forms-33-is_unique_error" class="validationError"></span>
		<span class="red">(AJAX: must not be "HJ", "Rik" or "Simon")</span>
	</div>
	<div id="ufo-forms-33-alpha">
		<label for="alpha">Alpha</label>
		<input id="alpha" type="text" name="alpha" value="" size="24" />
		<span id="ufo-forms-33-alpha_error" class="validationError"></span>
		<span class="red">(only alphabetic characters)</span>
	</div>
	<div id="ufo-forms-33-alphanumeric">
		<label for="alphanumeric">Alphanumeriek</label>
		<input id="alphanumeric" type="text" name="alphanumeric" value="" size="24" />
		<span id="ufo-forms-33-alphanumeric_error" class="validationError"></span>
		<span class="red">(only alphabetic and numeric characters)</span>
	</div>
	<div id="ufo-forms-33-alphadash">
		<label for="alphadash">Alph, Number, -,_</label>
		<input id="alphadash" type="text" name="alphadash" value="" size="24" />
		<span id="ufo-forms-33-alphadash_error" class="validationError"></span>
		<span class="red">(only alphabetic, numeric and - and _)</span>
	</div>
	<div id="ufo-forms-33-numeric">
		<label for="numeric">Numeric</label>
		<input id="numeric" type="text" name="numeric" value="" size="24" />
		<span id="ufo-forms-33-numeric_error" class="validationError"></span>
		<span class="red">(only Codeigniter-type numeric)</span>
	</div>
	<div id="ufo-forms-33-is_numeric">
		<label for="is_numeric">Is_numeric</label>
		<input id="is_numeric" type="text" name="is_numeric" value="" size="24" />
		<span id="ufo-forms-33-is_numeric_error" class="validationError"></span>
		<span class="red">(only PHP is_numeric values)</span>
	</div>
	<div id="ufo-forms-33-age">
		<label for="age">Leeftijd</label>
		<input id="age" type="text" name="age" value="" size="24" />
		<span id="ufo-forms-33-age_error" class="validationError"></span>
		<span class="red">(integer, &gt; 15, &lt; 100)</span>
	</div>
	<div id="ufo-forms-33-decimal">
		<label for="decimal">Decimaal</label>
		<input id="decimal" type="text" name="decimal" value="" />
		<span id="ufo-forms-33-decimal_error" class="validationError"></span>
		<span class="red">(decimal, at least one number after the point)</span>
	</div>
	<div id="ufo-forms-33-is_natural">
		<label for="is_natural">Natuurlijk</label>
		<input id="is_natural" type="text" name="is_natural" value="" />
		<span id="ufo-forms-33-is_natural_error" class="validationError"></span>
		<span class="red">(natural number)</span>
	</div>
	<div id="ufo-forms-33-is_natural_no_zero">
		<label for="is_natural_no_zero">Natuurlijk &gt; 0</label>
		<input id="is_natural_no_zero" type="text" name="is_natural_no_zero" value="" />
		<span id="ufo-forms-33-is_natural_no_zero_error" class="validationError"></span>
		<span class="red">(natural number, non-zero)</span>
	</div>
	<div id="ufo-forms-33-email">
		<label for="email">Email</label>
		<input id="email" type="text" name="email" value="" />
		<span id="ufo-forms-33-email_error" class="validationError"></span>
		<span class="red">(valid email address)</span>
	</div>
	<div id="ufo-forms-33-emails">
		<label for="emails">Emails</label>
		<input id="emails" type="text" name="emails" value="" />
		<span id="ufo-forms-33-emails_error" class="validationError"></span>
		<span class="red">(valid email addresses)</span>
	</div>
	<div id="ufo-forms-33-sushi">
		<label for="sushi">Sushi</label>
		<input id="sushi" type="text" name="sushi" value="" />
		<span id="ufo-forms-33-sushi_error" class="validationError"></span>
		<span class="red">(please state your sushi needs!)</span>
	</div>
	<div>
		<label for="color">color: </label>
			<input type="radio" value="yellow" name="color" id="ufo-forms-33-color-yellow">yellow 
			<input type="radio" value="green" name="color" id="ufo-forms-33-color-green">green 
			<input type="radio" value="blue" name="color" id="ufo-forms-33-color-blue">blue 
			<input type="radio" value="purple" name="color" id="ufo-forms-33-color-purple">purple 
			<div class="error" id="ufo-forms-33-color_error"></div>
	</div>
	<div>
		<input type="submit" name="submit_2" value="Submit" />
		<input type="reset" name="reset_2" value="Reset" />
	</div>
</form>

</ol>
	<div id="qunit-fixture"></div>

	<script>var $base_url = "<?php echo base_url(); ?>"</script>
	<!-- For testing -->
	<script src="<?php echo base_url('scripts/jquery-1.8.3.min.js'); ?>"></script>
	<script src="<?php echo base_url('scripts/underscore.js'); ?>"></script>
	<script src="<?php echo base_url('scripts/backbone.js'); ?>"></script>
	<!-- Your application -->
	<script src="<?php echo base_url('scripts/ultraform.js'); ?>"></script>
	<script>

// configuration which field to show when which other field is valid
var showWhenValid = {
	alphanumeric: 'alpha', // show the alphanumeric input only if the alpha input is valid and visible
	alphadash: 'alphanumeric',
	numeric: 'alphadash', // show the numeric input only if the alphadash is valid and visible
	is_numeric: 'numeric',
	age: 'is_numeric',
	decimal: 'age',
	is_natural: 'decimal',
	is_natural_no_zero: 'is_natural',
	email: 'is_natural_no_zero',
	emails: 'email',
	sushi: 'emails'
};

// modify the Ultraform ElementModel
Ultraform.beforeExtend.ElementModel = function(obj) {

	// change initialize function
	var oldInitialize = obj.initialize;
	obj.initialize = function(attributes, options){
		// first execute the original initialize function
		var result = oldInitialize.call(this, attributes, options);

		// see if this elementModel has visibility rules
		if (this.get('name') in showWhenValid) {
			// then set isVisible of current model
			this.initializeVisibility();
		}
		else {
			// no visibility rule for this model -> always visible
			this.set({isVisible: true});
		}
	}

	// add a function to add listeners
	obj.initializeVisibility = function() {
		// get the model that the visibility depends on
		var dependOnName = showWhenValid[this.get('name')];
		var dependOnModel = this.parentCollection.findWhere({name: dependOnName});
		
		if (_.isUndefined(dependOnModel)) {
			// dependOnModel does not yet exist, wait for it to be added and then start listening to it
			this.listenTo(this.parentCollection, 'add', function(addedModel) {
				if (addedModel.get('name') == dependOnName) {
					// listen to validation changes and visibility changes on the depend-on model
					this.listenTo(addedModel, 'change', this.handleVisibility);
					// set visibility depending on current state of other elementModels
					this.handleVisibility(addedModel);
				}
			});
		}
		else {
			// listen to validation changes and visibility changes on the depend-on model
			this.listenTo(dependOnModel, 'change', this.handleVisibility);
			// set visibility depending on current state of other elementModels
			this.handleVisibility(dependOnModel);
		}
	};

	// add a function for handling visibility
	obj.handleVisibility = function(dependOnModel) {
		if (_.isUndefined(dependOnModel)) {
			// if the dependon model does not exist, make this model invisible
			this.set({isVisible: false});
		}
		else {
			// check if the depend-on model is visible and valid
			var dependOnIsVisible = dependOnModel.get('isVisible');
			var dependOnIsValid = dependOnModel.get('validationState')=='valid';

			// make the current model visible/invisible depending on the dependOn model
			this.set({isVisible: dependOnIsVisible && dependOnIsValid});            
		}
	};

	// the returned object will be used in Backbone.Model.extend(obj)
	return obj;
}

// modify the Ultraform ElementView
Ultraform.beforeExtend.ElementView = function(obj) {

	var oldInitialize = obj.initialize;
	obj.initialize = function(){
		// first execute the original initialize function
		var result = oldInitialize.call(this);

		// then start listening
		this.listenTo(this.model, 'change', this.updateVisibility)
	};

	obj.updateVisibility = function(model) {
		if (model.get('isVisible')) {
			this.$el.fadeIn();
		}
		else {
			this.$el.fadeOut();
		}
	};

	// the returned object will be used in Backbone.View.extend(obj)
	// see Backbone documentation for more information on views
	return obj;
};


	</script>
	<script>

	var ultraform;

	// initialize
	$(document).ready(function(){

		ultraform = new Ultraform({
			apiUrl: $base_url+'client_testing/api/',
			validateUrl: $base_url+'client_testing/validate/'
		});

	});

	</script>

</body>
</html>