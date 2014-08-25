<div class="form-group">	
	<label for="<?php echo $e->name;?>" class="col-lg-3 control-label"><?php echo $e->label?><?php echo $e->required;?>: </label>
	<div class="col-lg-9">
		<?php foreach($e->options as $key => $option):?>
		
			<div class="radio">
				<label>
					<input id="ufo-<?php echo $e->form->name;?>-<?php echo $e->name;?>-<?php echo $key;?>" type="radio" name="<?php echo $e->name;?>" value="<?php echo $key;?>"<?php if($e->value == $key):?> checked<?php endif;?>>
					<?php echo $option;?>
				</label> 
			</div>
		
		<?php endforeach;?>
		<div id="<?php echo $e->id;?>_error" class="error"><?php echo $e->error_text;?></div>
	</div>
</div>