<!doctype html>
<html>
	<head>
		<title>Contact form test</title>
		<style>
		input.error {
			background-color: #FFAAAA;
		}
		#ufo-forms-<?php echo $contact_form->name;?>_error {
			background-color: lightblue;
			border: 1px solid darkblue;
			width: 500px;
			margin-left:50px;
		}
		#ufo-forms-<?php echo $contact_form->name;?>_error li {
			height: 21px;
		}
		</style>
	</head>
	<body>
		<h1>Contact form</h1>

		<p>If you would like to contact us, please fill out the following form.</p>
		
		<div id="ufo-forms-<?php echo $contact_form->name;?>_error">
			The following errors were encountered in the form:<br>
			<ul>
			</ul>
		</div>
		
		<div id="contact_form">
			<?php echo $contact_form->render('open');?>
			Please leave your username and password for contacting.
			<?php echo $contact_form->render('username');?>
			<?php echo $contact_form->render('password');?>
			<?php echo $contact_form->render('address');?><br>
			I like sushi, that is why I will allow you to choose your own... sushi!
			<?php echo $contact_form->render('sushi');?><br>
			Now would you like to be remembered?
			<?php echo $contact_form->render('remember_me');?><br>
			Do you have any remarks you want us to know about?
			<?php echo $contact_form->render('remarks');?>
			<?php echo $contact_form->render('submit');?>
			<?php echo $contact_form->render('close');?>
		</div>

        <script>var $base_url = "<?php echo base_url(); ?>"</script>
        <script src="<?php echo base_url('scripts/jquery-1.8.3.min.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/underscore.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/backbone.js'); ?>"></script>
        <!-- Your application -->
        <script src="<?php echo base_url('scripts/ultraform.js'); ?>"></script>
        <script>

            // initialize
            var ultraform = new Ultraform({
            	apiUrl: "<?php echo base_url();?>api/",
            	validateUrl: "<?php echo base_url();?>api/validate/"
            });

        </script>

	</body>
</html>
