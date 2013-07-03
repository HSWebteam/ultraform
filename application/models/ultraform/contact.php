<?php

class Contact extends CI_Model {
	
	public $ultraform;
	
	public function init($ultraform)
	{
		$this->ultraform = $ultraform;
	}
	
	public function form_contact()
	{
		$this->ultraform->add(array('name' => 'contact_form_open',  'type' => 'open'));
		$this->ultraform->add(array('name' => 'username', 'type' => 'text'));
		$this->ultraform->add(array('name' => 'password', 'type' => 'password'));
		$this->ultraform->add(array('name' => 'remember_me', 'type' => 'checkbox'));
		$this->ultraform->add(array('name' => 'submit', 'type' => 'submit'));
		$this->ultraform->add(array('name' => 'contact_form_close',  'type' => 'close'));
		
		return $this->ultraform;
	}
}