<div class="form-group">	
	<label for="<?php echo $name;?>" class="col-lg-3 control-label"><?php echo $label?><?php echo $required_flag;?>: </label>
	<div class="col-lg-9">
		<?php foreach($options as $key => $option):?>
		
			<div class="radio">
				<label>
					<input id="ufo-<?php echo $formname;?>-<?php echo $name;?>-<?php echo $key;?>" type="radio" name="<?php echo $name;?>" value="<?php echo $key;?>"<?php if($value == $key):?> checked<?php endif;?>>
					<?php echo $option;?>
				</label> 
			</div>
		
		<?php endforeach;?>
		<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
	</div>
</div>