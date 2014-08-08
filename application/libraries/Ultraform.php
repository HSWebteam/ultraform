<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * @file This class manages, records, validates and handles one form.
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

	// JSON source of the form
	public $source = NULL;

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

		$this->source = $form;

		// Assign name if set
		if($name != NULL)
		{
			// Override name
			$this->name = $name;
		}
		else
		{
			// Default name
			$this->name = $form;
		}

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
	 */
	public function preprocess()
	{
		// See if the 'ufo-action' POST is present
		if($this->CI->input->post('ufo-action'))
		{
			// This is a JSON request
			$this->request = 'json';

			// This is a AJAX call from the client
			if($this->CI->input->post('ufo-action') == 'callback')
			{
				// This is a validation callback, do not load the full form
				$this->request = 'callback';
				return TRUE;
			}
			elseif($this->CI->input->post('ufo-form') != $this->name)
			{
				// The POST is not meant for this form
				$this->request = 'none';
				return FALSE;
			}
		}
		else
		{
			// Just preprocess the form without any AJAX
			$this->request = 'html';
		}

		$this->load();

		return $this;
	}

	/**
	 * Load a form from a JSON file in the forms directory.
	 * Load() will try to load the $source of the form.
	 */
	public function load()
	{
		// Load the form data using forms_dir and forms_ext from the config
		$data = file_get_contents($this->config['forms_dir'] . $this->source . $this->config['forms_ext']);

		// Decode the JSON, return objects
		$data = json_decode($data);

		// See if the form is empty
		if(empty($data))
		{
			//TODO: Proper error handling
			echo 'Form ' . $this->name . ' was empty.';
			exit;
		}

		// Try to load a language file for this form
		if(file_exists($this->CI->input->server('DOCUMENT_ROOT') . '/' . APPPATH . 'language/' . $this->CI->config->item('language') . '/ufo_' . $this->source . '_lang.php'))
		{
			$this->lang = $this->CI->lang->load('ufo_' . $this->source, '' , TRUE);
		}

		// Load config for this form
		if(isset($data->config))
		{
			foreach($data->config as $key => $value)
			{
				$this->config[$key] = $value;
			}
		}

		// Build elements from data objects
		foreach($data->elements as $element)
		{
			// Add element to elements
			$this->add(get_object_vars($element));
		}

		// See if validation is needed, if so do it
		if($this->request == 'html')
		{
			$this->validate();
		}

		return TRUE;
	}

	/**
	 * Ajax
	 *
	 * This function handles all the ajax output the form can be required to generate.
	 * It bases the output on the $this->request variable.
	 */
	public function ajax()
	{
		// Turn off the profiler if it is on
		$this->CI->output->enable_profiler(FALSE);
		
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
			return 'Request type unknown, run preprocess or check your request POST variable.';
		}

		return json_encode($ajax);
	}

	/**
	 * Add
	 *
	 * Adds an element to the form
	 */
	public function add($data)
	{
		// Create a new element
		$element = new Element($this, $data);

		// Assign the new element to the elements array
		$this->elements[$element->name] = $element;

		return TRUE;
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
	 * Sets the value of a element on runtime
	 *
	 * @param string $element_name name
	 * @param array $value value
	 * 
	 * @deprecated 2014-08-05 Replaced by set_element_property()
	 */
	public function set_value($element_name, $value)
	{
		// See if the element exists
		if(array_key_exists($element_name, $this->elements))
		{
			// If this is a checkgroup then we use a different assignment method
			if($this->elements[$element_name]->type == 'checkgroup')
			{
				$this->elements[$element_name]->set_checkgroup_values($value);
			}
			else
			{
				// Set value of element object
				$this->elements[$element_name]->value = $value;
			}

			return TRUE;
		}
		else
		{
			// Return error if the element does not exist
			return 'ERROR: No element with that name';
		}
	}

	/**
	 * Sets the value of a element on runtime
	 *
	 * @param string $element_name name
	 * @param array $value value
	 */
	public function set_element_property($element_name, $property, $value)
	{
		// See if the element exists
		if(array_key_exists($element_name, $this->elements))
		{
			// If this is a checkgroup then we use a different assignment method
			if(is_array($value))
			{
				// These are the values for
				$this->elements[$element_name]->set_checkgroup_values($value);
			}
			else
			{
				// Set property of element object
				$this->elements[$element_name]->$property = $value;
			}
	
			return TRUE;
		}
		else
		{
			// Return error if the element does not exist
			return 'ERROR: No element with that name';
		}
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
	 * Sets the config of the form on runtime
	 *
	 * @param array $config Array of config items key/value
	 */
	public function set_config($config)
	{
		// Set config variables
		foreach ($config as $key=>$value)
		{
			if ($value)
			{
				// Set the value to the key variable
				$this->config[$key] = $value;
			}
		}
	}

	/**
	 * Sets the config of a element on runtime
	 *
	 * @param string $element_name Element name
	 * @param array $config Array of config items key/value
	 */
	public function set_element_config($element_name, $config)
	{
		// See if the element exists
		if(array_key_exists($element_name, $this->elements))
		{
			// Run set_config of element object
			$element = $this->elements[$element_name]->set_config($config);

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
		// First see if there is a POST
		if(array_key_exists('ufo-formname', $_POST))
		{
			// Now see if the POST is for this form
			if($_POST['ufo-formname'] != $this->name)
			{
				// This is not meant for this form
				return FALSE;
			}

			// Load CI form validation library
			$this->CI->load->library('form_validation');

			// Set validation rules for all elements
			foreach($this->elements as $element)
			{
				$this->CI->form_validation->set_rules($element->name, $element->label, $element->rules); //TODO: See if we don't need to get some sort of string for human readable error message
			}

			// Run validation
			if ($this->CI->form_validation->run() == FALSE)
			{
				// The form did not pass validation
				$this->valid = FALSE;

				// Repopulate the form
				$this->repopulate();
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
			$this->CI->form_validation->set_rules($post['ufo-name'], $post['ufo-label'], $post['ufo-rule']);

			// Create proper POST value for the field to validate
			$_POST[$post['ufo-name']] = $post['ufo-value'];

			// Set output type to json
			$this->CI->output->set_content_type('application/json');

			// Validate
			if($this->CI->form_validation->run() == FALSE)
			{
				// Return error message
				return array('valid' => FALSE, 'error' => form_error($post['ufo-name']));
			}
			else
			{
				return array('valid' => TRUE);
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

		// Create the export array
		$export = array();

		// Export config
		$export['config'] = array();
		foreach($this->config as $key => $value)
		{
			// If we are allowed to pass this value to the client
			if(in_array($key, $this->config['export_array']))
			{
				$export['config'][$key] = $value;
			}
		}

		// Export elements
		$export['elements'] = array();
		foreach($this->elements as $element)
		{
			if($element->type !== 'open' && $element->type !== 'close')
			{
				$export['elements'][] = $element->export();
			}
		}

		// Export messages
		$messages = $this->CI->lang->load('form_validation', '' , TRUE);
		$export['messages'] = $messages;

		// Set output type to json
		$this->CI->output->set_content_type('application/json');

		//return json_encode($export);
		return $export;
	}

	/**
	 * Handles repopulating the form based on the POST array.
	 */
	private function repopulate()
	{
		// Iterate over all elements
		foreach($this->elements as $element)
		{
			// If the POST had this element
			if(array_key_exists($element->name, $_POST))
			{
				// Repopulate the form based on type
				switch($element->type) {
					case 'checkgroup':
						// Iterate through POST array for this checkgroup
						foreach($_POST[$element->name] as $key => $value)
						{
							// Assign to selected array
							$element->selected[] = $value;
						}
						break;
					case 'open':
					case 'close':
					case 'upload':
						// We cannot repopulate a upload field due to security reasons
					case 'password':
						// Do nothing for these element types
						break;
					default:
						// Default case, includes: most text fields, custom types, radiobuttons, checkboxes and dropdowns
						$element->value = $_POST[$element->name];
				}

				// Set the error message
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

	public $id;
	public $name;
	public $uniquename; // Used when we need a unique reference to this element
	public $label;

	public $config = array();

	// A reference back to its parent Ultraform object
	public $form;

	// The type of the element
	public $type;

	public $value;
	public $options = array();
	public $selected = array();

	public $rules = '';
	public $placeholder;

	public $required = FALSE;
	
	public $error = FALSE;
	public $error_text;

	/**
	 * Constructor
	 */
	public function __construct($form, $data)
	{
		// Assign parent form
		$this->form = $form;

		foreach($data as $key => $value)
		{
			if($key == 'config')
			{
				// Set config variables from JSON
				foreach($value as $config => $item)
				{
					$this->config[$config] = $item;
				}
			}
			else
			{
				// Not a config variable, just assign it
				$this->$key = $value;
			}
		}

		$this->uniquename = 'ufo-' . $this->form->name . '-' . $this->name;
		$this->id = $this->uniquename;

		// Set the label and placeholder for this element
		$this->generate_label();
		$this->generate_placeholder();
		$this->set_required();

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

		// Assign this element to the template as $e
		$data['e'] = $this;
		
		// Determine what template to use for this element
		if(file_exists(APPPATH . '/views' . $template_dir . '_' . $this->name . '.php'))
		{
			// Step 1: Check to see if the element itself has a unique template
			$html = $this->form->CI->load->view($template_dir . '_' . $this->name, $data, TRUE);
		}
		elseif(file_exists(APPPATH . '/views' . $template_dir . '/' . $this->form->name . '/' . $this->type . '.php'))
		{
			// Step 2: Check to see if the element has a template in this specific form
			$html = $this->form->CI->load->view($template_dir . '/' . $this->form->name . '/' . $this->type, $data, TRUE);
		}
		else
		{
			// Step 3: If step 1 and 2 are FALSE then we use the default element template
			$html = $this->form->CI->load->view($template_dir . $this->type, $data, TRUE);
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
		// Build the export array
		$export = array();
		$export['name'] = $this->name;
		$export['label'] = $this->label;
		$export['value'] = $this->value;
		$export['rules'] = $this->rules;
		$export['placeholder'] = $this->placeholder;

		// Add options if this element has them
		if($this->options != NULL)
		{
			$export['options'] = $this->options;
		}

		// Export config if this element has any
		if(!empty($this->config))
		{
			$export['config'] = array();
			foreach($this->config as $key => $value)
			{
				// If we are allowed to pass this value to the client
				if(in_array($key, $this->form->config['export_array']))
				{
					$export['config'][$key] = $value;
				}
			}
		}

		return $export;
	}

	/**
	 * Will generate a translated array of options objects
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
	 * Determines what the human readable label should be set to for this element
	 */
	private function generate_label()
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
	 * Determines what the human readable placeholder should be set to for this element
	 */
	private function generate_placeholder()
	{
		// If we have a lang file entry use that
		if($this->form->lang($this->name . '_placeholder'))
		{
			// Get the label from the language file
			$this->placeholder = $this->form->lang($this->name . '_placeholder');
		}
		// If we have a JSON data file 'placeholder' value use that
		elseif($this->placeholder != NULL)
		{
			// Do nothing, we use the placeholder from the JSON
		}

		return $this->placeholder;
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
	 * Sets the selected states of a checkgroup.
	 *
	 * @param array $values Array of values
	 */
	public function set_checkgroup_values($values)
	{
		foreach($values as $key => $value)
		{
			// Assign to selected array
			$this->selected[] = $value;
		}
	}

	/**
	 * Sets the config of the element on runtime
	 *
	 * @param array $config Array of config items key/value
	 */
	public function set_config($config)
	{
		// Set config variables
		foreach ($config as $key=>$value)
		{
			if ($value)
			{
				// Set the value to the key variable
				$this->config[$key] = $value;
			}
		}
	}

	/**
	 * Checks to see if this element is required
	 */
	public function set_required()
	{
		// Check to see if this element is required
		if(strpos($this->rules, 'required') !== FALSE)
		{
			// The field is required
			$this->required = $this->form->config['required_flag'];
		}
		else
		{
			// The field is not required
			$this->required = FALSE;
		}
		
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