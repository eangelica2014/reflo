var authorizeNet = require("./authorize-net.js");
const http = require('http');
var customerProfileId;
var customerProfileJson;
const port=process.env.PORT || 3000;
authorizeNet.createCustomerProfile(function(response){
	this.customerProfileId = response.getCustomerProfileId();
	this.customerProfileJson = authorizeNet.getCustomerProfile(this.customerProfileId, function(){});

});

const server = http.createServer((req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.end(''+customerProfileJson);
});
server.listen(port,() => {
console.log('Server running at port '+port);
});

