const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Employee = require("./models/Employee");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
async function connectDB() {
const uri =
process.env.MONGODB_URI ||
"mongodb://127.0.0.1:27017/company";

if (mongoose.connection.readyState === 1) {
return;
}

await mongoose.connect(uri);
}

// Test Route
app.get("/test", (req, res) => {
res.send("Express Server is Working!");
});

// Generate 10 Employees
app.post("/generate-data", async (req, res) => {
try {
await connectDB();


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

const employees = Array.from({ length: 10 }, () => ({
  name: names[Math.floor(Math.random() * names.length)],
  salary: Math.floor(Math.random() * 90000) + 10000,
  language:
    languages[Math.floor(Math.random() * languages.length)],
  city: cities[Math.floor(Math.random() * cities.length)],
  isManager: Math.random() < 0.5
}));

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

// Local development server
if (require.main === module) {
app.listen(PORT, () => {
console.log(`Server is running at http://localhost:${PORT}`);
});
}

module.exports = app;
