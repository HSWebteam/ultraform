<div class="checkgroup well">
	<label for="<?php echo $name;?>"><?php echo $label?>: </label>
	<?php foreach($options as $key => $option):?>
		<label for="ufo-<?php echo $formname;?>-<?php echo $name;?>-<?php echo $key;?>" class="checkbox">
			<input id="ufo-<?php echo $formname;?>-<?php echo $name;?>-<?php echo $key;?>" type="checkbox" name="<?php echo $name;?>[]" value="<?php echo $option; ?>"<?php if(in_array($option, $selected)):?> checked<?php endif;?>>
			<?php echo $option;?> 
		</label>
	<?php endforeach; ?>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>