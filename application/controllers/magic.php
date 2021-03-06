<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @author Rik van Duijn <ik@rikvanduijn.nl>
 */
class Magic extends MY_Controller 
{

	private $_account = array(
			'username'	=>	'RikdeSik',
			'password'	=>	'wachtwoord'
		);

	public function __construct() 
	{
		parent::__construct();
		
		$this->config->load('magic');
	}	

	public function index()
	{	
		$this->load->library('ultraform');

		$form = new Ultraform('m_login');
		$this->data['login_form'] = $form;

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

		$r_form = new Ultraform('m_register');
		$this->data['register_form'] = $r_form;

		if($r_form->request == 'callback' || $r_form->request == 'json')
		{
			echo $r_form->ajax();
		}
		elseif($r_form->valid)
		{
			// If form is valid, create an account for the user
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

	public function all_fields()
	{
		$this->load->library('ultraform');

		$form = new Ultraform('all_fields');
		$this->data['all_fields'] = $form;

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
			$this->data['title'] 	= 'All fields';
			$this->data['header'] 	= $this->load->view('magic/header.php', $this->data, TRUE);
			$this->data['content'] 	= $this->load->view('magic/all_fields/all_fields.php', $this->data, TRUE);
			$this->data['footer'] 	= $this->load->view('magic/footer.php', $this->data, TRUE);

			$this->load->view('magic/template.php', $this->data);
		}
	}

	public function search()
	{
		$this->load->library('ultraform');

		$form = new Ultraform('m_search');
		$this->data['search_form'] = $form;

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

		$creature_types = $this->config->item('creature_types');

		$creature_type_list = '';

		end($creature_types);
		$last_key = key($creature_types);
		foreach($creature_types as $key => $creature_type)
		{
			$creature_type_list .= '"' . $creature_type . '"';
			if($key !== $last_key)
			{
				$creature_type_list .= ', ';
			}
		}

		$form->set_options('creature_type', $creature_type_list);

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