<div class="form-group">
	<div class="checkgroup">
		<label for="<?php echo $e->name;?>" class="col-lg-3 control-label"><?php echo $e->label?><?php echo $e->required;?>: </label>
		<div class="col-lg-9">
			
			<?php foreach($e->options as $key => $option):?>
			
				<div class="checkbox">
					<label>
						<input id="ufo-<?php echo $e->form->name;?>-<?php echo $e->name;?>-<?php echo $key;?>" type="checkbox" name="<?php echo $e->name;?>[<?php echo $key;?>]" value="<?php echo $key; ?>"<?php if(in_array($key, $e->selected)):?> checked<?php endif;?>>
						<?php echo $option;?> 
					</label>
				</div>
			
			<?php endforeach; ?>

			<div id="<?php echo $e->id;?>_error" class="error"><?php echo $e->error_text;?></div>

		</div>		
	</div>
</div>