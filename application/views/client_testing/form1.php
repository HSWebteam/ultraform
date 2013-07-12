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

input[maxlength='3'] {	width: 30px;	}
input[maxlength='4'] {	width: 40px;	}
input[maxlength='5'] {	width: 45px;	}

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
}
</style>

<h1>A test form:</h1>
<p><b>See firebug console for some extra feedback</b></p>
<form id="ufo-forms-33" class="form-wrapper" action="#ex2" method="post">
	<div id="ufo-forms-33-name">
		<label for="name">Name</label>
		<input id="name" type="text" name="name" value="" size="24" placeholder="Default value" />
		<span class="validationError"></span>
		<span class="red">(is required AND may not be longer than 30 characters)</span>
	</div>
	<div id="ufo-forms-33-regexp">
		<label for="regexp">RegExp (^[abc,]+$)</label>
		<input id="regexp" type="text" name="regexp" value="" size="24" />
		<span class="validationError"></span>
		<span class="red">(regexp /^[abc,]+$/i must match)</span>
	</div>
	<div id="ufo-forms-33-matches">
		<label for="matches">Matches Name</label>
		<input id="matches" type="text" name="matches" value="" size="24" />
		<span class="validationError"></span>
		<span class="red">(must be the same as "Name")</span>
	</div>
	<div id="ufo-forms-33-is_unique">
		<label for="is_unique">Is Unique</label>
		<input id="is_unique" type="text" name="is_unique" value="" size="24" />
		<span class="validationError"></span>
		<span class="red">(AJAX: must not be "HJ", "Rik" or "Simon")</span>
	</div>
	<div id="ufo-forms-33-age">
		<label for="age">Age</label>
		<input id="age" class="required" type="text" name="age" value="" size="24" required="required" />
		<span class="validationError"></span>
	</div>
	<div id="ufo-forms-33-cursus">
		<label for="cursus">Cursus</label>
		<input id="cursus" class="number" name="cursus" value="" />
		<span class="validationError"></span>
	</div>
	<div id="ufo-forms-33-duration">
		<label for="duration">Duration</label>
		<input id="duration" type="email" name="duration" value="" />
		<span class="validationError"></span>
	</div>
	<div id="ufo-forms-33-price">
		<label for="price">Url</label>
		<input id="price" type="url" name="price" value="" />
		<span class="validationError"></span>
	</div>
	<div>
		<label for="select_2">Select</label>
		<select id="select_2" class="placeholder" name="select_2" size="1">
			<option value="">Default value</option>
			<option value="val2">Second value</option>
			<option value="val3">Third value</option>
			<option value="val4">Fourth value</option>
		</select>
		<span class="validationError"></span>
	</div>
	<div>
		<input type="submit" name="submit_2" value="Submit" />
		<input type="reset" name="reset_2" value="Reset" />
	</div>
</form>