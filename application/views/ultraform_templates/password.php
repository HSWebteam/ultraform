<div class="form-group">
	<label for="<?php echo $name;?>" class="col-lg-3 control-label"><?php echo $label;?><?php echo $required_flag;?>: </label>
	<div class="col-lg-9">
		<input id="<?php echo $id;?>" class="form-control" type="password" name="<?php echo $name;?>" value="<?php echo $value; ?>" placeholder="<?php echo $placeholder;?>">
	</div>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>