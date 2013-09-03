<h3>User Login:</h3>

<div class="row">
	<div class="span5 offset1">
		
		<div id="login_form" class="well">
			<?php echo $login_form->render('open');?>
				<fieldset>
					<?php echo $login_form->render('username');?>
					<?php echo $login_form->render('password');?><br>
					<?php echo $login_form->render('remember_me');?><br>
					<?php echo $login_form->render('submit');?>

					
				</fieldset>

			<?php echo $login_form->render('close');?>
			<span>No account? <a href="<?php echo base_url();?>magic/register">Register free!</a></span>
		</div>
	</div>

	<div class="span4 offset1">
		<img src="<?php echo base_url();?>images/magic/scroll_rack.jpg">
	</div>

</div>

	</body>
</html>
