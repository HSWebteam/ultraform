<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Client_Testing extends CI_Controller {

	/**
	* QUnit test page for Javascript testing on the client
	*/
	public function qunit()
	{
		$this->load->helper('url');
		$this->load->view('client_testing/qunit');
	}

	public function index()
	{
		$this->load->helper('url');
		$this->load->view('client_testing/temp');
	}

	/**
	* Form for testing validVal/Backbone, copied HTML5 example from validVal webiste
	*/
	public function form1()
	{
		$this->load->helper('url');
		$this->load->view('client_testing/form1');
	}

	/**
	* testobjects -- Mocks the server validation
	*/
	public function validate()
	{
		// get the rule, like callback_sushi[wasabi]
		$rule = $this->input->post('rule');
		// split the rule, like array('callback_sushi', 'wasabi]')
		$rule_e = explode('[', $rule);
		// get the action part, like 'callback_sushi'
		$action = $rule_e[0];
		// get the arguments, like 'wasabi'
		$args   = isset($rule_e[1]) ? array(substr($rule_e[1], 0, strlen($rule_e[1])-1)) : array();
		$value  = $this->input->post('value');



		if ($_SERVER['REQUEST_METHOD'] === 'POST')
		{

			$result = array(
				'result' => 'invalid',
				'error'  => 'the function '.$action.' was not found'
			);

			if ($action==='is_unique') {
				$not_unique = array('HJ', 'Rik', 'Simon');

				$valid = (array_search($value, $not_unique)===FALSE);

				$result = array(
					'valid' => $valid,
					'error'  => $valid ? '' : 'The value '.$value.' allready exists in the column '.$args[0]
				);
			}
			else if ($action==='callback_sushi') {

				$valid = strpos(strtoupper($value), strtoupper($args[0]))!==FALSE;

				$result = array(
					'valid' => $valid,
					'error'  => $valid ? '' : 'You cannot get Sushi without '.$args[0]
				);
			}


            // return a json representation of the result
            $this->output->set_content_type('application/json');

            // return the result
            $this->output->enable_profiler(FALSE);
            $this->output->set_output(json_encode($result));
            return;

		}

	}

	/**
	* testobjects -- Mocks the API
	*/
	public function api($forms_name='', $one=null)
	{
		// for: model.fetch
		// GET /mocks/33
		if ($_SERVER['REQUEST_METHOD'] === 'GET' AND $forms_name=='forms' AND !is_null($one))
		{
			// return the models for page $pagename
			$obj = array(
				'elements' => array(
					array(
						'name'  => 'name',
						'label' => 'Naam',
						'value' => 'Hendrik Jan van Meerveld',
						'rules' => 'required|max_length[30]'),
					array(
						'name'  => 'regexp',
						'label' => 'RegExp',
						'value' => 'abcabcabc',
						'rules' => 'regexp_match[/^[abc,]+$/i]'),
					array(
						'name'  => 'matches',
						'label' => 'Matches Name',
						'value' => 'Hendrik Jan van Meerveld',
						'rules' => 'matches[name]'),
					array(
						'name'  => 'is_unique',
						'label' => 'Is Unique',
						'value' => 'Rik',
						'rules' => 'is_unique[users.username]'),
					array(
						'name'  => 'alpha',
						'label' => 'Alpha',
						'value' => 'abc',
						'rules' => 'alpha'),
					array(
						'name'  => 'alphanumeric',
						'label' => 'Alphanumeric',
						'value' => 'abc123',
						'rules' => 'alpha_numeric'),
					array(
						'name'  => 'alphadash',
						'label' => 'Alphadash',
						'value' => '_abc-123',
						'rules' => 'alpha_dash'),
					array(
						'name'  => 'numeric',
						'label' => 'Numeric',
						'value' => '12.50',
						'rules' => 'numeric'),
					array(
						'name'  => 'is_numeric',
						'label' => 'Is Numeric',
						'value' => '12.50e-10',
						'rules' => 'is_numeric'),
					array(
						'name'  => 'age',
						'label' => 'Leeftijd',
						'value' => 37,
						'rules' => 'integer|greater_than[15]|less_than[100]'),
					array(
						'name'  => 'decimal',
						'label' => 'Decimaal',
						'value' => '10.1',
						'rules' => 'decimal'),
					array(
						'name'  => 'is_natural',
						'label' => 'Natuurlijk',
						'value' => '13',
						'rules' => 'is_natural'),
					array(
						'name'  => 'is_natural_no_zero',
						'label' => 'Natuurlijk &gt; 0',
						'value' => '14',
						'rules' => 'is_natural_no_zero'),
					array(
						'name'  => 'email',
						'label' => 'Email',
						'value' => 'h.j.vanmeerveld@uu.nl',
						'rules' => 'valid_email'),
					array(
						'name'  => 'emails',
						'label' => 'Emails',
						'value' => 'h.j.vanmeerveld@uu.nl, s.kort@uu.nl',
						'rules' => 'valid_emails'),
					array(
						'name'  => 'sushi',
						'label' => 'Sushi',
						'value' => 'Has Wasabi',
						'rules' => 'callback_sushi[wasabi]')
				),
				'messages' => array(
					'required' => 'Het %s veld mag niet leeg blijven.',
					'regexp_match' => 'Het %s veld moet aan de regular expression %s voldoen',
					'max_length' => 'Het %s veld mag niet meer dan %s tekens bevatten.',
					'min_length' => 'Het %s veld moet meer dan %s tekens bevatten.',
					'greater_than' => 'De waarde in %s moet groter zijn dan %s.',
					'less_than' => 'De waarde in %s moet kleiner zijn dan %s.',
					'matches' => 'Het %s veld moet gelijk zijn aan het %s veld',
					'alpha' => 'Het %s veld mag alleen letters bevatten',
					'alpha_numeric' => 'Het %s veld mag alleen letters en cijfers bevatten',
					'alpha_dash' => '%s mag alleen letters, cijfers, minteken en underscore bevatten',
					'numeric' => '%s mag alleen getallen bevatten (Codeigniter type numbers)',
					'is_numeric' => '%s mag alleen getallen bevatten (PHP type numbers)',
					'integer' => 'Het %s veld mag alleen integers bevatten',
					'decimal' => 'Het %s veld moet een decimale waarde bevatten',
					'is_natural' => 'Het %s veld moet een natuurlijk getal bevatten',
					'is_natural_no_zero' => 'Het %s veld moet een natuurlijk getal boven nul bevatten',
					'valid_email' => 'Het %s veld moet een geldig email adres bevatten',
					'valid_emails' => '%s veld moet geldige emailadressen bevatten, gescheiden door komma\'s'
				)
			);

            // return a json representation of the result
            $this->output->set_content_type('application/json');

            // return the result
            $this->output->enable_profiler(FALSE);
            $this->output->set_output(json_encode($obj));
            return;

		}
		// for: model.save
		// PUT /mocks/33
		elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' AND $one==33)
		{
			// return status code 200: success, but no content to return
		}
		// for: model.destroy
		// DELETE /mocks/33
		elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE' AND $one==33)
		{
			// return status code 204: success, but no content to return
		}
		// for: collection.add
		// POST /mocks
		elseif ($_SERVER['REQUEST_METHOD'] === 'POST' AND is_null($one))
		{
			// return same object, but including the new id for the object
			// return status code 201: resource created
		}
		// for: collection.fetch
		// GET /mocks
		elseif ($_SERVER['REQUEST_METHOD'] === 'GET' AND is_null($one))
		{
			// return collection
			// return status code 200: success
		}
		else
		{
			// return 404: not found
		}

	}
}

/* End of file testing.php */
/* Location: ./application/controllers/testing.php */