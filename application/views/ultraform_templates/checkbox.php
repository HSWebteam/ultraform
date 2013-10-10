<div class="form-group">
    <div class="col-lg-offset-3 col-lg-9">
		<div class="checkbox">
			<label>
				<input id="<?php echo $id;?>" type="checkbox" name="<?php echo $name;?>" value="<?php echo $name; ?>"<?php if($value == $name):?> checked<?php endif;?>>
				<?php echo $label;?>
			</label>	
			<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
		</div> 
	</div>
</div>