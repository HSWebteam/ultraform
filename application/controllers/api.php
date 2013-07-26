<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 * @author Simon Kort <simon.kort@gmail.com>
 *
 */
class Api extends CI_Controller {

	public function index()
	{

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
}

/* End of file api.php */
/* Location: ./application/controllers/api.php */