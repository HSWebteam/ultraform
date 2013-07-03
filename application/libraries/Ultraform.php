<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * This class manages, records, validates and handles one form.
 * 
 * @author Simon Kort <simon.kort@gmail.com>
 * 
 */
class Ultraform {
	
	// CI object
	public $CI;
	
	// Config loaded from ultraform.php in config dir
	public $config = array();
	
	// The set of elements in the form
	private $elements = array();
	
	/**
	 * Constructor
	 */
	public function __construct()
	{
		// Get the CI instance
		$this->CI =& get_instance();
		$this->CI->load->helper('form');
		
		$this->config();
	}
	
	/**
	 * Config
	 * 
	 * Handles all the setup and default config.
	 */
	private function config()
	{
		// Load the ultraform helper
		$this->CI->load->helper('ultraform');
		
		// Set the ultraform config
		$this->CI->config->load('ultraform', TRUE);
		$this->config = $this->CI->config->item('ultraform');
	}
	
	/**
	 * Add
	 * 
	 * Adds an element to the form
	 */
	public function add($data)
	{
		$element = new Element();
		$element->name = $data['name'];
		$element->id = $data['name'];
		$element->type = $data['type'];
		$this->elements[] = $element;
	}
	
	/**
	 * Get_elements
	 * 
	 * TODO: Temporary help/test function
	 */
	public function get_elements()
	{
		return $this->elements;
	}
}

/**
 * This class represents one element of a form.
 * 
 * @author Simon Kort <simon.kort@gmail.com>
 *
 */
class Element {
	
	public $name;
	
	public $id;
	
	// The type of the field
	// Valid options: open|close|hidden|submit|text|password
	public $type;
	
	public function __construct()
	{
		
	}
}

/* End of file Ultraform.php */
/* Location: ./application/libraries/Ultraform.php */