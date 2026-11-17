# MT1-LABEXAM – Vehicle Management

## Setup
```bash
npm install
```

## Run Part A: Node.js HTTP server
```bash
node httpServer.js
```
Open `http://localhost:3000/`, `/vehicles`, `/about` and `/info`.

POST `/add-vehicle` using Postman:
```json
{
  "id": 4,
  "vehicleName": "Maruti Swift",
  "vehicleNumber": "DL8CAF5030",
  "type": "Hatchback",
  "price": 750000
}
```

## Run Part B: Express REST API
Open another terminal:
```bash
node expressApp.js
```
Use base URL `http://localhost:4000`.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/vehicles` | Get all vehicles |
| GET | `/vehicles/1` | Get vehicle by ID |
| POST | `/vehicles` | Add vehicle |
| PUT | `/vehicles/1` | Update vehicle |
| DELETE | `/vehicles/1` | Delete vehicle |

For POST, choose **Body → raw → JSON** in Postman and send:
```json
{
  "id": 4,
  "vehicleName": "Maruti Swift",
  "vehicleNumber": "DL8CAF5030",
  "type": "Hatchback",
  "price": 750000
}
```

For PUT, send the fields to update as JSON, for example:
```json
{
  "vehicleName": "Updated Creta",
  "vehicleNumber": "HR26AB1234",
  "type": "SUV",
  "price": 1600000
}
```

## GitHub
Create a repository named `MT1-LABEXAM`, then:
```bash
git init
git add .
git commit -m "Initial vehicle management project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```
Commit updates module-wise with meaningful messages. Save the required terminal, browser and Postman screenshots in `screenshots/`.
