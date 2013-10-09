<div class="form-group">
	<label for="<?php echo $name;?>"><?php echo $label?>: </label>
	<textarea id="<?php echo $id;?>" class="form-control" name="<?php echo $name;?>" placeholder="<?php echo $placeholder;?>" rows="4" cols="50"><?php echo $value; ?></textarea>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>