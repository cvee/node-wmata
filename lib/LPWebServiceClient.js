var Crypto = require('crypto');
var Events = require('events');
var Http = require('http');
var Https = require('https');
var Util = require('util');

/**
 * Creates an instance of LPWebServiceClient.
 *
 * @constructor
 * @this {LPWebServiceClient}
 */
var LPWebServiceClient = function()
{
    Events.EventEmitter.call(this);

    /** @private */
    this._connections = {};
};

Util.inherits(LPWebServiceClient, Events.EventEmitter);

/**
 * Returns the connection object associated with the specified key.
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {String} aKey
 * @return The connection object or null.
 */
LPWebServiceClient.prototype._connectionForKey = function(aKey)
{
    var connection = this._connections[aKey];

    return connection === undefined ? null : connection;
};

/**
 *
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {http.ClientRequest} aRequest The request object.
 */
LPWebServiceClient.prototype._connectionDidClose = function(aConnection)
{
    var connection = aConnection;
    //var connection = this._connectionForKey(aRequest.hash);
    if (connection !== undefined)
    {
        var error = undefined;
        var result = null;
        try
        {
            result = JSON.parse(connection.data);
        }
        catch (e)
        {
            error = e;
        }

        connection.callback(error, result);

        //this._removeConnectionForKey(aConnection.hash);
    }
};

/**
 *
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {http.ClientRequest} aRequest The request object.
 */
LPWebServiceClient.prototype._connectionDidEnd = function(aConnection)
{
    var connection = aConnection;
    //var connection = this._connectionForKey(aRequest.hash);
    if (connection !== undefined)
    {
        var error = undefined;
        var result = null;
        try
        {
            result = JSON.parse(connection.data);
        }
        catch (e)
        {
            error = e;
        }

        connection.callback(error, result);

        //this._removeConnectionForKey(aConnection.hash);
    }
};

/**
 * Handles a request failure.
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {http.ClientRequest} aRequest The request object.
 * @param {Error} aError
 */
LPWebServiceClient.prototype._connectionDidFailWithError = function(aConnection, aError)
{
    var connection = aConnection;
    //var connection = this._connectionForKey(aRequest.hash);
    if (connection !== undefined)
    {
        connection.callback(aError, undefined);

        //this._removeConnectionForKey(aConnection.hash);
    }
};

/**
 * Handles data received from the server.
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {http.ClientRequest} aRequest The request object.
 * @param {Buffer} aData
 */
LPWebServiceClient.prototype._connectionDidReceiveData = function(aConnection, aData)
{
    var connection = aConnection;
    //var connection = this._connectionForKey(aRequest.hash);
    if (connection === undefined) return;

    var receivedData = connection['data'] + aData.toString('utf8');
    connection['data'] = receivedData;
};

/**
 * Handles a response by the server.
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {http.ClientRequest} aRequest The request object.
 * @param {http.ClientResponse} aResponse The response object.
 */
LPWebServiceClient.prototype._connectionDidReceiveResponse = function(aConnection, aResponse)
{
    var connection = aConnection;
    //var connection = this._connectionForKey(aRequest.hash);
    if (connection !== undefined)
    {
        connection['data'] = '';
    }

    // Error handling for status codes documented at
    // https://dev.twitter.com/docs/error-codes-responses
    var error = null;
    if (aResponse.statusCode !== 200)
    {
        error = new Error();
        error.code = aResponse.statusCode;
    }

    switch(aResponse.statusCode)
    {
        case 304:
            error.message = 'Not Modified.';
            break;
        case 400:
            error.message = 'Bad Request';
            break;
        case 401:
            error.message = 'Unauthorized';
            break;
        case 403:
            error.message = 'Forbidden';
            break;
        case 404:
            error.message = 'Not Found';
            break;
        case 406:
            error.message = 'Not Acceptable';
            break;
        case 420:
            error.message = 'Enhance Your Calm';
            break;
        case 500:
            error.message = 'Internal Server Error';
            break;
        case 502:
            error.message = 'Bad Gateway';
            break;
        case 503:
            error.message = 'Service Unavailable';
            break;
    }

    if (error !== null)
    {
        this._connectionDidFailWithError(aConnection, error);

        return;
    }
};

/**
 * Creates a new connection from a client request object.
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {ClientRequest} aClientRequest A client request object.
 * @param {Function} aCallback The callback function.
 */
LPWebServiceClient.prototype._createConnectionForClientRequest = function(aClientRequest, aCallback)
{
    var connection = {callback: aCallback, clientRequest: aClientRequest, data: ''};

    this._createEventListenersForConnection(connection);
}

/**
 * Creates a new connection from a URL object.
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {String} aURL A URL object.
 * @param {Function} aCallback The callback function.
 */
LPWebServiceClient.prototype._createConnectionForURL = function(aURL, aCallback)
{
    var clientRequest = null;
    var clientRequestOptions = {method: 'GET', hostname: aURL.hostname, port: (aURL.port ? aURL.port : 80), path: aURL.path};
    switch(aURL.protocol)
    {
        case 'http:':
            clientRequest = Http.request(clientRequestOptions);
            break;
        case 'https:':
            clientRequest = Https.request(clientRequestOptions);
            break;
        default:
            throw Error('URL contains unsupported request protocol.');
    }
    
    if (clientRequest !== null)
    {
        this._createConnectionForClientRequest(clientRequest, aCallback);

        clientRequest.end();
    }
};

/**
 * Creates listeners that respond to events triggered by the specified 
 * connection object.
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {Connection} aConnection The connection object.
 */
LPWebServiceClient.prototype._createEventListenersForConnection = function(aConnection)
{
    var self = this;

    var clientRequest = aConnection.clientRequest;
    clientRequest.on('error', function(error) {
        self._connectionDidFailWithError(aConnection, error);
    });

    clientRequest.on('response', function(aResponse) {
        aResponse.on('close', function() {
            self._connectionDidClose(aConnection);
        });
    
        aResponse.on('data', function(data) {
            self._connectionDidReceiveData(aConnection, data);
        });
    
        aResponse.on('end', function() {
            self._connectionDidEnd(aConnection);
        });

        aResponse.on('error', function(error) {
            self._connectionDidFailWithError(aConnection, error);
        });

        self._connectionDidReceiveResponse(aConnection, aResponse);
    });
};

/**
 * Removes the connection object associated with the specified key.
 *
 * @private
 * @this {LPWebServiceClient}
 * @param {String} aKey
 */
LPWebServiceClient.prototype._removeConnectionForKey = function(aKey)
{
    if (this._connectionForKey(aKey))
    {
        delete this._connections[aKey];
    }
};

module.exports = LPWebServiceClient;
