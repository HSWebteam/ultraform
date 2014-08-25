<div class="form-group">
	<label for="<?php echo $e->name;?>" class="col-lg-3 control-label"><?php echo $e->label?><?php echo $e->required;?>: </label>
	<div class="col-lg-9">
		<select id="<?php echo $e->id;?>" class="form-control" name="<?php echo $e->name;?>">
			<?php if($e->placeholder):?>
			<option style="display: none;" class="hint" value=""><?php echo $e->placeholder;?></option>
			<?php endif;?>
			<?php foreach($e->options as $key => $option):?>
			<option value="<?php echo $key;?>"<?php if($e->value == $key):?> selected<?php endif;?>><?php echo $option;?></option>
		  	<?php endforeach;?>
		</select>
		<div id="<?php echo $e->id;?>_error" class="error"><?php echo $e->error_text;?></div>
	</div>
</div>