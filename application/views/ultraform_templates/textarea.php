<div class="form-group">
	<label for="<?php echo $e->name;?>" class="col-lg-3 control-label"><?php echo $e->label?><?php echo $e->required;?>: </label>
	<div class="col-lg-9">
		<textarea id="<?php echo $e->id;?>" class="form-control" name="<?php echo $e->name;?>" placeholder="<?php echo $e->placeholder;?>" rows="4" cols="50"><?php echo $e->value; ?></textarea>
		<div id="<?php echo $e->id;?>_error" class="error"><?php echo $e->error_text;?></div>
	</div>
</div>