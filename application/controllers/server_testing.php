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
	
		$config_form = array('hide_empty' => true);
		$form->set_element_config('username', $config_form);
		$form->set_element_config('color', $config_form);
		
		$form2 = new Ultraform('m_login', 'login');
		$this->data['login_form'] = $form2;
		
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

		if($form2->request == 'callback' || $form2->request == 'json')
		{
			echo $form2->ajax();
		}
		elseif($form2->valid)
		{
			// If form is valid do stuff
			echo 'Form2 is valid';
		}		
		
		if($form->request == 'html' || $form2->request == 'html')
		{
			$this->load->view('server_testing/contact.php', $this->data);
		}
	}
	
	public function posttest()
	{
		// When submitted this should include a POST value for user
		echo '<form name="input" action="" method="post">
			Username: <input type="text" name="user">
			<input type="submit" value="Submit">
			</form> ';
	}
	
	public function noviewtest()
	{
		$this->output->enable_profiler(FALSE);
		
		echo '<pre>';
		print_r($_POST);
		echo '</pre>';
		
		$this->load->library('ultraform');		
		
		$form = new Ultraform('contact');
		echo $form;
	}
}