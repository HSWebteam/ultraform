<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

	function ultraform_signup()
	{
		$ultraform = new Ultraform();
		
		$ultraform->add(array('name' => 'signup_form_open',  'type' => 'open'));
		$ultraform->add(array('name' => 'username', 'type' => 'text'));
		$ultraform->add(array('name' => 'password', 'type' => 'password'));
		$ultraform->add(array('name' => 'submit', 'type' => 'submit'));
		$ultraform->add(array('name' => 'signup_form_close',  'type' => 'close'));
		
		return $ultraform;
	}