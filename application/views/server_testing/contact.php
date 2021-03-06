<!doctype html>
<html>
	<head>
		<title>Contact form test</title>
		
        <link type="text/css" rel="stylesheet" href="<?php echo base_url(); ?>css/bootstrap-3.0/bootstrap.min.css">
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
	<meta charset='utf-8'> 		
	</head>
	<body>
		<div class="container maincontent">
			<div class="row">
				<div class="col-md-8">
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
						<?php echo $contact_form->render('yo');?>
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
						<?php echo $contact_form->render('file');?>
						<?php echo $contact_form->render('submit');?>
						<?php echo $contact_form->render('close');?>
					</div>
				</div>
				<div class="col-md-4">
					<h1>Login form</h1>
					<p>Please login and stuff</p>
					<?php echo $login_form; ?>
				</div>
			</div>
		</div>

        <script>var $base_url = "<?php echo base_url(); ?>"</script>
        <script src="<?php echo base_url('scripts/jquery/jquery-1.8.3.min.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/bootstrap-3.0/bootstrap.min.js'); ?>"></script>
        <!-- Your application -->
        <script src="<?php echo base_url('scripts/ultraform/ultraform-min.js'); ?>"></script>

	</body>
</html>
