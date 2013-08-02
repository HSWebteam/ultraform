<!doctype html>
<html>
	<head>
		<title>Contact form test</title>
		<style>
		input.error {
			border: 1px solid red;
		}
		</style>
	</head>
	<body>
		<h1>Contact form</h1>

		<p>If you would like to contact us, please fill out the following form.</p>
		
		<div id="contact_form">
			<?php echo $contact_form->render('open');?>
			Please leave your username and password for contacting.
			<?php echo $contact_form->render('username');?>
			<?php echo $contact_form->render('password');?>
			<?php echo $contact_form->render('address');?>
			Now would you like to be remembered?
			<?php echo $contact_form->render('remember_me');?>
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
            Ultraform.initialize({
            	apiUrl: "<?php echo base_url();?>api/",
            	validateUrl: "<?php echo base_url();?>api/validate/"
            });

        </script>

	</body>
</html>
