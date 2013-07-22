<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 *
 * @author Simon Kort <simon.kort@gmail.com>
 *
 */
class Api extends CI_Controller {

	public function index()
	{
		// Load ultraform
		$this->load->library('ultraform');
		
		echo 'This is the API speaking<br><br>';
		
		echo 'Loading form<br>';
		$form = $this->ultraform->load('contact');
		
		echo $this->ultraform;
	}
}

/* End of file api.php */
/* Location: ./application/controllers/api.php */