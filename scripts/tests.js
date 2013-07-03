/* QUnit tests for ultraform.js */

// Test the Ultraform model
module('Ultraform model sanity check', {
	setup: function() {
		this.model = new UltraformModel({name: 'myUltraform', id:'myId', count:33});
	},
	teardown: function() {
		delete this.model;
		delete window.errors;
	}
});

// model contains a validate function
test('model contains validate function', function() {
	expect(2);
	ok('validate' in this.model, 'the Ultraform instance has a property called \'validate\'');
	ok(typeof this.model.validate === 'function', 'The Ultraform instance property \'validate\' is a function');
});

// backbone model works
test('model properties are set correctly', function() {
	expect(3);
	strictEqual(this.model.get('name'), 'myUltraform', 'name === "myUltraform"');
	strictEqual(this.model.get('id'), 'myId', 'id === "myId"');
	strictEqual(this.model.get('count'), 33, 'count === 333');
});

// Test the UltraformList collection
module('UltraformList collection check', {
	setup: function() {
		this.collection = new UltraformList();
		this.collection.add(new UltraformModel({name: 'ultraform3'}));
		this.collection.add(new UltraformModel({name: 'ultraform1'}));
		this.collection.add(new UltraformModel({name: 'ultraform2'}));
	},
	teardown: function() {
		delete window.errors;
		delete this.collection;
	}
});

// test collection is set correctly
test('UltraformList collection is set correctly', function() {
	expect(4);
	var result = this.collection.pluck('name');
	equal(result.length, 3, 'the collection contains three objects');
	notEqual(result.indexOf('ultraform1'), -1, 'the object \'ultraform1\' is found in the collection');
	notEqual(result.indexOf('ultraform2'), -1, 'the object \'ultraform2\' is found in the collection');
	notEqual(result.indexOf('ultraform3'), -1, 'the object \'ultraform2\' is found in the collection');
});

/****** TEST API CALLS ******/

module('API Calls test', {
	setup: function() {
		this.model1 = new UltraformModel({name: 'ultraform1', id:33}, {urlRoot: '/mocks'});
		this.model2 = new UltraformModel({name: 'ultraform2'}, {urlRoot: '/mocks'});
		this.model3 = new UltraformModel({name: 'ultraform3', id:35}, {urlRoot: '/mocks'});
		this.collection = new UltraformList([this.model1, this.model2, this.model3], {
			url: '/mocks'
		});
	},
	teardown: function() {
		delete window.errors;
		delete this.model1;
		delete this.model2;
		delete this.model3;
		delete this.collection;
	}
});

// test correct id was given to model
test('copying the id from attribute hash to object', function() {
	expect(1);
	this.model = new UltraformModel({name: 'UFO', id:33});
	equal(this.model.id, 33, 'confirm id set to 33');
});

// fireing custom evenst on state change
test('fireing custom evenst on change', function() {
	expect(1);
	var spy = this.spy();
	this.model = new UltraformModel({name: 'UFO'});
	this.model.bind('change', spy);
	this.model.set({done: "changing model"});
	ok(spy.calledOnce, 'a change event was correctly fired once');
});

// fireing validate event on state change
test('fireing validate event on change', function() {
	expect(1);
	this.model = new UltraformModel({name: 'UFO', id:33});
	var stub = this.stub(this.model, 'validate');
	this.model.set({done: "changing model"}, {validate: true});
	ok(stub.called, 'validate fired when model changed');
});

// updating an object uses correct URL
test('saving an existing object', function() {
	expect(5);
	var stub = this.stub(jQuery, 'ajax');
	this.model = new UltraformModel({name: 'UFO', id:33}, {urlRoot: '/mocks'});
	this.model.set({done: "changing model"});
	this.model.save();

	ok(! this.model.isNew(), 'the created model is considered \'not new\' because it has an id');
	ok(stub.calledOnce, 'URL called once when the model is saved');
	equal(stub.getCall(0).args[0].type, 'PUT', 'ajax type is PUT'); // existing model -> PUT
    equal(stub.getCall(0).args[0].url, '/mocks/33', '/mocks/33, including id on existing model');
    equal(stub.getCall(0).args[0].dataType, 'json', 'datatype is json');
});

// saving a new object uses correct URL
test('saving a new object', function() {
	expect(5);
	var stub = this.stub(jQuery, 'ajax');
	this.model = new UltraformModel({name: 'UFO'}, {urlRoot: '/mocks'});
	this.model.save(); // model2 has no id

	ok(this.model.isNew(), 'the model is considered \'new\' because it does not have an id');
	ok(stub.calledOnce, 'URL called once when the model is saved');
	equal(stub.getCall(0).args[0].type, 'POST', 'ajax type is POST'); // new model -> POST
    equal(stub.getCall(0).args[0].url, '/mocks', 'save to /mocks');
    equal(stub.getCall(0).args[0].dataType, 'json', 'datatype is json');
});

// deleting an object
test('deleting an object', function() {
	expect(5);
	var stub = this.stub(jQuery, 'ajax');
	this.model = new UltraformModel({name: 'UFO', id:33}, {urlRoot: '/mocks'});
	this.model.destroy(); // model1 has an id

	ok(! this.model.isNew(), 'the model is considered \'not new\' because it has an id');
	ok(stub.calledOnce, 'URL called once when the model is saved');
	equal(stub.getCall(0).args[0].type, 'DELETE', 'ajax type is DELETE'); // deleting -> DELETE
    equal(stub.getCall(0).args[0].url, '/mocks/33', 'use URL /mocks/33');
    equal(stub.getCall(0).args[0].dataType, 'json', 'datatype is json');
});

// getting an object
test('getting an object', function() {
	expect(4);
	var stub = this.stub(jQuery, 'ajax');
	this.model = new UltraformModel({id: 33}, {urlRoot:'/mocks'});
	this.model.fetch();

	ok(stub.calledOnce, 'URL called once');
	equal(stub.getCall(0).args[0].type, 'GET', 'ajax type is GET'); // getting -> GET
    equal(stub.getCall(0).args[0].url, '/mocks/33', 'use URL /mocks/33');
    equal(stub.getCall(0).args[0].dataType, 'json', 'datatype is json');
});

/****** TEST SERVER RESPONSE TO API CALLS ******/

// there is a template

// adding an object gives correct response

// updating an object gives correct response

// deleting an object gives correct response

// getting an object gives correct response

// getting list of all objects gives correct response

// getting filtered list of all objects gives correct response

/****** TEST VALIDATION ******/

module('Validation with validVal', {
	setup: function() {
		// Generate a validating form in #qunit-fixture
		var fix = $('#qunit-fixture');
		var that = this;
		stop();
		fix.load($base_url+'testing/form1', function() {

			// create a model
			that.model = new UltraformModel();

			// create a view and connect it to the model
			that.view = new UltraformView({
				model: this.model, // associate the view with the model
				el: $("#form2").eq(0) // reference the view to the form allready in the DOM
			});

			start();
		});
	},
	teardown: function() {
		delete window.errors;
	}
});

// check form loading
test('loading testform', function() {
	equal($("#form1").length, 1, 'the form is loaded');
});

// $().trigger("validate.vv") is called when we call Backbone.model.validate()
test('Backbone.model.validate() -> $().trigger("validate.vv")', function() {

	// register $("#form1").trigger() to monitor calls to $("#form1").trigger("validval.vv")
	var stub1 = this.stub($("#form1"), 'trigger', function() {});
	var stub2 = this.stub($("#form2"), 'trigger', function() {});

	// call validate() on the model
	this.model.validate();

	expect(3);
	ok(! stub1.called, '$("#form1").trigger() not triggered');
	ok(stub2.calledOnce, '$("#form2").trigger() called once');
	equal(stub2.getCall(0) && stub2.getCall(0).args[0], 'validval.vv', 'trigger calls validval.vv');
});

// jquery.validVal.validate() is called once when we try to update the model
test('validVal.validate() is called once when we try to change the view associated with the form', function() {

	// SET VALUE
	// focus
	$('#req_2').focus();
	// input some text
	$('#req_2').val('some value');
	// blurr
	$('#req_2').blur();

	// register $("#form1").trigger() to monitor calls to $("#form1").trigger("validval.vv")
	var spy1 = this.spy($("#form1"), 'trigger');
	var spy2 = this.spy($("#form2"), 'trigger');

	expect(8);
	ok(! spy1.called, '$("#form1").trigger() not triggered');
	ok(spy2.calledOnce, '$("#form2").trigger() called once');
	equal(spy2.getCall(0) && spy2.getCall(0).args[0], 'validval.vv', 'trigger calls validval.vv');
	equal(this.model.get('req_2'), 'some value', 'model gets updated when input is changed');

	// TRY TO REMOVE VALUE ON REQUIRED FIELD
	// focus
	$('#req_2').focus();
	// input some text
	$('#req_2').val(''); // set required field to ""
	// blurr
	$('#req_2').blur();

	ok(spy2.calledOnce, '$("#form2").trigger() called once');
	equal(spy2.getCall(0) && spy2.getCall(0).args[0], 'validval.vv', 'trigger calls validval.vv');
	equal(this.model.get('req_2'), 'some value', 'model is NOT updated when illegal value entered');
	ok($('#req_2').hasClass('invalid'));

});

// model does not save to the database when validation fails

// check validation shows up
test('onblur on required empty field adds required class', function() {
	expect(2);
	ok(! $('#req_1').hasClass('invalid'), 'when opening the form the required input has no \'invalid\' class');

	// focus and unfocus
	$('#req_1').focus();
	$('#req_1').blur();

	ok($('#req_1').hasClass('invalid'), 'after blurring the input, the class \'invalid\' is added');
});

// check validation does not show up
test('onblur on required non-empty field does not add required class', function() {
	expect(2);
	ok(! $('#req_1').hasClass('invalid'), 'when opening the form the required input has no \'invalid\' class');

	// focus and unfocus
	// add text to the input
	$('#req_1').focus();
	$('#req_1').val('add some text');
	$('#req_1').blur();

	ok(! $('#req_1').hasClass('invalid'), 'after adding text and blurring, the class \'invalid\' is not added');
});
