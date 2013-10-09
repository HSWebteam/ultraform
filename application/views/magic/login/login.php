<div class="row">

	<div class="col-md-6">
		
		<div id="login_form" class="panel panel-default">
			
			<div class="panel-heading">
    			<h3 class="panel-title">Login</h3>
  			</div>

			<?php echo $login_form->render('open');?>

				<?php echo $login_form->render('username');?>
				<?php echo $login_form->render('password');?>
				<?php echo $login_form->render('remember_me');?>
				<?php echo $login_form->render('submit');?>

			<?php echo $login_form->render('close');?>
			
		</div>

		<div id="register_form" class="panel panel-default">

			<div class="panel-heading">
    			<h3 class="panel-title">Register</h3>
  			</div>

			<?php echo $register_form->render(); ?>
		</div>

	</div>

	<div class="col-md-4">

		<img src="<?php echo base_url();?>images/magic/scroll_rack.jpg">

	</div>
	
</div>