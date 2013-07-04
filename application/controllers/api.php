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
		
		// Get the contact and signup forms
		$form_contact = get_form('contact');
		$form_signup = get_form('signup');
		
		echo 'This is the API speaking<br><br>';
		
		echo '<pre>';
		print_r($form_contact->get_elements());
		print_r($form_signup->get_elements());
		echo '</pre>';
		
		echo 'And now for some JSON!<br><br>';
		
		echo json_encode($form_contact->get_elements());
		echo json_encode($form_signup->get_elements());
	}
}

/* End of file api.php */
/* Location: ./application/controllers/api.php */