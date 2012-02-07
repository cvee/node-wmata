var QueryString = require('querystring');
var URL = require('url');
var Util = require('util');
var Constants = require('./Constants');
var LPWebServiceClient = require('./LPWebServiceClient');

/**
 * Creates an instance of WMATAWebServiceClient.
 *
 * @constructor
 * @this {Client}
 * @param {String} apiKey
 */
var WMATAWebServiceClient = function(apiKey)
{
    LPWebServiceClient.call(this);

    /** @private */
    this._apiBaseUrlString = Constants.WebServiceAPIBaseURLString;
    /** @private */
    this._apiKey = apiKey;
    /** @private */
    this._apiVersion = Constants.WebServiceAPIVersion;
};

Util.inherits(WMATAWebServiceClient, LPWebServiceClient);

/**
 * Returns the API key.
 *
 * @return {String} The API key.
 */
WMATAWebServiceClient.prototype.apiKey = function()
{
    return this._apiKey;
}

/**
 * Returns the real-time positions of each bus traveling a specified route inside specified area. Bus position information is updated every two minutes or less.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_13">WMATA API documentation</a>.
 *
 * @param {string} routeId
 * @param {boolean} includeVariations
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} radius
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.busPositions = function(routeId, includeVariations, latitude, longitude, radius, callback)
{
    var parameters = {
        routeId: routeId,
        includingVariations: includeVariations,
        lat: latitude,
        lon: longitude,
        radius: radius
    };
    var requestURL = this._createRequestURL(Constants.WebServiceModuleBus, 'JBusPositions', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns the bus arrival predictions for a specific bus stop according to the real-time positions of the buses.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_15_BusPrediction">WMATA API documentation</a>.
 *
 * @param {string} stopId
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.busPrediction = function(stopId, callback)
{
    var parameters = {StopID: stopId};
    var requestURL = this._createRequestURL(Constants.WebServiceModuleNextBusService, 'JPredictions', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns a sequence of lat/long points which can be used to describe a specific bus route.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_12">WMATA API documentation</a>.
 *
 * @param {string} routeId
 * @param {Date} date
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.busRouteDetails = function(routeId, date, callback)
{
    var parameters = {routeId: routeId, date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()};
    var requestURL = this._createRequestURL(Constants.WebServiceModuleBus, 'JRouteDetails', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns a list of all bus routes.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_9">WMATA API documentation</a>.
 *
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.busRoutes = function(callback)
{
    var requestURL = this._createRequestURL(Constants.WebServiceModuleBus, 'JRoutes', Constants.WebServiceResponseFormat);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns the bus schedule associated with a requested route.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_11">WMATA API documentation</a>.
 *
 * @param {string} routeId
 * @param {Date} date
 * @param {boolean} includeVariations
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.busRouteSchedule = function(routeId, date, includeVariations, callback)
{
    var parameters = {
        routeId: routeId,
        date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        includingVariations: includeVariations
    };
    var requestURL = this._createRequestURL(Constants.WebServiceModuleBus, 'JRouteSchedule', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns the list of all bus stops. If a latitude/ longitude or radius is not provided or equals 0, all stops will be returned.  Radius is expressed in meters.  Stops are ordered by distance from latitude/ longitude, if provided.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_10">WMATA API documentation</a>.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} radius
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.busStops = function(latitude, longitude, radius, callback)
{
    var parameters = {
        lat: latitude,
        lon: longitude,
        radius: radius
    };
    var requestURL = this._createRequestURL(Constants.WebServiceModuleBus, 'JStops', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns the bus schedule for a specific bus stop.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_14">WMATA API documentation</a>.
 *
 * @param {number} stopId
 * @param {Date} date
 * @param {boolean} includeVariations
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.busStopSchedule = function(stopId, date, includeVariations, callback)
{
    var parameters = {
        stopId: stopId,
        date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        includingVariations: includeVariations
    };
    var requestURL = this._createRequestURL(Constants.WebServiceModuleBus, 'JStopSchedule', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns elevator and escalator statuses as they appear on the Public Information Displays throughout the transit system.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_7_Elevator_Incidents">WMATA API documentation</a>.
 *
 * @param {String} stationCode The station code.
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.elevatorIncidents = function(stationCode, callback)
{
    var parameters = {StationCode: stationCode};
    var requestURL = this._createRequestURL(Constants.WebServiceModuleIncidents, 'ElevatorIncidents', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns rail incidents as they appear on the the Public Information Displays throughout the transit system.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_6_Rail_Incidents">WMATA API documentation</a>.
 *
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.railIncidents = function(callback)
{
    var requestURL = this._createRequestURL(Constants.WebServiceModuleIncidents, 'Incidents', Constants.WebServiceResponseFormat);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns descriptive information about all rail lines.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method1">WMATA API documentation</a>.
 *
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.railLines = function(callback)
{
    var requestURL = this._createRequestURL(Constants.WebServiceModuleRail, 'JLines', Constants.WebServiceResponseFormat);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns a list of stations between two given stations.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_4_Path">WMATA API documentation</a>.
 *
 * @param {string} fromStationCode
 * @param {string} toStationCode
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.railPaths = function(fromStationCode, toStationCode, callback)
{
    var parameters = {FromStationCode: fromStationCode, ToStationCode: toStationCode};
    var requestURL = this._createRequestURL(Constants.WebServiceModuleRail, 'JPath', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns entrances (including elevators) to Metro stations. If a latitude/ longitude or radius is not provided or equals 0, all entrances will be returned.  Radius is expressed in meters.  Entrances are ordered by distance from latitude/ longitude, if provided.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method8">WMATA API documentation</a>.
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param {number} radius
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.railStationEntrances = function(latitude, longitude, radius, callback)
{
    var parameters = {
        lat: latitude,
        lon: longitude,
        radius: radius
    };
    var requestURL = this._createRequestURL(Constants.WebServiceModuleRail, 'JStationEntrances', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns descriptive information about a single station.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method_3_Station_Info">WMATA API documentation</a>.
 *
 * @param {string} stationCode
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.railStationInfo = function(stationCode, callback)
{
    var parameters = {StationCode: stationCode};
    var requestURL = this._createRequestURL(Constants.WebServiceModuleRail, 'JStationInfo', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns train arrival information as it appears on the Public Information Displays throughout the system.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method5">WMATA API documentation</a>.
 *
 * @param {Array} stationCodes An array containing zero or more station codes.
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.railStationPrediction = function(stationCodes, callback)
{
    var stationCodesString = 'All';
    if (Array.isArray(stationCodes) && stationCodes.length > 0)
    {
        stationCodesString = stationCodes.join(',');
    }

    var requestURL = this._createRequestURL(Constants.WebServiceModuleStationPrediction, 'GetPrediction/' + stationCodesString, Constants.WebServiceResponseFormat);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Returns list of all stations in the system or all stations by line.
 *
 * For additional information see the official <a href="http://developer.wmata.com/docs/read/Method2">WMATA API documentation</a>.
 *
 * @param {string} lineCode
 * @param {Function} callback The callback function.
 */
WMATAWebServiceClient.prototype.railStations = function(lineCode, callback)
{
    var parameters = {LineCode: lineCode};
    var requestURL = this._createRequestURL(Constants.WebServiceModuleRail, 'JStations', Constants.WebServiceResponseFormat, parameters);

    this._createConnectionForURL(requestURL, callback);
}

/**
 * Creates a URL.
 *
 * @private
 * @param {String} module
 * @param {String} resource
 * @param {String} format
 * @param {Array} parameters
 */
WMATAWebServiceClient.prototype._createRequestURL = function(module, resource, format, parameters)
{
    var requestQueryString = QueryString.stringify(parameters);
    if (requestQueryString.length > 0)
    {
        requestQueryString = requestQueryString + '&'
    }
    requestQueryString = requestQueryString + 'api_key=' + this.apiKey();

    var requestUrlString = this._apiBaseUrlString + '/' + module + '.svc/' + format + '/' + resource + '?' + requestQueryString;
    console.log(requestUrlString);
    return URL.parse(requestUrlString);
}

module.exports = WMATAWebServiceClient;
