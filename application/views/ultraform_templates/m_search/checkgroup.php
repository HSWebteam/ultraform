<div class="well">
	<label for="<?php echo $name;?>"><?php echo $label?>: </label>
	<?php foreach($options as $key => $value):?>

		<label for="ufo-<?php echo $formname;?>-<?php echo $name;?>-<?php echo $key;?>" class="checkbox">
			<input id="ufo-<?php echo $formname;?>-<?php echo $name;?>-<?php echo $key;?>" type="checkbox" name="<?php echo $name;?>" value="<?php echo $value; ?>">
			<?php echo $value;?> 
		</label>
	
	<?php endforeach; ?>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>