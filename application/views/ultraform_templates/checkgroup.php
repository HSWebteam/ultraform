<div>
	<?php foreach($options as $key => $value):?>
	<input id="ufo-forms-<?php echo $formname;?>-<?php echo $name;?>-<?php echo $key;?>" type="checkbox" name="<?php echo $name;?>" value="<?php echo $value; ?>">
	<label for="ufo-forms-<?php echo $formname;?>-<?php echo $name;?>-<?php echo $key;?>"><?php echo $value;?> </label><br>
	<?php endforeach; ?>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>