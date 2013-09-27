<div>
	<label for="<?php echo $name;?>"><?php echo $label?>: </label>
	<?php foreach($options as $key => $option):?>
	
	<label class="radio">
		<input id="ufo-<?php echo $formname;?>-<?php echo $name;?>-<?php echo $key;?>" type="radio" name="<?php echo $name;?>" value="<?php echo $key;?>"<?php if($value == $key):?> checked<?php endif;?>>
		<?php echo $option;?>
	</label> 
	
	<?php endforeach;?>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
</div>