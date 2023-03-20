'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');


const server = http.createServer((request, response) => {

  let filePath = path.join(
    __dirname,
    'public',
    (request.url === '/')
      ? 'index.html'
      : request.url
  );

  let extname = path.extname(filePath);
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  console.log(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        // Page not found
        fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
          if (err) throw err;
          response.writeHead(200, { 'Content-Type': 'text/html' });
          response.write(content, 'utf8');
          response.end();
        });
      } else {
        // Some server error
        response.writeHead(500);
        response.write(`Server Error: ${err.code}`);
        response.end();
      }
    } else {
      // Success
      response.writeHead(200, { 'Content-Type': contentType });
      response.write(content, 'utf8');
      response.end();
    }
  });

});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
