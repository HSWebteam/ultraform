<!DOCTYPE html>
<html>
<head>
    <title>QUnit Test Suite</title>
    <link rel="stylesheet" href="<?php echo base_url('css/qunit-1.12.0.css'); ?>">

    <!-- For testing -->
    <script src="<?php echo base_url('scripts/qunit-1.12.0.js'); ?>"></script>
    <script src="<?php echo base_url('scripts/sinon-1.7.3.js'); ?>"></script>
    <script src="<?php echo base_url('scripts/sinon-qunit-1.0.0.js'); ?>"></script>
    <!-- Dependencies for ultraform.js -->
    <script src="<?php echo base_url('scripts/jquery-1.8.3.min.js'); ?>"></script>
    <script src="<?php echo base_url('scripts/jquery.validVal-4.4.1-min.js'); ?>"></script>
    <script src="<?php echo base_url('scripts/underscore.js'); ?>"></script>
    <script src="<?php echo base_url('scripts/backbone.js'); ?>"></script>
    <!-- Your application -->
    <script src="<?php echo base_url('scripts/ultraform.js'); ?>"></script>
    <!-- Your tests -->
    <script src="<?php echo base_url('scripts/tests.js'); ?>"></script>
</head>
<body>
    <h1 id="qunit-header">QUnit Test Suite</h1>
    <h2 id="qunit-banner"></h2>
    <div id="qunit-testrunner-toolbar"></div>
    <h2 id="qunit-userAgent"></h2>
    <ol id="qunit-tests">test markup, hidden.</ol>
</body>
</html>