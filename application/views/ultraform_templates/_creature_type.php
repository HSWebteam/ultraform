<div>
	<label for="<?php echo $name;?>"><?php echo $label?><?php echo $required_flag;?>: </label>
	<input id="<?php echo $id;?>" type="text" name="<?php echo $name;?>" placeholder="<?php echo $placeholder;?>" value="<?php echo $value; ?>" data-provide="typeahead" data-items="10" data-source='[<?php echo $options ?>]'>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>