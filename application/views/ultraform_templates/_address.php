<div>
	<label for="<?php echo $name;?>"><?php echo $label?>: </label>
	<input id="<?php echo $id;?>" type="text" name="<?php echo $name;?>" placeholder="<?php echo $placeholder;?>" value="<?php echo $value; ?>">
	<strong style="color:pink;">Warning: This is totally a custom template!</strong>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>