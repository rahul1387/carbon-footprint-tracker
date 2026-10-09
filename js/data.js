// ========================================
// EMISSION FACTORS
// ========================================
//
// Approximate reference factors used by the
// calculator in calculations.js / activity.js.
//
// TRANSPORT : grams CO₂e per km
// FOOD      : kg CO₂e per kg of product
// SHOPPING  : general = per Rs.100 spent,
//             others  = per item
// OTHER     : kg CO₂e per unit
//
// Values are educational approximations based on
// public datasets (IPCC, DEFRA, Poore & Nemecek)
// and Indian grid / transport averages.
// ========================================


const FACTOR_SOURCE =
    "Approximate reference factors (IPCC / DEFRA / Poore & Nemecek style averages)";


// ========================================
// TRANSPORT
// ========================================

const TRANSPORT_FACTORS = {

    petrolCar: {
        name: "Petrol Car",
        factor: 170,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    dieselCar: {
        name: "Diesel Car",
        factor: 160,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    taxi: {
        name: "Taxi / Cab",
        factor: 200,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    motorcycle: {
        name: "Motorcycle / Scooter",
        factor: 110,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    autoRickshaw: {
        name: "Auto Rickshaw",
        factor: 90,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    bus: {
        name: "Bus",
        factor: 90,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    metro: {
        name: "Metro / Local Train",
        factor: 55,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    train: {
        name: "Train (Long Distance)",
        factor: 45,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    flightDomestic: {
        name: "Flight (Domestic)",
        factor: 250,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    flightInternational: {
        name: "Flight (International)",
        factor: 190,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    cycling: {
        name: "Cycling",
        factor: 0,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    },

    walking: {
        name: "Walking",
        factor: 0,
        unit: "g CO₂e/km",
        source: FACTOR_SOURCE
    }

};


// ========================================
// FOOD
// ========================================

const FOOD_FACTORS = {

    beef: {
        name: "Beef",
        factor: 60,
        min: 45,
        max: 75,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    mutton: {
        name: "Mutton / Lamb",
        factor: 24,
        min: 18,
        max: 35,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    chicken: {
        name: "Chicken",
        factor: 6,
        min: 4.5,
        max: 8,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    fish: {
        name: "Fish",
        factor: 5,
        min: 3,
        max: 9,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    eggs: {
        name: "Eggs",
        factor: 4.5,
        min: 3.5,
        max: 6,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    milk: {
        name: "Milk",
        factor: 3,
        min: 2,
        max: 4,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    paneer: {
        name: "Paneer",
        factor: 6,
        min: 4.5,
        max: 8,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    cheese: {
        name: "Cheese",
        factor: 13.5,
        min: 9,
        max: 20,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    rice: {
        name: "Rice",
        factor: 2.7,
        min: 2,
        max: 4,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    wheat: {
        name: "Wheat / Atta",
        factor: 1.4,
        min: 1,
        max: 2,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    bread: {
        name: "Bread",
        factor: 1.5,
        min: 1,
        max: 2.2,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    pulses: {
        name: "Pulses / Lentils",
        factor: 0.9,
        min: 0.6,
        max: 1.3,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    vegetables: {
        name: "Vegetables",
        factor: 0.5,
        min: 0.3,
        max: 0.9,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    fruits: {
        name: "Fruits",
        factor: 0.8,
        min: 0.4,
        max: 1.4,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    sugar: {
        name: "Sugar",
        factor: 3,
        min: 2,
        max: 4,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    },

    teaCoffee: {
        name: "Tea / Coffee",
        factor: 2.5,
        min: 1.5,
        max: 4,
        unit: "kg CO₂e/kg",
        source: FACTOR_SOURCE
    }

};


// ========================================
// SHOPPING
// ========================================

const SHOPPING_FACTORS = {

    general: {
        name: "General Purchase (by amount)",
        factor: 0.25,
        min: 0.15,
        max: 0.5,
        unit: "kg CO₂e per Rs.100",
        source: FACTOR_SOURCE
    },

    clothing: {
        name: "Clothing",
        factor: 15,
        min: 8,
        max: 30,
        unit: "kg CO₂e/item",
        source: FACTOR_SOURCE
    },

    footwear: {
        name: "Footwear",
        factor: 12,
        min: 6,
        max: 25,
        unit: "kg CO₂e/item",
        source: FACTOR_SOURCE
    },

    electronics: {
        name: "Electronics / Gadgets",
        factor: 60,
        min: 30,
        max: 150,
        unit: "kg CO₂e/item",
        source: FACTOR_SOURCE
    },

    books: {
        name: "Books / Stationery",
        factor: 2.5,
        min: 1.5,
        max: 5,
        unit: "kg CO₂e/item",
        source: FACTOR_SOURCE
    }

};


// ========================================
// OTHER
// ========================================

const OTHER_FACTORS = {

    electricity: {
        name: "Electricity",
        factor: 0.71,
        unit: "kg CO₂e/unit",
        source: FACTOR_SOURCE
    },

    lpg: {
        name: "LPG",
        factor: 2.98,
        unit: "kg CO₂e/unit",
        source: FACTOR_SOURCE
    },

    diesel: {
        name: "Diesel / Generator",
        factor: 2.7,
        unit: "kg CO₂e/unit",
        source: FACTOR_SOURCE
    },

    waste: {
        name: "Waste",
        factor: 0.5,
        unit: "kg CO₂e/unit",
        source: FACTOR_SOURCE
    }

};


// ========================================
// CATEGORY MAP
// (used by the Add Activity page)
// ========================================

const EMISSION_FACTORS = {

    transport: TRANSPORT_FACTORS,
    food: FOOD_FACTORS,
    shopping: SHOPPING_FACTORS,
    other: OTHER_FACTORS

};


// ========================================
// 3-DAY SAMPLE DATA GENERATOR
// ========================================

function getSample3DaysActivities() {

    function formatYMD(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);

    const d1 = formatYMD(twoDaysAgo);
    const d2 = formatYMD(yesterday);
    const d3 = formatYMD(today);

    return [
        // DAY 1 (2 Days Ago) - 🟢 GREEN SIGNAL (3.56 kg)
        {
            id: "seed-d1-1",
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
            source: FACTOR_SOURCE,
            date: d1,
            createdAt: `${d1}T08:30:00.000Z`
        },
        {
            id: "seed-d1-2",
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
            source: FACTOR_SOURCE,
            date: d1,
            createdAt: `${d1}T09:15:00.000Z`
        },
        {
            id: "seed-d1-3",
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
            source: FACTOR_SOURCE,
            date: d1,
            createdAt: `${d1}T13:00:00.000Z`
        },
        {
            id: "seed-d1-4",
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
            source: FACTOR_SOURCE,
            date: d1,
            createdAt: `${d1}T13:10:00.000Z`
        },
        {
            id: "seed-d1-5",
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
            source: FACTOR_SOURCE,
            date: d1,
            createdAt: `${d1}T20:00:00.000Z`
        },
        {
            id: "seed-d1-6",
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
            source: FACTOR_SOURCE,
            date: d1,
            createdAt: `${d1}T22:00:00.000Z`
        },

        // DAY 2 (Yesterday) - 🔴 RED SIGNAL (20.41 kg)
        {
            id: "seed-d2-1",
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
            source: FACTOR_SOURCE,
            date: d2,
            createdAt: `${d2}T09:00:00.000Z`
        },
        {
            id: "seed-d2-2",
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
            source: FACTOR_SOURCE,
            date: d2,
            createdAt: `${d2}T13:30:00.000Z`
        },
        {
            id: "seed-d2-3",
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
            source: FACTOR_SOURCE,
            date: d2,
            createdAt: `${d2}T18:00:00.000Z`
        },
        {
            id: "seed-d2-4",
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
            source: FACTOR_SOURCE,
            date: d2,
            createdAt: `${d2}T19:30:00.000Z`
        },

        // DAY 3 (Today) - 🟢 GREEN SIGNAL (4.73 kg)
        {
            id: "seed-d3-1",
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
            source: FACTOR_SOURCE,
            date: d3,
            createdAt: `${d3}T08:45:00.000Z`
        },
        {
            id: "seed-d3-2",
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
            source: FACTOR_SOURCE,
            date: d3,
            createdAt: `${d3}T09:30:00.000Z`
        },
        {
            id: "seed-d3-3",
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
            source: FACTOR_SOURCE,
            date: d3,
            createdAt: `${d3}T13:15:00.000Z`
        },
        {
            id: "seed-d3-4",
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
            source: FACTOR_SOURCE,
            date: d3,
            createdAt: `${d3}T13:45:00.000Z`
        },
        {
            id: "seed-d3-5",
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
            source: FACTOR_SOURCE,
            date: d3,
            createdAt: `${d3}T17:00:00.000Z`
        },
        {
            id: "seed-d3-6",
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
            source: FACTOR_SOURCE,
            date: d3,
            createdAt: `${d3}T21:00:00.000Z`
        }
    ];
}
