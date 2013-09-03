<!doctype html>
<html>
	<meta charset='utf-8'> 
	<head>
		<title>Contact form test</title>
		
        <link type="text/css" rel="stylesheet" href="<?php echo base_url(); ?>css/bootstrap.css">
		<style>
		input.error {
			background-color: #FFAAAA;
		}
		#ufo-<?php echo $contact_form->name;?>_error {
			background-color: lightblue;
			border: 1px solid darkblue;
			width: 500px;
			margin-left:50px;
		}
		#ufo-<?php echo $contact_form->name;?>_error li {
			height: 21px;
		}
		</style>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>
		<div class="container maincontent">
			<h1>Really bloated contact form</h1>
	
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
				These are tests for different label sources.
				<?php echo $contact_form->render('labeltest');?>
				<?php echo $contact_form->render('label_uit_name');?><br>
				I like sushi, that is why I will allow you to choose your own... sushi!
				<?php echo $contact_form->render('sushi');?><br>
				This is a test for options at runtime.
				<?php echo $contact_form->render('fish');?><br>
				<?php echo $contact_form->render('color');?><br>
				What kind of sauce would you like with the colored sushi?
				<?php echo $contact_form->render('sauce');?><br>
				Now would you like to be remembered?
				<?php echo $contact_form->render('remember_me');?><br>
				Do you have any remarks you want us to know about?
				<?php echo $contact_form->render('remarks');?>
				<?php echo $contact_form->render('submit');?>
				<?php echo $contact_form->render('close');?>
			</div>
		</div>

        <script>var $base_url = "<?php echo base_url(); ?>"</script>
        <script src="<?php echo base_url('scripts/jquery-1.8.3.min.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/underscore.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/backbone.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/bootstrap.js'); ?>"></script>
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
