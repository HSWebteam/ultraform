<div style="background-color: green; color: lightgreen;">
	<?php if(isset($e->something)):?>Yo voor <?php echo $e->name;?><?php endif;?>
	<label for="<?php echo $e->name;?>"><?php echo $e->label?>: </label>
	<input id="<?php echo $e->id;?>" type="text" name="<?php echo $e->name;?>" placeholder="<?php echo $e->placeholder;?>" value="<?php echo $e->value; ?>">
	<div id="<?php echo $e->id;?>_error" class="error"><?php echo $e->error_text;?></div>
</div>