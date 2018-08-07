var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var PORT = process.env.PORT || 5000;

var app = express();

function setAllowWebUSBPolicy(res, path) {
  res.setHeader('Feature-Policy', 'usb *;');
}

app.use(
  serveStatic(path.join(__dirname, 'public'), {
    setHeaders: setAllowWebUSBPolicy
  })
);

app.listen(PORT);

console.log(`up and running on: ${PORT}`);
