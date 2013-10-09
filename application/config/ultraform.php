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

// Client starts validating on
$config['validate_on'] = 'keyup'; // Default: keyup

// Hides the empty select field after a option is chosen in a dropdown element
$config['hide_empty'] = FALSE; // Default: FALSE

// Will disable submitting until a change in the form is detected
$config['submit_change'] = FALSE; // Default: FALSE

/* End of file ultraform.php */
/* Location: ./application/config/ultraform.php */