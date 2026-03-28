const Category = require("../models/Category");

const DEFAULT_CATEGORIES = [
  { name: "Plumbing", description: "Water, pipes, drainage and bathroom issues" },
  { name: "Electricity", description: "Lighting, power outages and electrical faults" },
  { name: "Internet", description: "Wi-Fi and network connectivity issues" },
  { name: "Furniture", description: "Beds, chairs, wardrobes and room fixtures" },
  { name: "Cleaning", description: "Sanitation and cleanliness of common areas" },
  { name: "Security", description: "Door locks, access control and safety concerns" },
  { name: "Other", description: "Any issue that does not fit the above categories" },
];

const seedCategories = async () => {
  try {
    const existing = await Category.countDocuments();
    if (existing > 0) return; // already seeded

    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log("Default categories seeded successfully");
  } catch (error) {
    console.error("Category seed error:", error.message);
  }
};

module.exports = seedCategories;
