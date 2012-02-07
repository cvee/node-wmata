var assert = require('assert');
var WMATA = require('../lib/WMATA');
var Util = require('util');

/**
 * Creates an instance of WebServiceClientTestCase.
 *
 * @constructor
 */
var WebServiceClientTestCase = function(apiKey)
{
    Object.call(this);

    this._apiKey = apiKey;
    this._wmataWebServiceClient = null;
};

Util.inherits(WebServiceClientTestCase, Object);

WebServiceClientTestCase.prototype.setUp = function()
{
    this._wmataWebServiceClient = new WMATA.WebServiceClient(this._apiKey);
};

WebServiceClientTestCase.prototype.tearDown = function()
{
    delete(this._wmataWebServiceClient);
    this._wmataWebServiceClient = null;
};

WebServiceClientTestCase.prototype.testCreate = function()
{
    assert.equal(true, this._wmataWebServiceClient instanceof WMATA.WebServiceClient);
};

WebServiceClientTestCase.prototype.testBusPositions = function()
{
    this._wmataWebServiceClient.busPositions('10A', true, 38.878586, -76.989626, 50000, function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testBusPrediction = function()
{
    this._wmataWebServiceClient.busPrediction(1001888, function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testBusRouteDetails = function()
{
    this._wmataWebServiceClient.busRouteDetails('16L', new Date(), function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testBusRoutes = function()
{
    this._wmataWebServiceClient.busRoutes(function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testBusRouteSchedule = function()
{
    this._wmataWebServiceClient.busRouteSchedule('16L', new Date(), true, function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testBusStops = function()
{
    this._wmataWebServiceClient.busStops(38.878586, -76.989626, 500, function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testBusStopSchedule = function()
{
    this._wmataWebServiceClient.busStopSchedule(2000019, new Date(), true, function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testElevatorIncidents = function()
{
    this._wmataWebServiceClient.elevatorIncidents('A01', function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testRailIncidents = function()
{
    this._wmataWebServiceClient.railIncidents(function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testRailLines = function()
{
    this._wmataWebServiceClient.railLines(function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testRailPaths = function()
{
    this._wmataWebServiceClient.railPaths('A10', 'A12', function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testRailStationEntrances = function()
{
    this._wmataWebServiceClient.railStationEntrances(38.878586, -76.989626, 500, function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testRailStationInfo = function()
{
    this._wmataWebServiceClient.railStationInfo('A10', function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testRailStationPrediction = function()
{
    this._wmataWebServiceClient.railStationPrediction(['A10', 'A11'], function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

WebServiceClientTestCase.prototype.testRailStations = function()
{
    this._wmataWebServiceClient.railStations('RD', function(error, result) {
        assert.ifError(error);
        assert.deepEqual(typeof(result), 'object');
    });
};

module.exports = WebServiceClientTestCase;
