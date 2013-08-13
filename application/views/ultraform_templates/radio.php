<div>
	<label for="<?php echo $name;?>"><?php echo $label?>: </label>
	<?php foreach($options as $key => $value):?>
	<input id="ufo-forms-<?php echo $name;?>-<?php echo $key;?>" type="radio" name="<?php echo $name;?>" value="<?php echo $key;?>"><?php echo $value;?> 
	<?php endforeach;?>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>