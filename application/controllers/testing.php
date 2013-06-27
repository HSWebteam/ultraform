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
}

/* End of file testing.php */
/* Location: ./application/controllers/testing.php */