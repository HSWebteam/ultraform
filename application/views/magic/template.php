<!DOCTYPE html>

<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?php echo $title ?> | MtG</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link type="text/css" rel="stylesheet" href="<?php echo base_url(); ?>css/bootstrap-3.0/bootstrap.min.css">
        <link type="text/css" rel="stylesheet" href="<?php echo base_url(); ?>css/magic.css">
    </head>

    <body>

        <?php echo $header ?>
    
        <div class="container maincontent">

            <section class="content_section">
                
                <?php echo $content ?>

            </section>

        </div>
        
        <?php echo $footer ?>

        <script>var $base_url = "<?php echo base_url(); ?>"</script>
        <script src="<?php echo base_url('scripts/jquery-1.8.3.min.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/underscore.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/backbone.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/bootstrap-3.0/bootstrap.min.js'); ?>"></script>
        <!-- Your application -->
        <script src="<?php echo base_url('scripts/ultraform.js'); ?>"></script>
    </body>
</html>