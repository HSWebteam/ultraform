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
				array('name' => 'name', 'type' => 'text',   'value' => 'Hendrik Jan van Meerveld', 'rules' => 'required max:20'),
				array('name' => 'age',  'type' => 'number', 'value' => 37, 'rules' => 'integer min:16 max:100'),
				array('name' => 'cursus', 'type' => 'text',   'value' => 'Object georienteerd programmeren in Javascript', 'rules' => 'required max:20'),
				array('name' => 'duration',  'type' => 'number', 'value' => 4, 'rules' => 'integer min:1 max:14'),
				array('name' => 'price',    'type' => 'number', 'value'=> 2500.0, 'rules' => 'number max:3000')
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