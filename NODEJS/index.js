// console.log("krishan Mohan");

// const {add} = require('./math.js')
// console.log(add(5,3));

// const fs = require('fs')

// fs.write('hello.txt, 'hello mohan baba')

// there are two type of blocking method , blocking and nonblocking method
// async method and non-async method


// const http = require("http");

// const server = http.createServer((req, res) => {
// //   console.log("request received");
//   res.end("Hello Mohan");
// console.log(req.url);

// });

// server.listen(8000, () => {
//   console.log("server is runnning on port 8000");
// });



// const http = require("http");
// const fs = require("fs");

// const server = http.createServer((req, res) => {
//   if (req.url === "/read") {
//     fs.readFile("data.txt", "utf8", (err, data) => {
//       if (err) {
//         res.writeHead(500);
//         return res.end("Error reading file");
//       }
//       res.writeHead(200, { "Content-Type": "text/plain" });
//       res.end(data);
//     });
//   } else if (req.url === "/write") {
//     fs.writeFile("data.txt", "Hello Mohan!\n", (err) => {
//       if (err) {
//         res.writeHead(500);
//         return res.end("Error writing file");
//       }
//       res.writeHead(200);
//       res.end("File written successfully");
//     });
//   } else {
//     res.writeHead(404);
//     res.end("Route Not Found");
//   }
// });

// server.listen(3000, () => {
//   console.log("HTTP File Server running at http://localhost:3000/");
// });



const express = require('express')
const app = express;

const rounter = r

