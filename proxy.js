#!/usr/bin/env node

var http = require('http');
var url = require('url');
 
http.createServer(function(client_request, client_response) {
    var parsed_url = url.parse(client_request.url);
    var proxy_request_options = {
        host: parsed_url.host,
        path: parsed_url.path,
        method: client_request.method,
        headers: client_request.headers
    };
    console.info(client_request.method + ' ' + client_request.url);
    // console.log('\nClient Request:');  
    // console.log(proxy_request_options);

    var buff = [];
 
    var proxy_request = http.request(proxy_request_options, function(proxy_response) {
        proxy_response.on('data', function(chunk) {
            buff.push(chunk);
        });
        proxy_response.on('end', function() {
            var i;
            for (i = 0; i < buff.length; i++) {
                client_response.write(buff[i]);
            }
            client_response.end();
        });
        client_response.writeHead(proxy_response.statusCode, proxy_response.headers);
        // console.log('\nServer Response:');
        // console.log(proxy_response.statusCode);
        // console.log(proxy_response.headers);
    });
    client_request.pipe(proxy_request);
}).listen(8080);
