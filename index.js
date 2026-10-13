
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Employee = require("./models/Employee");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB Atlas
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI missing. Check your .env file."
    );
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });

  console.log("Connected to MongoDB Atlas!");
  console.log("Database:", mongoose.connection.name);
}

// Test server
app.get("/test", (req, res) => {
  res.send("Express Server is Working!");
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    await connectDB();

    res.json({
      success: true,
      message: "MongoDB Atlas connected successfully!",
      database: mongoose.connection.name
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "MongoDB Atlas connection failed.",
      error: error.message
    });
  }
});

// Generate 10 employees
app.post("/generate-data", async (req, res) => {
  try {
    await connectDB();

    const names = [
      "Harry", "Ali", "Ahmed", "John", "Sara",
      "Ayesha", "Usman", "Hamza", "Zara", "Bilal",
      "Hassan", "Fatima", "David", "Emma", "Noah"
    ];

    const languages = [
      "JavaScript", "Python", "Java", "PHP", "C++"
    ];

    const cities = [
      "New York", "Lahore", "London", "Karachi", "Dubai"
    ];

    const employees = Array.from({ length: 10 }, () => ({
      name: names[Math.floor(Math.random() * names.length)],
      salary: Math.floor(Math.random() * 90000) + 10000,
      language:
        languages[Math.floor(Math.random() * languages.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      isManager: Math.random() < 0.5
    }));

       // Delete old employee records
    await Employee.deleteMany({});

    // Save 10 new employee records to Atlas
    const result = await Employee.insertMany(employees);

    res.json({
      success: true,
      message: `${result.length} employees saved successfully!`,
      employees: result
    });
  } catch (error) {
    console.error("Error generating employees:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate employees",
      error: error.message
    });
  }
});

// Start local server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;