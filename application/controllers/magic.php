<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @author Rik van Duijn <ik@rikvanduijn.nl>
 */
class Magic extends MY_Controller {
	
	private $_account = array(
			'username'	=>	'RikdeSik',
			'password'	=>	'wachtwoord'
		);

	public function index()
	{	
		$this->load->library('ultraform');

		$form = new Ultraform();
		$this->data['login_form'] = $form->preprocess('m_login');

		if($form->request == 'callback' || $form->request == 'json')
		{
			echo $form->ajax();
		}
		elseif($form->valid)
		{
			// If form is valid log the user in
			if($this->input->post('username') === $this->_account['username'] && $this->input->post('password') === $this->_account['password'])
			{
				// valid login
				redirect('magic/search');
			}
			else
			{
				// invalid login

			}
			
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

	public function register()
	{
		$this->load->library('ultraform');

		$form = new Ultraform();
		$this->data['register_form'] = $form->preprocess('m_register');

		if($form->request == 'callback' || $form->request == 'json')
		{
			echo $form->ajax();
		}
		elseif($form->valid)
		{
			// If form is valid do stuff
			echo 'Sorry, registering does not work';
		}

		if($form->request == 'html')
		{
			$this->data['title'] 	= 'Register';
			$this->data['header'] 	= $this->load->view('magic/header.php', $this->data, TRUE);
			$this->data['content'] 	= $this->load->view('magic/register/register.php', $this->data, TRUE);
			$this->data['footer'] 	= $this->load->view('magic/footer.php', $this->data, TRUE);

			$this->load->view('magic/template.php', $this->data);
		}
	}

	public function search()
	{
		$this->load->library('ultraform');

		$form = new Ultraform();
		$this->data['search_form'] = $form->preprocess('m_search');

		$card_types = array(
				'artifact'		=>	'Artifact',
				'creature'		=>	'Creature',
				'enchantment'	=>	'Enchantment',
				'instant'		=>	'Instant',
				'land'			=>	'Land',
				'planeswalker'	=>	'Planeswalker',
				'sorcery'		=>	'Sorcery',
				'tribal'		=>	'Tribal'
			);

		$form->set_options('type', $card_types);

		if($form->request == 'callback' || $form->request == 'json')
		{
			echo $form->ajax();
		}
		elseif($form->valid)
		{
			// If form is valid do stuff
			
		}

		if($form->request == 'html')
		{
			$this->data['title'] 	= 'Search';
			$this->data['header'] 	= $this->load->view('magic/header.php', $this->data, TRUE);
			$this->data['content'] 	= $this->load->view('magic/search/search.php', $this->data, TRUE);
			$this->data['footer'] 	= $this->load->view('magic/footer.php', $this->data, TRUE);

			$this->load->view('magic/template.php', $this->data);
		}
	}
}