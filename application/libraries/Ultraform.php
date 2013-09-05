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

	// Language data
	public $lang = NULL;
	
	// The set of elements in the form
	private $elements = array();

	// Type of request, valid: html|json|validate
	public $request = 'Not initialized';
	
	// Is the form considered valid
	public $valid = FALSE;
	
	/**
	 * Constructor
	 */
	public function __construct($form=NULL, $name=NULL)
	{
		if(gettype($form) == 'array')
		{
			// This is the codeigniter loader, ignore it
			return FALSE;
		}

		// Assign name if set
		$this->name = $name;

		// Get the CI instance
		$this->CI =& get_instance();

		// Load the config
		$this->config();
		
		// Preprocess the form
		$this->preprocess($form);
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
	 * Pre-process a given form. This will prepare everything neccesary to use this form for this request type
	 * This function determines the type of request based on the POST variable. See docs for more information.
	 * 
	 * @param String $form The name of the form to process
	 */
	public function preprocess($form)
	{
		// See if the 'ufo-action' POST is present
		if($this->CI->input->post('ufo-action'))
		{	
			$this->request = 'json';
			// This is a AJAX call from the client
			if($this->CI->input->post('ufo-action') == 'callback')
			{
				// This is a validation callback, do not load the full form
				$this->request = 'callback';
				return TRUE;
			}
			elseif($this->CI->input->post('ufo-form') != $form)
			{
				// The POST is not meant for this form
				return $this;
			}
		}
		else
		{
			// Just preprocess the form without any AJAX
			$this->request = 'html';
		}
		
		$this->load($form);
		
		return $this;
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
		
		// Try to load a language file for this form
		if(file_exists($this->CI->input->server('DOCUMENT_ROOT') . '/' . APPPATH . 'language/' . $this->CI->config->item('language') . '/ufo_' . $form . '_lang.php'))
		{
			$this->lang = $this->CI->lang->load('ufo_' . $form, '' , TRUE);
		}	
		
		// Build elements from data objects
		foreach($data->elements as $element)
		{
			// Add element to elements
			$this->add(get_object_vars($element));
		}

		// Set name of the form
		$this->name = $form;

		// See if validation is needed, if so do it
		if($this->request == 'html')
		{
			$this->validate();
		}
		
		return $this;
	}
	
	/**
	 * Ajax
	 * 
	 * This function handles all the ajax output the form can be required to generate.
	 * It bases the output on the $this->request variable.
	 */
	public function ajax()
	{
		if($this->request == 'callback')
		{
			// Do callback
			$ajax = $this->validate_callback();
		}
		elseif($this->request == 'json')
		{
			// Do export
			$ajax = $this->export();
		}
		else
		{
			// Unknown request
			$ajax = 'Request type unknown, run preprocess or check your request POST variable.';
		}
		
		return $ajax;
	}

	/**
	 * Add
	 *
	 * Adds an element to the form
	 */
	public function add($data)
	{
		$element = new Element($this, $data);

		$this->elements[$element->name] = $element;
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
	 * Sets the options of a element on runtime
	 * 
	 * @param string $element_name Element name
	 * @param array $options Array of options key/value
	 */
	public function set_options($element_name, $options)
	{
		// See if the element exists
		if(array_key_exists($element_name, $this->elements))
		{
			// Run set_options of element object
			$element = $this->elements[$element_name]->set_options($options);
			
			return TRUE;
		}
		else
		{
			// Return error if the element does not exist
			return 'ERROR: No element with that name';
		}
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
			else
			{
				// Form is valid
				$this->valid = TRUE;
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
			$this->CI->form_validation->set_rules($post['ufo-name'], $post['ufo-label'], $post['uf-rule']);

			// Create proper POST value for the field to validate
			$_POST[$post['ufo-name']] = $post['ufo-value'];

			// Set output type to json
			$this->CI->output->set_content_type('application/json');

			// Validate
			if($this->CI->form_validation->run() == FALSE)
			{
				// Return error message
				return json_encode(array('valid' => FALSE, 'error' => form_error($post['ufo-name'])));
			}
			else
			{
				return json_encode(array('valid' => TRUE));
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
		// Check to see if we have a loaded language file
		if($this->lang != NULL)
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
				return FALSE;
			}
		}
		else
		{
			// No language file, so no translation
			return FALSE;
		}
	}

	/**
	 * Export the form for external client validating.
	 */
	public function export()
	{
		// If the profiler is on, turn it off
		$this->CI->output->enable_profiler(FALSE);
		
		$export = array();

		// Export elements
		$export['elements'] = array();
		foreach($this->elements as $element)
		{
			if($element->type !== 'open' && $element->type !== 'close')
			{
				$export['elements'][] = $element->export();
			}
		}

		// Set output type to json
		$this->CI->output->set_content_type('application/json');
		
		// Export messages
		$messages = $this->CI->lang->load('form_validation', '' , TRUE);
		$export['messages'] = $messages;
		
		return json_encode($export);
	}
	
	/**
	 * To string
	 */
	public function __toString()
	{
		return $this->render();
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

	// The type of the element
	public $type;

	public $value;
	public $options = array();
	public $rules;
	public $placeholder;

	public $error = FALSE;
	public $error_text;

	/**
	 * Constructor
	 */
	public function __construct($form, $data)
	{
		// Get the CI instance
		$this->CI =& get_instance();

		// Assign parent form
		$this->form = $form;
		
		foreach($data as $key => $value)
		{
			$this->$key = $value;
		}
		
		// Set the label for this element
		$this->set_label();
		
		// Generate any options this element has
		if(!empty($this->options))
		{
			$this->generate_options();
		}
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
		$data['label'] = $this->label;
		$data['placeholder'] = $this->form->lang($this->name . '_placeholder');
		$data['id'] = 'ufo-' . $this->form->name . '-' . $this->name;
		$data['formname'] = $this->form->name;
		$data['options'] = $this->options;

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
		//$export['label'] = $this->form->lang($this->name);
		$export['label'] = $this->label;
		$export['value'] = $this->value;
		$export['rules'] = $this->rules;
		
		// Add options if this element has them
		if($this->options != NULL)
		{
			$export['options'] = $this->options;
		}

		return $export;
	}

	/**
	 * Will generate a translated array of options
	 */
	private function generate_options()
	{
		// Assign the element's options array to a local variable
		$options = $this->options;
		
		// Reset options
		$this->options = array();		
		
		foreach($options as $key => $option)
		{
			// See if there is a language file translation
			if($this->form->lang($this->name . '_option_' . $option))
			{
				// There is a language translation
				$this->options[$option] = $this->form->lang($this->name . '_option_' . $option);
			}
			// Use the JSON translation
			elseif(gettype($options) == 'object')
			{
				$this->options[$key] = $option;
			}
			// Use the value as key
			else
			{
				$this->options[$option] = $option;
			}
		}
		
		return $this->options;
	}
	
	/**
	 * Determines what the human readable string should be set to for this element
	 */
	private function set_label()
	{
		// If we have a lang file entry use that
		if($this->form->lang($this->name))
		{
			// Get the label from the language file
			$this->label = $this->form->lang($this->name);
		}
		// If we have a JSON data file 'lang' value use that
		elseif($this->label != NULL)
		{
			// Do nothing, we use the label from the JSON
		}
		// If we don't have anything use the element name
		else
		{
			$this->label = $this->name;
		}
		
		return $this->label;
	}
	
	/**
	 * Sets options of the element.
	 * 
	 * @param array $options Array of options key/value
	 */
	public function set_options($options)
	{
		$this->options = $options;
		
		return TRUE;
	}
	
	/**
	 * To string
	 */
	public function __toString()
	{
		return (String) $this->render();
	}
}

/* End of file Ultraform.php */
/* Location: ./application/libraries/Ultraform.php */