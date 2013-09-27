<div class="fileupload fileupload-new" data-provides="fileupload">
	<label for="<?php echo $name;?>"><?php echo $label?>: </label>
	<div class="fileupload-preview thumbnail" style="width: 200px; height: 100px;"></div>
	<br>
	<span class="btn btn-file"><span class="fileupload-new">Select image</span><span class="fileupload-exists">Change</span>
		<input id="<?php echo $id;?>" type="file" name="<?php echo $name;?>" placeholder="<?php echo $placeholder;?>" value="<?php echo $value; ?>">
	</span>
	<a href="#" class="btn fileupload-exists" data-dismiss="fileupload">Remove</a>
	<div id="<?php echo $id;?>_error" class="error"><?php echo $error_text;?></div>
	
</div>


	
	