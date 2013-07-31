<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @author Simon Kort <simon.kort@gmail.com>
 */
class Server_Testing extends MY_Controller {
	
	public function index()
	{	
		// Load profiler
		//$this->output->enable_profiler(TRUE);
		
		$this->load->library('ultraform');

		$this->data['contact_form'] = $this->ultraform->load('contact');
		
		$this->load->view('server_testing/contact.php', $this->data);
	}
}		