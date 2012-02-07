var WebServiceClientTestCase = require('./WebServiceClientTestCase');

var apiKey = 'API_KEY';

var webServiceClientTestCase = new WebServiceClientTestCase(apiKey);
webServiceClientTestCase.setUp();
webServiceClientTestCase.testCreate();

// API calls are limited to no more than five calls per second. To be safe, 
// unit test calls are fired in sets of five, every two seconds.
// http://developer.wmata.com/faq
setTimeout(
    function() {
        webServiceClientTestCase.testBusPositions();
        webServiceClientTestCase.testBusPrediction();
        webServiceClientTestCase.testBusRouteDetails();
        webServiceClientTestCase.testBusRoutes();
        webServiceClientTestCase.testBusRouteSchedule();
    },
    0
);

setTimeout(
    function() {
        webServiceClientTestCase.testBusStops();
        webServiceClientTestCase.testBusStopSchedule();
        webServiceClientTestCase.testElevatorIncidents();
        webServiceClientTestCase.testRailIncidents();
        webServiceClientTestCase.testRailLines();
    },
    2000
);

setTimeout(
    function() {
        webServiceClientTestCase.testRailPaths();
        webServiceClientTestCase.testRailStationEntrances();
        webServiceClientTestCase.testRailStationInfo();
        webServiceClientTestCase.testRailStationPrediction();
        webServiceClientTestCase.testRailStations();
    },
    4000
);
