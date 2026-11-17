const express = require("express");

const app = express();
const PORT = 4000;

// Middleware to read JSON request bodies
app.use(express.json());

// Sample vehicle records
let vehicles = [
  { id: 1, vehicleName: "Hyundai Creta", vehicleNumber: "HR26AB1234", type: "SUV", price: 1500000 },
  { id: 2, vehicleName: "Honda City", vehicleNumber: "DL3CAB5678", type: "Sedan", price: 1200000 },
  { id: 3, vehicleName: "Tata Nexon", vehicleNumber: "UP14CD9012", type: "SUV", price: 1100000 }
];

const requiredFields = ["id", "vehicleName", "vehicleNumber", "type", "price"];

function validateVehicle(vehicle) {
  if (!vehicle || typeof vehicle !== "object" || Array.isArray(vehicle)) {
    return "Request body must be a JSON object";
  }

  const missing = requiredFields.some(field =>
    vehicle[field] === undefined || vehicle[field] === null || vehicle[field] === ""
  );

  if (missing) return "All fields (id, vehicleName, vehicleNumber, type, price) are required";
  if (!Number.isInteger(Number(vehicle.id)) || Number(vehicle.id) <= 0) {
    return "id must be a positive integer";
  }
  if (!Number.isFinite(Number(vehicle.price)) || Number(vehicle.price) <= 0) {
    return "price must be a positive number";
  }

  return null;
}

// Handle malformed JSON sent to express.json()
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  next(err);
});

// GET all vehicles
app.get("/vehicles", (req, res) => {
  res.status(200).json(vehicles);
});

// GET vehicle by ID
app.get("/vehicles/:id", (req, res) => {
  const id = Number(req.params.id);
  const vehicle = vehicles.find(item => item.id === id);

  if (!Number.isInteger(id) || !vehicle) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  res.status(200).json(vehicle);
});

// POST add a vehicle
app.post("/vehicles", (req, res) => {
  const error = validateVehicle(req.body);
  if (error) return res.status(400).json({ error });

  const newVehicle = {
    ...req.body,
    id: Number(req.body.id),
    price: Number(req.body.price)
  };

  if (vehicles.some(item => item.id === newVehicle.id)) {
    return res.status(400).json({ error: "Vehicle ID already exists" });
  }

  vehicles.push(newVehicle);
  res.status(201).json({
    message: "Vehicle added successfully",
    vehicle: newVehicle
  });
});

// PUT update a vehicle
app.put("/vehicles/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = vehicles.findIndex(item => item.id === id);

  if (!Number.isInteger(id) || index === -1) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  const updatedVehicle = { ...vehicles[index], ...req.body, id };

  if (!updatedVehicle.vehicleName || !updatedVehicle.vehicleNumber ||
      !updatedVehicle.type || updatedVehicle.price === undefined ||
      updatedVehicle.price === null || updatedVehicle.price === "" ||
      !Number.isFinite(Number(updatedVehicle.price)) || Number(updatedVehicle.price) <= 0) {
    return res.status(400).json({
      error: "vehicleName, vehicleNumber, type and a positive price are required"
    });
  }

  updatedVehicle.price = Number(updatedVehicle.price);
  vehicles[index] = updatedVehicle;

  res.status(200).json({
    message: "Vehicle updated successfully",
    vehicle: updatedVehicle
  });
});

// DELETE a vehicle
app.delete("/vehicles/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = vehicles.findIndex(item => item.id === id);

  if (!Number.isInteger(id) || index === -1) {
    return res.status(404).json({ error: "Vehicle not found" });
  }

  const deletedVehicle = vehicles.splice(index, 1)[0];
  res.status(200).json({
    message: "Vehicle deleted successfully",
    vehicle: deletedVehicle
  });
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
