var http = require('http');
var url = require('url');
 
var proxy_server = http.createServer(function(client_request, client_response) {
    var parsed_url = url.parse(client_request.url);
    var proxy_request_options = {
        host: parsed_url.host,
        path: parsed_url.path,
        method: client_request.method,
        headers: client_request.headers
    };

    var flag = 0;
    var proxy_request_1, proxy_request_2;
 
    proxy_request_1 = http.request(proxy_request_options, function(proxy_response_1) {
        proxy_response_1.on('data', function(chunk) {
            if (flag === 1) {
                client_response.write(chunk);
            }
        });
        proxy_response_1.on('end', function() {
            if (flag === 1) {
                client_response.end();
            }
        });

        flag = 1;
        // proxy_request_2.abort();
        console.info('Agent 1 ' + client_request.method + ' ' + client_request.url);
        client_response.writeHead(proxy_response_1.statusCode, proxy_response_1.headers);
    });
    proxy_request_1.on('error', function(err) {
        // aborting connections will cause many ECONNRESET errors
        // if (err.code !== 'ECONNRESET') {
            console.error('Proxy Request 1 Error: ' + err.message);
        // }
    });

    proxy_request_2 = http.request(proxy_request_options, function(proxy_response_2) {
        proxy_response_2.on('data', function(chunk) {
            if (flag === 2) {
                client_response.write(chunk);
            }
        });
        proxy_response_2.on('end', function() {
            if (flag === 2) {
                client_response.end();
            }
        });

        flag = 2;
        // proxy_request_1.abort();
        console.info('Agent 2 ' + client_request.method + ' ' + client_request.url);
        client_response.writeHead(proxy_response_2.statusCode, proxy_response_2.headers);
    });
    proxy_request_2.on('error', function(err) {
        // if (err.code !== 'ECONNRESET') {
            console.error('Proxy Request 2 Error: ' + err.message);
        // }
    });


    client_request.pipe(proxy_request_1);
    client_request.pipe(proxy_request_2);
    client_request.on('error', function(err) {
        console.error('Server Error: ' + err.message);
    });
}).listen(8080, function() {
    console.info('Listening on 8080');
});

process.on('uncaughtException', function(err) {
    console.error('Caught exception: ' + err);
});
