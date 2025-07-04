const http = require("http");
const fs = require("fs");
const url = require("url")

const server =  http.createServer((req,res)=>{
    const log = `${new Date().toLocaleString()} - New Request received at - ${req.url} for ${req.method}\n`

    fs.appendFile("log.txt",log,(err)=>{
        if(err) console.log(err);
    });

    const parsedURL = url.parse(req.url,true)

    console.log(parsedURL)

    switch(parsedURL.pathname){
        case "/":
            res.end("Hello World");
            break;
        case "/about":
            res.end("About page");
            break;
        case "/contact":
            res.end("Contact page");
            break;
        case "/search":
            res.end(`Search page for name=${parsedURL.query.name} and job=${parsedURL.query.job}`);
            break;
        case "/login":
            if(req.method === "GET"){
                res.end("Login page with GET method");
            } else if(req.method === "POST"){
                res.end("Login page with POST method");
            }
            break;
        default:
            res.end("404 page not found");
            break;
    }   
})

server.listen(8000,()=>{
    console.log("server is running on port 8000");
})