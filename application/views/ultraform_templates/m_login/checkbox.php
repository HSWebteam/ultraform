<div>
	<label for="<?php echo $name;?>" class="checkbox"> 
		<input id="<?php echo $id;?>" type="checkbox" name="<?php echo $name;?>" value="<?php echo $value; ?>"> <?php echo $label;?>
	</label>
			
	<span>
		<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
	</span>
</div> 