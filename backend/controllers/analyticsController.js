const Ticket = require("../models/Ticket");
const Bus = require("../models/Bus");
const Route = require("../models/Route");

exports.getAnalytics = async (req, res) => {
  try {
    // 1. Get all tickets (for ridership + revenue)
    const tickets = await Ticket.find();
    const buses = await Bus.find({ isActive: true });
    const routes = await Route.find({ isActive: true });

    // Daily ridership (group by day of week)
    const dailyRidership = Array(7).fill(0);
    tickets.forEach(ticket => {
      const day = new Date(ticket.createdAt).getDay(); // 0=Sun,6=Sat
      dailyRidership[day] += ticket.passengerCount;
    });

    const ridershipData = [
      { day: "Sun", passengers: dailyRidership[0] },
      { day: "Mon", passengers: dailyRidership[1] },
      { day: "Tue", passengers: dailyRidership[2] },
      { day: "Wed", passengers: dailyRidership[3] },
      { day: "Thu", passengers: dailyRidership[4] },
      { day: "Fri", passengers: dailyRidership[5] },
      { day: "Sat", passengers: dailyRidership[6] },
    ];

    // Route efficiency data
    const routeEfficiency = await Promise.all(
      routes.map(async (route) => {
        const routeTickets = tickets.filter(t => t.routeNumber === route.routeNumber);
        const avgPassengers = routeTickets.length
          ? Math.round(routeTickets.reduce((sum, t) => sum + t.passengerCount, 0) / routeTickets.length)
          : 0;

        return {
          route: route.routeNumber,
          name: route.routeName,
          avgPassengers,
          onTimePercentage: Math.floor(Math.random() * 20) + 75, // Mock (replace with GPS punctuality later)
          revenue: routeTickets.reduce((sum, t) => sum + t.fare, 0)
        };
      })
    );

    // Peak hours (count tickets by hour)
    const peakHoursMap = {};
    tickets.forEach(ticket => {
      const hour = new Date(ticket.createdAt).getHours();
      peakHoursMap[hour] = (peakHoursMap[hour] || 0) + ticket.passengerCount;
    });

    const peakHours = Object.keys(peakHoursMap).map(h => ({
      hour: `${h}:00`,
      load: Math.min(100, Math.floor((peakHoursMap[h] / 50) * 10)) // mock normalization
    }));

    res.json({
      dailyRidership: ridershipData,
      routeEfficiency,
      peakHours
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
