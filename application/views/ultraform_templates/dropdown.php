<div class="form-group">
	<label for="<?php echo $name;?>" class="col-lg-3 control-label"><?php echo $label?><?php echo $required_flag;?>: </label>
	<div class="col-lg-9">
		<select id="<?php echo $id;?>" class="form-control" name="<?php echo $name;?>">
			<?php foreach($options as $key => $option):?>
			<option value="<?php echo $key;?>"<?php if($value == $key):?> selected<?php endif;?>><?php echo $option;?></option>
		  	<?php endforeach;?>
		</select>
		<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
	</div>
</div>