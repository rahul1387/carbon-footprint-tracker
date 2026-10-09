// ========================================
// SEED SCRIPT: 3 DAYS SAMPLE DATA
// ========================================
// Populates MongoDB with 3 days of realistic carbon footprint data:
//   Day 1: Low-Carbon / Eco Day       -> 🟢 GREEN SIGNAL (3.56 kg CO₂e)
//   Day 2: High-Carbon / Spike Day     -> 🔴 RED SIGNAL   (20.41 kg CO₂e)
//   Day 3: Recovery / Eco Day         -> 🟢 GREEN SIGNAL (4.73 kg CO₂e)
// ========================================

const { MongoClient } = require("mongodb");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.MONGODB_DB || "carbontrack";
const COLLECTION_NAME = "activities";

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function generate3DaysActivities() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const d1Str = formatDate(twoDaysAgo);
    const d2Str = formatDate(yesterday);
    const d3Str = formatDate(today);

    return [
        // ==========================================
        // DAY 1 (2 Days Ago) - 🟢 GREEN SIGNAL (3.56 kg)
        // Public transit + plant-based diet + low electricity
        // ==========================================
        {
            _id: "seed-d1-1",
            category: "Transport",
            activityType: "Metro / Local Train",
            quantity: 18,
            unit: "km",
            emissionFactor: 55,
            factorUnit: "g CO₂e/km",
            emission: 0.99,
            minEmission: 0.99,
            maxEmission: 0.99,
            range: false,
            source: "Educational reference factor",
            date: d1Str,
            createdAt: `${d1Str}T08:30:00.000Z`
        },
        {
            _id: "seed-d1-2",
            category: "Transport",
            activityType: "Cycling",
            quantity: 5,
            unit: "km",
            emissionFactor: 0,
            factorUnit: "g CO₂e/km",
            emission: 0.00,
            minEmission: 0.00,
            maxEmission: 0.00,
            range: false,
            source: "Educational reference factor",
            date: d1Str,
            createdAt: `${d1Str}T09:15:00.000Z`
        },
        {
            _id: "seed-d1-3",
            category: "Food",
            activityType: "Pulses / Lentils",
            quantity: 300,
            unit: "grams",
            emissionFactor: "0.6–1.3",
            factorUnit: "kg CO₂e/kg",
            emission: 0.27,
            minEmission: 0.18,
            maxEmission: 0.39,
            range: true,
            source: "Educational reference factor",
            date: d1Str,
            createdAt: `${d1Str}T13:00:00.000Z`
        },
        {
            _id: "seed-d1-4",
            category: "Food",
            activityType: "Rice",
            quantity: 250,
            unit: "grams",
            emissionFactor: "2–4",
            factorUnit: "kg CO₂e/kg",
            emission: 0.68,
            minEmission: 0.50,
            maxEmission: 1.00,
            range: true,
            source: "Educational reference factor",
            date: d1Str,
            createdAt: `${d1Str}T13:10:00.000Z`
        },
        {
            _id: "seed-d1-5",
            category: "Food",
            activityType: "Vegetables",
            quantity: 400,
            unit: "grams",
            emissionFactor: "0.3–0.9",
            factorUnit: "kg CO₂e/kg",
            emission: 0.20,
            minEmission: 0.12,
            maxEmission: 0.36,
            range: true,
            source: "Educational reference factor",
            date: d1Str,
            createdAt: `${d1Str}T20:00:00.000Z`
        },
        {
            _id: "seed-d1-6",
            category: "Other",
            activityType: "Electricity",
            quantity: 2,
            unit: "unit",
            emissionFactor: 0.71,
            factorUnit: "kg CO₂e/unit",
            emission: 1.42,
            minEmission: 1.42,
            maxEmission: 1.42,
            range: false,
            source: "Educational reference factor",
            date: d1Str,
            createdAt: `${d1Str}T22:00:00.000Z`
        },

        // ==========================================
        // DAY 2 (Yesterday) - 🔴 RED SIGNAL (20.41 kg)
        // Petrol car commute + mutton meal + heavy AC energy + shopping
        // ==========================================
        {
            _id: "seed-d2-1",
            category: "Transport",
            activityType: "Petrol Car",
            quantity: 45,
            unit: "km",
            emissionFactor: 170,
            factorUnit: "g CO₂e/km",
            emission: 7.65,
            minEmission: 7.65,
            maxEmission: 7.65,
            range: false,
            source: "Educational reference factor",
            date: d2Str,
            createdAt: `${d2Str}T09:00:00.000Z`
        },
        {
            _id: "seed-d2-2",
            category: "Food",
            activityType: "Mutton / Lamb",
            quantity: 250,
            unit: "grams",
            emissionFactor: "18–35",
            factorUnit: "kg CO₂e/kg",
            emission: 6.00,
            minEmission: 4.50,
            maxEmission: 8.75,
            range: true,
            source: "Educational reference factor",
            date: d2Str,
            createdAt: `${d2Str}T13:30:00.000Z`
        },
        {
            _id: "seed-d2-3",
            category: "Other",
            activityType: "Electricity",
            quantity: 6,
            unit: "unit",
            emissionFactor: 0.71,
            factorUnit: "kg CO₂e/unit",
            emission: 4.26,
            minEmission: 4.26,
            maxEmission: 4.26,
            range: false,
            source: "Educational reference factor",
            date: d2Str,
            createdAt: `${d2Str}T18:00:00.000Z`
        },
        {
            _id: "seed-d2-4",
            category: "Shopping",
            activityType: "Books / Stationery",
            quantity: 1,
            unit: "item",
            emissionFactor: 2.5,
            factorUnit: "kg CO₂e/item",
            emission: 2.50,
            minEmission: 1.50,
            maxEmission: 5.00,
            range: true,
            source: "Educational reference factor",
            date: d2Str,
            createdAt: `${d2Str}T19:30:00.000Z`
        },

        // ==========================================
        // DAY 3 (Today) - 🟢 GREEN SIGNAL (4.73 kg)
        // Bus commute + walking + chicken & vegetables + lower energy
        // ==========================================
        {
            _id: "seed-d3-1",
            category: "Transport",
            activityType: "Bus",
            quantity: 15,
            unit: "km",
            emissionFactor: 90,
            factorUnit: "g CO₂e/km",
            emission: 1.35,
            minEmission: 1.35,
            maxEmission: 1.35,
            range: false,
            source: "Educational reference factor",
            date: d3Str,
            createdAt: `${d3Str}T08:45:00.000Z`
        },
        {
            _id: "seed-d3-2",
            category: "Transport",
            activityType: "Walking",
            quantity: 2,
            unit: "km",
            emissionFactor: 0,
            factorUnit: "g CO₂e/km",
            emission: 0.00,
            minEmission: 0.00,
            maxEmission: 0.00,
            range: false,
            source: "Educational reference factor",
            date: d3Str,
            createdAt: `${d3Str}T09:30:00.000Z`
        },
        {
            _id: "seed-d3-3",
            category: "Food",
            activityType: "Chicken",
            quantity: 200,
            unit: "grams",
            emissionFactor: "4.5–8",
            factorUnit: "kg CO₂e/kg",
            emission: 1.20,
            minEmission: 0.90,
            maxEmission: 1.60,
            range: true,
            source: "Educational reference factor",
            date: d3Str,
            createdAt: `${d3Str}T13:15:00.000Z`
        },
        {
            _id: "seed-d3-4",
            category: "Food",
            activityType: "Vegetables",
            quantity: 300,
            unit: "grams",
            emissionFactor: "0.3–0.9",
            factorUnit: "kg CO₂e/kg",
            emission: 0.15,
            minEmission: 0.09,
            maxEmission: 0.27,
            range: true,
            source: "Educational reference factor",
            date: d3Str,
            createdAt: `${d3Str}T13:45:00.000Z`
        },
        {
            _id: "seed-d3-5",
            category: "Food",
            activityType: "Tea / Coffee",
            quantity: 100,
            unit: "grams",
            emissionFactor: "1.5–4",
            factorUnit: "kg CO₂e/kg",
            emission: 0.25,
            minEmission: 0.15,
            maxEmission: 0.40,
            range: true,
            source: "Educational reference factor",
            date: d3Str,
            createdAt: `${d3Str}T17:00:00.000Z`
        },
        {
            _id: "seed-d3-6",
            category: "Other",
            activityType: "Electricity",
            quantity: 2.5,
            unit: "unit",
            emissionFactor: 0.71,
            factorUnit: "kg CO₂e/unit",
            emission: 1.78,
            minEmission: 1.78,
            maxEmission: 1.78,
            range: false,
            source: "Educational reference factor",
            date: d3Str,
            createdAt: `${d3Str}T21:00:00.000Z`
        }
    ];
}

async function seed() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const col = db.collection(COLLECTION_NAME);

        // Clear existing activities
        await col.deleteMany({});

        const activities = generate3DaysActivities();
        await col.insertMany(activities);

        console.log(`\n Successfully seeded ${activities.length} activities for 3 days!`);
        console.log(" ----------------------------------------------------");
        console.log("   Day 1: 3.56 kg CO₂e  -> 🟢 GREEN SIGNAL (Eco-Friendly)");
        console.log("   Day 2: 20.41 kg CO₂e -> 🔴 RED SIGNAL   (High Emission Alert)");
        console.log("   Day 3: 4.73 kg CO₂e  -> 🟢 GREEN SIGNAL (On Track / Recovered)");
        console.log(" ----------------------------------------------------\n");
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    } finally {
        await client.close();
    }
}

if (require.main === module) {
    seed();
}

module.exports = { generate3DaysActivities };
