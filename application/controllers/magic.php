<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @author Rik van Duijn <ik@rikvanduijn.nl>
 */
class Magic extends MY_Controller {
	
	public function index()
	{	
		$this->load->library('ultraform');
		$this->lang->load('magic');

		$form = new Ultraform();
		$this->data['login_form'] = $form->preprocess('m_login');

		if($form->request == 'callback' || $form->request == 'json')
		{
			echo $form->ajax();
		}
		elseif($form->valid)
		{
			// If form is valid do stuff
			echo 'Login is valid';
		}

		if($form->request == 'html')
		{
			$this->data['title'] 	= 'Login';
			$this->data['header'] 	= $this->load->view('magic/header.php', $this->data, TRUE);
			$this->data['content'] 	= $this->load->view('magic/login/login.php', $this->data, TRUE);
			$this->data['footer'] 	= $this->load->view('magic/footer.php', $this->data, TRUE);

			$this->load->view('magic/template.php', $this->data);
		}
	}
}