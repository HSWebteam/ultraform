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

	public function temp()
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
	* testobjects -- Mocks the API
	*/
	public function mocks($one=null)
	{
		// for: model.fetch
		// GET /mocks/33
		if ($_SERVER['REQUEST_METHOD'] === 'GET' AND !is_null($one))
		{
			// return the models for page $pagename
			$obj = array(
				'elements' => array(
					array(
						'field' => 'name',
						'label' => 'Naam',
						'value' => 'Hendrik Jan van Meerveld',
						'rules' => 'required|max_length[30]'),
					array(
						'field' => 'regexp',
						'label' => 'RegExp',
						'value' => 'abcabcabc',
						'rules' => 'regexp_match[/^[abc,]+$/i]'),
					array(
						'field' => 'matches',
						'label' => 'Matches Name',
						'value' => 'Hendrik Jan van Meerveld',
						'rules' => 'matches[name]'),
					array(
						'field' => 'age',
						'label' => 'Leeftijd',
						'value' => 37,
						'rules' => 'integer|greater_than[15]|less_than[100]'),
					array(
						'field' => 'cursus',
						'label' => 'Cursus',
						'value' => 'Object georienteerd programmeren in Javascript',
						'rules' => 'required|max_length[21]'),
					array(
						'field' => 'duration',
						'label' => 'Cursusduur in dagen',
						'value' => 4,
						'rules' => 'integer|greater_than[1]|less_than[14]'),
					array(
						'field' => 'price',
						'label' => 'Kosten',
						'value'=> 2500.0,
						'rules' => 'numeric|less_than[3000]')
				),
				'messages' => array(
					'required' => 'Het %s veld mag niet leeg blijven.',
					'regexp_match' => 'Het %s veld moet aan de regular expression %0 voldoen',
					'max_length' => 'Het %s veld mag niet meer dan %0 tekens bevatten.',
					'greater_than' => 'De waarde in %s moet groter zijn dan %0.',
					'less_than' => 'De waarde in %s moet kleiner zijn dan %0.',
					'matches' => 'Het %s veld moet gelijk zijn aan het %0 veld'
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