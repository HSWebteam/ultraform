<div class="form-group">
    <div class="col-lg-offset-3 col-lg-9">
		<div class="checkbox">
			<label>
				<input id="<?php echo $e->id;?>" type="checkbox" name="<?php echo $e->name;?>" value="<?php echo $e->name; ?>"<?php if($e->value == $e->name):?> checked<?php endif;?>>
				<?php echo $e->required;?><?php echo $e->label;?>
			</label>	
			<div id="<?php echo $e->id;?>_error" class="error"><?php echo $e->error_text;?></div>
		</div> 
	</div>
</div>