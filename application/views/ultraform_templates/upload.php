<div>
	<label for="<?php echo $name;?>"><?php echo $label?>: </label>
	<input id="<?php echo $id;?>" type="file" name="<?php echo $name;?>" placeholder="<?php echo $placeholder;?>" value="<?php echo $value; ?>">
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>
<br>