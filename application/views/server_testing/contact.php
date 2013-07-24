<!doctype html>
<html>
	<head>
		<title>Contact form test</title>
	</head>
	<body>
		<h1>Contact form</h1>
		
		<p>If you would like to contact us, please fill out the following form.</p>
		
		<div id="contact_form">
			<?php echo $contact_form->render('open');?>
			Please leave your username and password for contacting.
			<?php echo $contact_form->render('username');?>
			<?php echo $contact_form->render('password');?>
			Now would you like to be remembered?
			<?php echo $contact_form->render('remember_me');?>
			<?php echo $contact_form->render('submit');?>
			<?php echo $contact_form->render('close');?>
		</div>
	</body>
</html>