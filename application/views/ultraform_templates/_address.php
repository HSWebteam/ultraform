<div>
	<label for="<?php echo $e->name;?>"><?php echo $e->label?><?php echo $e->required;?>: </label>
	<input id="<?php echo $e->id;?>" type="text" name="<?php echo $e->name;?>" placeholder="<?php echo $e->placeholder;?>" value="<?php echo $e->value; ?>">
	<strong style="color:pink;">Warning: This is totally a custom template!</strong>
	<div id="<?php echo $e->id;?>_error" class="error"><?php echo $e->error_text;?></div>
</div>