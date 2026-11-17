const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

let vehicles = [
  { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
  { id: 2, vehicleName: "Honda City", vehicleNumber: "DL3CAB5678", type: "Sedan", price: 1200000 },
  { id: 3, vehicleName: "Tata Nexon", vehicleNumber: "UP14CD9012", type: "SUV", price: 1100000 }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Welcome route
  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>Vehicle Management</title></head>
      <body>
        <h1>Welcome to Vehicle Management</h1>
        <p>Node.js HTTP Server is working.</p>
        <a href="/vehicles">View Vehicles</a>
      </body>
      </html>
    `);
  }

  // Get all vehicles
  if (method === "GET" && url === "/vehicles") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(vehicles, null, 2));
  }

  // About route
  if (method === "GET" && url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end("<h1>About</h1><p>This application manages vehicle records using Node.js.</p>");
  }

  // Serve static HTML file using fs module
  if (method === "GET" && url === "/info") {
    const filePath = path.join(__dirname, "public", "info.html");
    return fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("500 - Unable to read info.html");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(data);
    });
  }

  // Add vehicle using POST
  if (method === "POST" && url === "/add-vehicle") {
    let body = "";
    req.on("data", chunk => { body += chunk; });

    req.on("end", () => {
      let vehicle;
      try {
        vehicle = JSON.parse(body);
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Invalid JSON body" }));
      }

      const required = ["id", "vehicleName", "vehicleNumber", "type", "price"];
      const missing = required.some(field =>
        vehicle[field] === undefined || vehicle[field] === null || vehicle[field] === ""
      );

      if (missing || !Number.isFinite(Number(vehicle.price)) || Number(vehicle.price) <= 0) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "All required fields must be provided and price must be positive" }));
      }

      if (vehicles.some(item => item.id === Number(vehicle.id))) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Vehicle ID already exists" }));
      }

      vehicle.id = Number(vehicle.id);
      vehicle.price = Number(vehicle.price);
      vehicles.push(vehicle);

      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        message: "Vehicle added successfully",
        vehicle
      }, null, 2));
    });
    return;
  }

  // Invalid route
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  return res.end("404 - Route not found");
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
