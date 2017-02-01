// Lets require/import the HTTP module
const http = require('http');
const fs = require('fs');
const url = require('url');

const auth = require('http-auth');
const Parser = require('./lib/Parser.js');

const basic = auth.basic({
  realm: 'Parser',
  file: __dirname + '/users.htpasswd'
});

// Lets define a port we want to listen to
const PORT = process.env.PORT || 8080;

// We need a function which handles requests and send response
const handleRequest = (request, response) => {
  let currentUrl = url.parse(request.url, true);

  if (currentUrl.query.url && currentUrl.query.url !== '') {
    return new Parser(currentUrl.query.url)
      .then((data) => {
        return response.end(JSON.stringify(data));
      })
      .catch(console.error);
  }

  if (currentUrl.pathname === '/') {
    let index = fs.readFileSync('index.html').toString();

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    return response.end(index);
  }

  return response.end('');
};

// Create a server and start it
http.createServer(basic, handleRequest).listen(PORT, () => {
  console.log('Server listening on: http://localhost:%s', PORT);
});
