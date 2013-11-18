<div class="form-group">
	<label for="<?php echo $name;?>" class="col-lg-3 control-label"><?php echo $label?>: </label>
	<div class="col-lg-9">
		<textarea id="<?php echo $id;?>" class="form-control" name="<?php echo $name;?>" placeholder="<?php echo $placeholder;?>" rows="4" cols="50"><?php echo $value; ?></textarea>
		<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
	</div>
</div>