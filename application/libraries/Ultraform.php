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
	
	// Name of the form
	public $name = NULL;
	
	// The set of elements in the form
	private $elements = array();
	
	// Is the form considered valid
	public $valid = FALSE;
	
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
		// Load form helper
		$this->CI->load->helper('form');
		
		// Set the ultraform config
		$this->CI->config->load('ultraform', TRUE);
		$this->config = $this->CI->config->item('ultraform');
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
		
		// Load language for this form
		$this->lang = $this->CI->lang->load('ufo_' . $form, '' , TRUE);
		
		// Set name of the form
		$this->name = $form;
		
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
		$element = new Element($this);
		
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
						
						$error = form_error($element->name, '', '');
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
	
	/**
	 * Validates a callback made through the javascript client
	 */
	public function validate_callback()
	{
		// Load the form validation library
		$this->CI->load->library('form_validation');
		
		// Only if the request method is POST
		if($this->CI->input->server('REQUEST_METHOD') === 'POST')
		{
			// Grab the post data
			$post = $this->CI->input->post();
				
			// Create validation rules for this request
			$this->CI->form_validation->set_rules($post['name'], $post['label'], $post['rule']);

			// Create proper POST value for the field to validate
			$_POST[$post['name']] = $post['value'];

			// Validate
			if($this->CI->form_validation->run() == FALSE)
			{
				// Return error message
				return json_encode(array('error', form_error($post['name'])));
			}
			else
			{
				return json_encode(array('valid', 'valid'));
			}
		}
	}
	
	/**
	 * Returns a translation
	 * 
	 * @param string $line Translation key
	 */
	public function lang($line)
	{
		// Check if translation key exists
		if(array_key_exists($line, $this->lang))
		{
			// Exists
			return $this->lang[$line];
		}
		else
		{
			// Does not exist
			return '';
		}
	}
	
	/**
	 * Export the form for external client validating.
	 */
	public function export()
	{
		$export = array();
		
		// Export elements
		$export['elements'] = array();
		foreach($this->elements as $element)
		{
			if($element->type !== 'open' && $element->type !== 'close')
			{
				$export['elements'][$element->name] = $element->export();
			}
		}
		
		// Export messages
		$messages = $this->CI->lang->load('form_validation', '' , TRUE);
		$export['messages'] = $messages;
		
		return json_encode($export);
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
	public $form;
	public $label;
	
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
	public function __construct($form)
	{
		// Get the CI instance
		$this->CI =& get_instance();
		
		// Assign parent form
		$this->form = $form;
	}
	
	/**
	 * Renders element.
	 */
	public function render()
	{
		// Load the template data
		$template_dir = $this->form->config['template_dir'];
		
		// View data
		$data = (array)$this;
		
		// Get translated values & derivative values
		$data['label'] = $this->form->lang($this->name);
		$data['placeholder'] = $this->form->lang($this->name . '_placeholder');
		$data['id'] = 'ufo-forms-' . $this->form->name . '-' . $this->name;
		
		// Determine what template to use for this element
		if(file_exists(APPPATH . '/views' . $template_dir . '_' . $this->name . '.php'))
		{
			// Step 1: Check to see if the element itself has a unique template
			$html = $this->CI->load->view($template_dir . '_' . $this->name, $data);
		}
		elseif(file_exists(APPPATH . '/views' . $template_dir . '/' . $this->form->name . '/' . $this->type . '.php'))
		{
			// Step 2: Check to see if the element has a template in this specific form
			$html = $this->CI->load->view($template_dir . '/' . $this->form->name . '/' . $this->type, $data);
		}
		else
		{
			// Step 3: If step 1 and 2 are FALSE then we use the default element template
			$html = $this->CI->load->view($template_dir . $this->type, $data);
		}
		
		return $html;
	}
	
	/**
	 * Exports the element for external use.
	 * 
	 * Example: For use in client side validating.
	 */
	public function export()
	{
		$export = array();
		
		$export['name'] = $this->name;
		$export['label'] = $this->form->lang($this->name);;
		$export['value'] = $this->value;
		$export['rules'] = $this->rules;

		return $export;
	}
	
	public function __toString()
	{
		return $this->render();
	}
}

/* End of file Ultraform.php */
/* Location: ./application/libraries/Ultraform.php */