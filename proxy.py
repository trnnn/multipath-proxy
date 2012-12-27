#!/usr/bin/env python

import tornado.web
import tornado.ioloop
import tornado.httpclient
# from urlparse import urlparse

<<<<<<< HEAD
=======

>>>>>>> bb39f124284664757142637387fd839422e2accb
disallowed_response_headers = frozenset([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailers',
    'transfer-encoding',
    'upgrade',
    # all above are hop-by-hop headers
    'content-encoding',  # may cause decoding errors
    'content-length',
])


class ProxyHandler(tornado.web.RequestHandler):
    SUPPORTED_METHODS = ['GET', 'POST']

<<<<<<< HEAD
    def handle_response(self, response):
=======
    def _handle_response(self, response):
>>>>>>> bb39f124284664757142637387fd839422e2accb
        self.set_status(response.code)

        # check the last comment of http://goo.gl/4w5yj
        for h in response.headers.keys():
            if h.lower() not in disallowed_response_headers:
                list_values = response.headers.get_list(h)
                if len(list_values) == 1:
                    self.set_header(h, list_values[0])
                else:
                    for v in list_values:
                        self.add_header(h, v)

        if response.body:
            self.write(response.body)

        self.finish()

    @tornado.web.asynchronous
    def get(self):
        http_req = tornado.httpclient.HTTPRequest(
            url=self.request.uri,
            method=self.request.method,
            body=self.request.body,
            headers=self.request.headers,
            follow_redirects=False,
            allow_nonstandard_methods=True
        )

<<<<<<< HEAD
        http_client = tornado.httpclient.AsyncHTTPClient()

        try:
            http_client.fetch(http_req, self.handle_response)
        except tornado.httpclient.HTTPError as err:
            self.handle_response(err.response)
=======
        http_client_1 = tornado.httpclient.AsyncHTTPClient()
        http_client_2 = tornado.httpclient.AsyncHTTPClient()

        try:
            http_client_1.fetch(http_req, self._handle_response)
            http_client_2.close()
        except tornado.httpclient.HTTPError as err:
            self._handle_response(err.response)
        except Exception, err:
            self.set_status(500)
            self.write('Internal Server Error: ' + str(err))
            self.finish()

        try:
            http_client_2.fetch(http_req, self._handle_response)
            http_client_1.close()
        except tornado.httpclient.HTTPError as err:
            self._handle_response(err.response)
>>>>>>> bb39f124284664757142637387fd839422e2accb
        except Exception, err:
            self.set_status(500)
            self.write('Internal Server Error: ' + str(err))
            self.finish()

<<<<<<< HEAD
    # define self.post() as self.get()
=======
    # def self.post() as self.get()
>>>>>>> bb39f124284664757142637387fd839422e2accb
    post = get


application = tornado.web.Application(
    [(r'.*', ProxyHandler)],
    debug=True  # please set to false in production environments
)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
