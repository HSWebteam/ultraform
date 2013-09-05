<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @author Simon Kort <simon.kort@gmail.com>
 */
class Server_Testing extends MY_Controller {
	
	public function index()
	{	
		$this->load->library('ultraform');
		
		$form = new Ultraform('contact');
		$this->data['contact_form'] = $form;
	
		// Set some options on runtime
		$fish = array(
				'catfish' => 'African glass catfish',
				'lungfish' => 'African lungfish',
				'eater' => 'Algae eater',
				'angelfish' => 'Black angelfish',
				'whitefish' => 'Round whitefis'
				);
		
		$form->set_options('fish', $fish);
		
		if($form->request == 'callback' || $form->request == 'json')
		{
			echo $form->ajax();
		}
		elseif($form->valid)
		{
			// If form is valid do stuff
			echo 'Form is valid';
		}
		
		if($form->request == 'html')
		{
			$this->load->view('server_testing/contact.php', $this->data);
		}
	}
}