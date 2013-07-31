<?php

class MY_Controller extends CI_Controller {
	
	public function __construct() {
		parent::__construct();
		
		// Profiler if developing
		if(ENVIRONMENT == 'development')
		{
			$this->output->enable_profiler(TRUE);
		}
	}
	
	public function sushi($str)
	{
		if(!strstr($str, 'sushi'))
		{
			$this->form_validation->set_message('sushi', 'The %s field must contain the word "sushi"!');
			return FALSE;
		}

		return TRUE;
	}
}