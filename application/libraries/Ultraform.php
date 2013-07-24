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
	
	// Is the form considered valid
	public $valid = FALSE;
	
	// Error delimiters
	public $error_open;
	public $error_close;
	
	/**
	 * Constructor
	 */
	public function __construct()
	{
		// Get the CI instance
		$this->CI =& get_instance();
		
		// Load the config
		$this->config();
	}
	
	/**
	 * Config
	 * 
	 * Handles all the setup and default config.
	 */
	private function config()
	{
		$this->CI->load->helper('form');
		
		// Set the ultraform config
		$this->CI->config->load('ultraform', TRUE);
		$this->config = $this->CI->config->item('ultraform');
		
		// Set the error delimiters
		$this->error_open = $this->config['error_open'];
		$this->error_close = $this->config['error_close'];
	}
	
	/**
	 * Load a form from a JSON file in the forms directory.
	 * 
	 * @param String form The name of the form template to load.
	 */
	public function load($form)
	{
		// Load the form data using forms_dir and forms_ext from the config
		$data = file_get_contents($this->config['forms_dir'] . $form . $this->config['forms_ext']);
		
		// Decode the JSON, return objects
		$data = json_decode($data);
		
		// Build elements from data objects
		foreach($data->elements as $element)
		{
			// Add element to elements
			$this->add(get_object_vars($element));
		}
		
		// See if validation is needed, if so do it
		$this->validate();
		
		return $this;
	}
	
	/**
	 * Add
	 * 
	 * Adds an element to the form
	 */
	public function add($data)
	{
		$element = new Element();
		
		foreach($data as $key => $value)
		{
			$element->$key = $value;
		}

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
	
	/**
	 * Renders a specific element or the entire form.
	 * 
	 * @param string $name Name of the element
	 */
	public function render($name = NULL)
	{	
		
		if($name === NULL)
		{
			$html = '';
			
			// Render the entire form
			foreach($this->elements as $element)
			{
				$html .= $element->render();
			}
			
			return $html;
		}
		else
		{
			// Render just the one element
			foreach($this->elements as $element)
			{
				if($element->name === $name)
				{
					return $element->render();
				}
			}
			
			return 'No element with that name';
		}
	}
	
	/**
	 * Validates a submitted form
	 */
	public function validate()
	{
		//TODO: IF POST
		$post = $this->CI->input->post();
		
		if(!empty($post))
		{
			echo 'sup';
			// Load CI form validation library
			$this->CI->load->library('form_validation');
			
			// Set validation rules for all elements
			foreach($this->elements as $element)
			{
				$this->CI->form_validation->set_rules($element->name, $element->name, $element->rules);
			}
			
			// Run validation
			if ($this->CI->form_validation->run() == FALSE)
			{
				// The form did not pass validation
				$this->valid = FALSE;
				
				// Repopulate the form
				//$this->repopulate();
				
				foreach($this->elements as $element)
				{
					// If the POST had this element
					if(array_key_exists($element->name, $post))
					{
						// Repopulate the form
						$element->value = $post[$element->name];
						//TODO: Don't do this if this is a password name
						//TODO: Checkboxes, radio buttons
						
						$error = form_error($element->name, $this->error_open, $this->error_close);
						//TODO: Add open/close error tags
						
						if ($error)
						{
							$element->error = TRUE;
							$element->error_text = $error;
						}
					}
				}
			}
		}
	}
}

/**
 * This class represents one element of a form.
 * 
 * @author Simon Kort <simon.kort@gmail.com>
 *
 */
class Element {
	
	// CI object
	public $CI;	
	
	public $name;
	
	public $id;
	
	// The type of the name
	// Valid options: open|close|hidden|submit|text|password
	public $type;
	
	public $value;
	public $rules;
	public $placeholder;
	
	public $error = FALSE;
	public $error_text;
	
	/**
	 * Constructor
	 */
	public function __construct()
	{
		// Get the CI instance
		$this->CI =& get_instance();
	}
	
	/**
	 * Renders element.
	 */
	public function render()
	{
		// Load the template data
		$template_dir = 'ultraform_templates/';
		
		//$html = file_get_contents($template_dir . $this->type . '.php');
		
		// View data
		$data = (array)$this;
		
		$html = $this->CI->load->view($template_dir . $this->type . '.php', $data);
		
		return $html;
	}
	
	public function __toString()
	{
		return $this->render();
	}
}

/* End of file Ultraform.php */
/* Location: ./application/libraries/Ultraform.php */