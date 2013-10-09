<div class="form-group">
	<label for="<?php echo $name;?>"><?php echo $label;?>: </label>
	<input id="<?php echo $id;?>" class="form-control" type="password" name="<?php echo $name;?>" value="<?php echo $value; ?>">
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>