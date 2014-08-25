<div class="form-group">
	<label for="<?php echo $e->name;?>" class="col-lg-3 control-label"><?php echo $e->label?><?php echo $e->required;?>: </label>
	<div class="col-lg-9">
		<input id="<?php echo $e->id;?>" type="file" name="<?php echo $e->name;?>" placeholder="<?php echo $e->placeholder;?>" value="<?php echo $e->value; ?>">
		<div id="<?php echo $e->id;?>_error" class="error"><?php echo $e->error_text;?></div>	
	</div>
</div>


	
	