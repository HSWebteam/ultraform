<!DOCTYPE html>
<html>
<head>
    <title>Temp</title>
    <link rel="stylesheet" href="<?php echo base_url('css/qunit-1.12.0.css'); ?>">
</head>
<body>
    <h1 id="qunit-header">Backbone test page</h1>
    <h2 id="qunit-banner"></h2>
    <div id="qunit-testrunner-toolbar"></div>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests"></ol>
    <div id="qunit-fixture"></div>

    <script>var $base_url = "<?php echo base_url(); ?>"</script>
    <!-- For testing -->
    <script src="<?php echo base_url('scripts/jquery-1.8.3.min.js'); ?>"></script>
    <script src="<?php echo base_url('scripts/underscore.js'); ?>"></script>
    <script src="<?php echo base_url('scripts/backbone.js'); ?>"></script>
    <!-- Your application -->
    <script src="<?php echo base_url('scripts/ultraform.js'); ?>"></script>
    <script>

    var fix = $('#qunit-tests');
    var that = this;
    fix.load($base_url+'client_testing/form1', function() {

        // initialize
        Ultraform.initialize({
            apiUrl: $base_url+'client_testing/api/',
            validateUrl: $base_url+'client_testing/validate/'
        });

    });

    </script>

</body>
</html>