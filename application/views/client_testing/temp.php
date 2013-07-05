<!DOCTYPE html>
<html>
<head>
    <title>Temp</title>
    <link rel="stylesheet" href="<?php echo base_url('css/qunit-1.12.0.css'); ?>">

    <script>var $base_url = "<?php echo base_url(); ?>"</script>
    <!-- For testing -->
    <script src="<?php echo base_url('scripts/jquery-1.8.3.min.js'); ?>"></script>
    <script src="<?php echo base_url('scripts/underscore.js'); ?>"></script>
    <script src="<?php echo base_url('scripts/backbone.js'); ?>"></script>
    <!-- Your application -->
    <script src="<?php echo base_url('scripts/ultraform.js'); ?>"></script>

</head>
<body>
    <h1 id="qunit-header">Backbone test page</h1>
    <h2 id="qunit-banner"></h2>
    <div id="qunit-testrunner-toolbar"></div>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests"></ol>
    <div id="qunit-fixture"></div>

    <script>

    var fix = $('#qunit-tests');
    var that = this;
    fix.load($base_url+'client_testing/form1', function() {

        // create a model
        that.model = new Ultraform.FormModel({id: 33}, {urlRoot: $base_url+'client_testing/mocks'});

        var MyView = Ultraform.FormView.extend({
            model: that.model, // associate the view with the model
            el: $("#form2").get(), // reference the view to the form allready in the DOM
        });

        // create a view and connect it to the model
        that.view = new MyView();
    });

    </script>

</body>
</html>