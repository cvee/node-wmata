var WMATA = require('../lib/WMATA');

var wmataWebServiceClient = new WMATA.WebServiceClient('API_KEY');
wmataWebServiceClient.busRouteSchedule('16L', '2010-10-26', true, function(error, result) {
    if (error)
    {
        console.log(error);
    }

    if (result)
    {
        console.log(result);
    }
});
