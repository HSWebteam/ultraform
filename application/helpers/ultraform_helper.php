<?php

/**
 * 	Get the designated form to fill the ultraform object
 * @param string Name of the form
 */
function get_form($form)
{
	$forms_dir = APPPATH . 'forms/' . $form . '.php';
	
	include_once($forms_dir);
	
	return call_user_func('ultraform_' . $form);
}