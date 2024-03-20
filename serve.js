const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath;

  if (req.url === '/') {
    // Serve docs/index.html for the root route
    filePath = path.join(__dirname, 'docs', 'index.html');
  }
  else if (req.url.startsWith('/pages/')) {
    // Serve files from the 'pages' directory
    filePath = path.join(__dirname, 'docs' + req.url);
  }
  
  else if (req.url.startsWith('/media/')) {
    // Serve files from the 'pages' directory
    filePath = path.join(__dirname,  req.url);
    
  }
  else {
    // Serve other files based on the request URL
    filePath = path.join(__dirname, 'public', req.url);
  }

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Determine the content type based on the file extension
      let contentType = 'text/html';
      const extname = path.extname(filePath);
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
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
      }

      // Successful response
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
