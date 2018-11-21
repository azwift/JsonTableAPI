const express = require('express');
const fs = require('fs');

const app = express();
app.use('/',express.static( 'src'));

app.listen('3000');
console.log("go to http://localhost:3000");