<div class="row">
	<div class="span4">
		<h3>User Login:</h3>
		<div id="login_form" class="well">
			<?php echo $login_form->render('open');?>
				<?php echo $login_form->render('username');?>
				<?php echo $login_form->render('password');?><br>
				<?php echo $login_form->render('remember_me');?><br>
				<?php echo $login_form->render('submit');?>
			<?php echo $login_form->render('close');?>
		</div>
	</div>
</div>

	</body>
</html>
