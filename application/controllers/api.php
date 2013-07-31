<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 * @author Simon Kort <simon.kort@gmail.com>
 *
 */
class Api extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
		
		// Make sure the profiler is turned off
		$this->output->enable_profiler(FALSE);
		
		// See if the call is a AJAX call, otherwise stop processing
		if(!$this->input->is_ajax_request())
		{
			exit;
		}
	}
	
	/**
	 * Get a form in JSON format
	 */
	public function forms($name)
	{
		// Load ultraform
		$this->load->library('ultraform');
		
		$form = new Ultraform();
		
		// Load the requested form
		$form->load($name);
		
		echo $form->export();
	}
	
	/**
	 * Validate a callback rule
	 */
	public function validate()
	{
		// Load ultraform
		$this->load->library('ultraform');
		
		// Validate the request
		echo $this->ultraform->validate_callback();
	}
}

/* End of file api.php */
/* Location: ./application/controllers/api.php */