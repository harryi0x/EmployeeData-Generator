const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Employee = require("./models/Employee");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/company")
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });

// Test Route
app.get("/test", (req, res) => {
  res.send("Express Server is Working!");
});

// Generate 10 Employees
app.post("/generate-data", async (req, res) => {
  try {
    // Delete old employee records
    await Employee.deleteMany({});

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

    // Generate 10 random employee records
    const employees = Array.from({ length: 10 }, () => ({
      name: names[Math.floor(Math.random() * names.length)],
      salary: Math.floor(Math.random() * 90000) + 10000,
      language:
        languages[Math.floor(Math.random() * languages.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      isManager: Math.random() < 0.5
    }));

    // Save employees in MongoDB
    const result = await Employee.insertMany(employees);

    res.json({
      success: true,
      message: `${result.length} employees generated successfully!`,
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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

