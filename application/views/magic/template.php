<!DOCTYPE html>

<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title><?php echo $title ?> | MtG</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link type="text/css" rel="stylesheet" href="<?php echo base_url(); ?>css/bootstrap.css">
        <link type="text/css" rel="stylesheet" href="<?php echo base_url(); ?>css/magic.css">

    </head>
    <body>

        

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="<?php echo base_url();?>scripts/jquery-1.8.2.min.js"><\/script>')</script>

        <div class="container maincontent">

            <?php echo $header ?>

            <section class="content_section">
                
                <?php echo $content ?>

            </section>

        </div>
        
        <?php echo $footer ?>


        <script>var $base_url = "<?php echo base_url(); ?>"</script>
        <script src="<?php echo base_url('scripts/jquery-1.8.3.min.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/underscore.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/backbone.js'); ?>"></script>
        <script src="<?php echo base_url('scripts/bootstrap.js'); ?>"></script>
        <!-- Your application -->
        <script src="<?php echo base_url('scripts/ultraform.js'); ?>"></script>
        <script>

            // initialize
            var ultraform = new Ultraform({
                apiUrl: "<?php echo base_url();?>api/",
                validateUrl: "<?php echo base_url();?>api/validate/"
            });

        </script>

    </body>
</html>
