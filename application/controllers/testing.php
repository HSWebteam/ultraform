<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Testing extends CI_Controller {

	/**
	* QUnit test page for Javascript testing on the client
	*/
	public function qunit()
	{
		$this->load->helper('url');
		$this->load->view('testing/qunit');
	}

	/**
	* testobjects -- Mocks the API
	*/
	public function mocks($one=null)
	{
		// for: model.fetch
		// GET /mocks/33
		if ($this->server('REQUIST_METHOD') === 'GET' AND $one==33)
		{
			// return object with id 33 and status 200: success
		}
		// for: model.save
		// PUT /mocks/33
		elseif ($this->server('REQUIST_METHOD') === 'PUT' AND $one==33)
		{
			// return status code 200: success, but no content to return
		}
		// for: model.destroy
		// DELETE /mocks/33
		elseif ($this->server('REQUIST_METHOD') === 'DELETE' AND $one==33)
		{
			// return status code 204: success, but no content to return
		}
		// for: collection.add
		// POST /mocks
		elseif ($this->server('REQUIST_METHOD') === 'POST' AND is_null($one))
		{
			// return same object, but including the new id for the object
			// return status code 201: resource created
		}
		// for: collection.fetch
		// GET /mocks
		elseif ($this->server('REQUIST_METHOD') === 'GET' AND is_null($one))
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