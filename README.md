# VehicleBooking

## How to run
- Make sure your postgres server is running.
- In [application.properties](src/main/resources/application.properties), change the `spring.datasource` variables if necessary.
- Create a database called `vehicle_booking`.
- Press "Run" while having selected the class [VehicleBookingApplication.java](src/main/java/ee/vehicleBooking/vehicleBooking/VehicleBookingApplication.java) in your favourite IDE.

## API
API access point: http://localhost:8080/api
For a quick test, follow this checklist:
- GET http://localhost:8080/api/vehicles - the response should be `[]` (200 OK)
- POST http://localhost:8080/api/vehicles with the body `{}` - the response should list all errors in the body (400 Bad Request)
- POST http://localhost:8080/api/vehicles with the body:
```
{
    "company": "Ford",
    "name": "F150",
    "numberOfSeats": 2,
    "fuel": "diesel",
    "transmission": "manual",
    "year": 1990
}
```
the response should be the created object (201 Created)
- GET http://localhost:8080/api/vehicles - the response should be a one-element list of the created object (200 OK)
- DELETE http://localhost:8080/api/vehicles/1 - the response should be (204 No Content)
- GET http://localhost:8080/api/vehicles - the response should be `[]` (200 OK)