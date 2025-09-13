const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('../models/Bus');
const Route = require('../models/Route');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

const seedRoutes = async () => {
  const routes = [
    {
      routeNumber: "101",
      routeName: "City Center - Airport",
      stops: [
        { name: "City Center", location: { lat: 12.9716, lng: 77.5946 }, order: 1 },
        { name: "Railway Station", location: { lat: 12.976, lng: 77.6033 }, order: 2 },
        { name: "Bus Stand", location: { lat: 12.98, lng: 77.61 }, order: 3 },
        { name: "Airport", location: { lat: 13.1986, lng: 77.7066 }, order: 4 },
      ],
      isActive: true,
    },
    {
      routeNumber: "102",
      routeName: "Market - University",
      stops: [
        { name: "Main Market", location: { lat: 12.95, lng: 77.58 }, order: 1 },
        { name: "Hospital", location: { lat: 12.955, lng: 77.59 }, order: 2 },
        { name: "College", location: { lat: 12.96, lng: 77.6 }, order: 3 },
        { name: "University", location: { lat: 12.97, lng: 77.62 }, order: 4 },
      ],
      isActive: true,
    },
  ];

  await Route.deleteMany({});
  await Route.insertMany(routes);
  console.log('✅ Routes seeded successfully');
};

const seedBuses = async () => {
  const buses = [
    {
      routeNumber: "101",
      currentStop: "City Center",
      nextStop: "Railway Station",
      currentLocation: { lat: 12.9716, lng: 77.5946 },
      crowdLevel: "medium",
      conductorId: "c1",
      passengerCount: 25,
      maxCapacity: 50,
      estimatedArrival: "5 mins",
      isActive: true,
    },
    {
      routeNumber: "101",
      currentStop: "Bus Stand",
      nextStop: "Airport",
      currentLocation: { lat: 12.98, lng: 77.61 },
      crowdLevel: "low",
      conductorId: "c2",
      passengerCount: 12,
      maxCapacity: 50,
      estimatedArrival: "15 mins",
      isActive: true,
    },
    {
      routeNumber: "102",
      currentStop: "Hospital",
      nextStop: "College",
      currentLocation: { lat: 12.955, lng: 77.59 },
      crowdLevel: "high",
      conductorId: "c3",
      passengerCount: 45,
      maxCapacity: 50,
      estimatedArrival: "8 mins",
      isActive: true,
    },
  ];

  await Bus.deleteMany({});
  await Bus.insertMany(buses);
  console.log('✅ Buses seeded successfully');
};

const seedData = async () => {
  try {
    await connectDB();
    await seedRoutes();
    await seedBuses();
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
