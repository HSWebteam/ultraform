<div>
	<label for="<?php echo $name;?>"><?php echo $label?>: </label>
	<select id="<?php echo $id;?>" name="<?php echo $name;?>" selected="<?php echo $value; ?>">
		<?php foreach($options as $key => $value):?>
		<option value="<?php echo $key;?>"><?php echo $value;?></option>
	  	<?php endforeach;?>
	</select>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>