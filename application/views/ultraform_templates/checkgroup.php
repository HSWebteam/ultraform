<div class="form-group">
	<div class="checkgroup">
		<label for="<?php echo $name;?>" class="col-lg-3 control-label"><?php echo $label?>: </label>
		<div class="col-lg-9">
			
			<?php foreach($options as $key => $option):?>
			
				<div class="checkbox">
					<label>
						<input id="ufo-<?php echo $formname;?>-<?php echo $name;?>-<?php echo $key;?>" type="checkbox" name="<?php echo $name;?>[]" value="<?php echo $option; ?>"<?php if(in_array($option, $selected)):?> checked<?php endif;?>>
						<?php echo $option;?> 
					</label>
				</div>
			
			<?php endforeach; ?>

			<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>

		</div>		
	</div>
</div>