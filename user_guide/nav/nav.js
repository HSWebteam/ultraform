function create_menu(basepath)
{
	var base = (basepath == 'null') ? '' : basepath;

	document.write(
		'<table cellpadding="0" cellspaceing="0" border="0" style="width:98%"><tr>' +
		'<td class="td" valign="top">' +

		'<ul>' +
		'<li><a href="'+base+'index.html">User Guide Home</a></li>' +
		'<li><a href="'+base+'toc.html">Table of Contents Page</a></li>' +
		'</ul>' +

		'<h3>Basic Info</h3>' +
		'<ul>' +
			'<li><a href="'+base+'requirements.html">Server Requirements</a></li>' +
			'<li><a href="'+base+'license.html">License Agreement</a></li>' +
			'<li><a href="'+base+'changelog.html">Change Log</a></li>' +
			'<li><a href="'+base+'credits.html">Credits</a></li>' +
		'</ul>' +
	
		'</td><td class="td_sep" valign="top">' +

		'<h3>General Topics</h3>' +
		'<ul>' +
			'<li><a href="'+base+'general/install.html">Installation Instructions</a></li>' +		
			'<li><a href="'+base+'general/gettingstarted.html">Getting Started</a></li>' +			
			'<li><a href="'+base+'general/configuration.html">Configuration</a></li>' +
			'<li><a href="'+base+'general/formtemplates.html">Form templates</a></li>' +			
			'<li><a href="'+base+'general/elementtemplates.html">Element templates</a></li>' +			
			'<li><a href="'+base+'general/localization.html">Localization</a></li>' +
		'</ul>' +

		'</td><td class="td_sep" valign="top">' +

		'<h3>Important Functions</h3>' +
		'<ul>' +
			'<li><a href="'+base+'functions/constructor.html">Constructor</a></li>' +
			'<li><a href="'+base+'functions/add.html">Add</a></li>' +		
			'<li><a href="'+base+'functions/set.html">Set options/values/config</a></li>' +
			'<li><a href="'+base+'functions/render.html">Render</a></li>' +
			'<li><a href="'+base+'functions/validate.html">Validate</a></li>' +
			'<li><a href="'+base+'functions/export.html">Export</a></li>' +
		'</ul>' +

		'</td><td class="td_sep" valign="top">' +

		'<h3>Other Stuff</h3>' +
		'<ul>' +
			'<li><a href="'+base+'other/faq.html">FAQ / Troubleshooting</a></li>' +
			'<li><a href="./other/tips.html">Tips & Tricks</a></li>' +
		'</ul>' +

		'</td></tr></table>');
}