var WMATA = require('../lib/WMATA');

var wmataWebServiceClient = new WMATA.WebServiceClient('API_KEY');
wmataWebServiceClient.railLines(function(error, result) {
    if (error)
    {
        console.log(error);
    }

    if (result)
    {
        console.log(result);
    }
});
