const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");

const port = 5000;
const host = "localhost";

const contactsPath = path.join(__dirname + "/contacts/");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  let store = "";

  req.on("data", (chunk) => {
    store += chunk;
  });

  req.on("end", () => {
    if (method == "GET" && pathname == "/") {
      fs.createReadStream("./index.html").pipe(res);
    }

    if (method == "GET" && pathname == "/about") {
      fs.createReadStream("./about.html").pipe(res);
    }

    if (method == "GET" && pathname == "/contact") {
      fs.createReadStream("./contact.html").pipe(res);
    }

    if (method == "POST" && pathname == "/form") {
      store = qs.parse(store);
      const username = store.username;

      fs.open(contactsPath + username + ".json", "wx", (err, fd) => {
        if (err) console.log(err);

        fs.writeFile(fd, JSON.stringify(store), (err) => {
          if (err) console.log(err);

          fs.close(fd, () => {
            res.writeHead(201, { "Content-Type": "text.html" });
            res.end("<p>Contact Saved!</p>");
          });
        });
      });
    }

    if (method == "GET" && pathname == "/users") {
      const username = parsedUrl.query.username;

      fs.readFile(contactsPath + username + ".json", (err, content) => {
        if (err) console.log(err);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(content);
      });
    }
  });
});

server.listen(port, host, () => {
  console.log("server started on server 5000");
});
