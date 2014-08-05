<div class="form-group <?php echo $validstate;?>">
	<label for="<?php echo $name;?>" class="col-lg-3 control-label"><?php echo $label?><?php echo $required_flag;?>: </label>
	<div class="col-lg-9">
		<input id="<?php echo $id;?>" type="text" class="form-control datepicker" name="<?php echo $name;?>" placeholder="<?php echo $placeholder;?>" value="<?php echo $value; ?>">
		<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
	</div>
</div>