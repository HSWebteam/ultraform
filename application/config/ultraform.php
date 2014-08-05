<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| Location of the forms directory
| -------------------------------------------------------------------------
*/
$config['forms_dir'] = APPPATH . 'forms/';

/*
| -------------------------------------------------------------------------
| Extension of form data files
| -------------------------------------------------------------------------
*/
$config['forms_ext'] = '.json';

/*
| -------------------------------------------------------------------------
| Location of the templates directory
| -------------------------------------------------------------------------
*/
$config['template_dir'] = '/ultraform_templates/';

/*
| -------------------------------------------------------------------------
| Values that can be overridden on a specific form and every element it has
| -------------------------------------------------------------------------
*/

// Displays the value as a required flag. Useable in the templates.
$config['required_flag'] = '*';

// Client starts validating on
$config['validate_on'] = 'keyup'; // Default: keyup

// Removes the empty select field after a option is chosen in a dropdown element
$config['remove_empty'] = FALSE; // Default: FALSE

// Will disable submitting until a change in the form is detected
$config['disable_submit'] = TRUE; // Default: TRUE

// Use the 'disabled' class on the submit button if TRUE.
// This causes Twitter Bootstrap to add the 'disabled' property to the button
// , disabling all events on the button and disabling titles.
// It will enable the default Twitter Bootstrap disabled-styling.
$config['use_disabled_class'] = FALSE; // Default: FALSE

// Update the title of the submit button to reflect the reason why the submit
// button is disabled
$config['submit_set_title'] = TRUE; // Defualt: TRUE

// first line to appear in the submit button title
$config['submit_title_text'] = 'You cannot save because';

// second line to appear in the submit button title in case there are no
// changes to save
$config['submit_title_nochange'] = 'There are no changes to save';


/*
| -------------------------------------------------------------------------
| END EDITABLE CONFIG. DO NOT EDIT BELOW THIS LINE.
| -------------------------------------------------------------------------
*/

// Array of exportable config fields
$config['export_array'] = array('validate_on', 'remove_empty', 'disable_submit', 'use_disabled_class', 'submit_set_title', 'submit_title_text', 'submit_title_nochange');

/* End of file ultraform.php */
/* Location: ./application/config/ultraform.php */