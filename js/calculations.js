// ========================================
// CARBON EMISSION CALCULATIONS
// ========================================


// ========================================
// ROUND NUMBER
// ========================================

function roundNumber(number, decimals = 2) {

    const multiplier =
        Math.pow(10, decimals);

    return Math.round(
        number * multiplier
    ) / multiplier;

}


// ========================================
// TRANSPORT
// ========================================

function calculateTransport(distance, transportType) {

    const factor =
        TRANSPORT_FACTORS[transportType];


    if (!factor) {

        throw new Error(
            "Transport factor not found."
        );

    }


    // Distance × grams CO₂e per km
    const grams =
        distance * factor.factor;


    // Convert grams to kilograms
    const kilograms =
        grams / 1000;


    return {

        category: "Transport",

        activityType:
            factor.name,

        quantity:
            distance,

        unit:
            "km",

        emissionFactor:
            factor.factor,

        factorUnit:
            factor.unit,

        emission:
            roundNumber(kilograms),

        minEmission:
            roundNumber(kilograms),

        maxEmission:
            roundNumber(kilograms),

        range:
            false,

        source:
            factor.source

    };

}


// ========================================
// FOOD
// ========================================

function calculateFood(quantity, foodType) {

    const factor =
        FOOD_FACTORS[foodType];


    if (!factor) {

        throw new Error(
            "Food factor not found."
        );

    }


    // User enters grams
    // Convert grams → kilograms
    const kilograms =
        quantity / 1000;


    // Calculate range
    const minEmission =
        kilograms * factor.min;

    const maxEmission =
        kilograms * factor.max;


    // Midpoint used as the displayed estimate
    const emission =
        kilograms * factor.factor;


    return {

        category: "Food",

        activityType:
            factor.name,

        quantity:
            quantity,

        unit:
            "grams",

        emissionFactor:
            `${factor.min}–${factor.max}`,

        factorUnit:
            factor.unit,

        emission:
            roundNumber(emission),

        minEmission:
            roundNumber(minEmission),

        maxEmission:
            roundNumber(maxEmission),

        range:
            true,

        source:
            factor.source

    };

}


// ========================================
// SHOPPING
// ========================================

function calculateShopping(quantity, shoppingType) {

    const factor =
        SHOPPING_FACTORS[shoppingType];


    if (!factor) {

        throw new Error(
            "Shopping factor not found."
        );

    }


    let emission;
    let minEmission;
    let maxEmission;


    // General purchase
    // Factor is per ₹100
    if (shoppingType === "general") {

        const hundreds =
            quantity / 100;


        emission =
            hundreds * factor.factor;

        minEmission =
            hundreds * factor.min;

        maxEmission =
            hundreds * factor.max;

    }

    // Specific products
    else {

        emission =
            quantity * factor.factor;

        minEmission =
            quantity * factor.min;

        maxEmission =
            quantity * factor.max;

    }


    return {

        category: "Shopping",

        activityType:
            factor.name,

        quantity:
            quantity,

        unit:
            shoppingType === "general"
                ? "₹"
                : "items",

        emissionFactor:
            `${factor.min}–${factor.max}`,

        factorUnit:
            factor.unit,

        emission:
            roundNumber(emission),

        minEmission:
            roundNumber(minEmission),

        maxEmission:
            roundNumber(maxEmission),

        range:
            true,

        source:
            factor.source

    };

}