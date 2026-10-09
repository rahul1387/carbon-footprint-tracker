// ========================================
// ADD ACTIVITY
// ========================================

let selectedCategory = "transport";
let calculatedActivity = null;


document.addEventListener("DOMContentLoaded", () => {

    setDefaultDate();

    initializeCategoryButtons();

    updateActivityOptions();

    const calculateButton =
        document.getElementById("calculateBtn");

    const saveButton =
        document.getElementById("saveActivityBtn");

    const againButton =
        document.getElementById("calculateAgainBtn");


    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateActivity
        );

    }


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveCalculatedActivity
        );

    }


    if (againButton) {

        againButton.addEventListener(
            "click",
            resetCalculation
        );

    }

});


// ========================================
// DATE (AUTOMATIC - ALWAYS TODAY)
// ========================================

function getTodayDateString() {

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


function setDefaultDate() {

    const display =
        document.getElementById(
            "activityDateText"
        );

    if (!display) return;


    const readable =
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );


    display.textContent =
        `Today · ${readable}`;

}


// ========================================
// CATEGORY BUTTONS
// ========================================

function initializeCategoryButtons() {

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                selectedCategory =
                    button.dataset.category;


                updateActivityOptions();

            }
        );

    });

}


// ========================================
// ACTIVITY OPTIONS
// ========================================

function updateActivityOptions() {

    const select =
        document.getElementById(
            "activityType"
        );


    if (!select) return;


    select.innerHTML = "";


    const factors =
        EMISSION_FACTORS[
            selectedCategory
        ];


    Object.keys(factors).forEach(key => {

        const option =
            document.createElement("option");

        option.value = key;

        option.textContent =
            factors[key].name;

        select.appendChild(option);

    });


    updateQuantityInformation();

    select.onchange =
        updateQuantityInformation;
}


// ========================================
// QUANTITY INFORMATION
// ========================================

function updateQuantityInformation() {

    const select =
        document.getElementById(
            "activityType"
        );

    const unit =
        document.getElementById(
            "quantityUnit"
        );

    const info =
        document.getElementById(
            "quantityInfo"
        );


    if (!select || !unit || !info) return;


    const type =
        select.value;


    if (selectedCategory === "transport") {

        unit.textContent = "km";

        info.textContent =
            "Enter distance travelled in kilometres.";

    }


    else if (selectedCategory === "food") {

        unit.textContent = "g";

        info.textContent =
            "Enter the amount of food consumed in grams.";

    }


    else if (selectedCategory === "shopping") {

        if (type === "general") {

            unit.textContent = "₹";

            info.textContent =
                "Enter the purchase amount in Indian rupees.";

        } else {

            unit.textContent = "items";

            info.textContent =
                "Enter the number of items purchased.";

        }

    }


    else {

        unit.textContent = "units";

        info.textContent =
            "Enter the quantity for this activity.";

    }

}


// ========================================
// CALCULATE
// ========================================

function calculateActivity() {

    const type =
        document.getElementById(
            "activityType"
        ).value;

    const quantity =
        Number(
            document.getElementById(
                "quantity"
            ).value
        );

    const date =
        getTodayDateString();


    if (!type) {

        alert(
            "Please select an activity type."
        );

        return;
    }


    if (!quantity || quantity <= 0) {

        alert(
            "Please enter a quantity greater than zero."
        );

        return;
    }


    let result;


    try {

        if (selectedCategory === "transport") {

            result =
                calculateTransport(
                    quantity,
                    type
                );

        }


        else if (selectedCategory === "food") {

            result =
                calculateFood(
                    quantity,
                    type
                );

        }


        else if (selectedCategory === "shopping") {

            result =
                calculateShopping(
                    quantity,
                    type
                );

        }


        else {

            result =
                calculateOther(
                    quantity,
                    type
                );

        }


    } catch (error) {

        console.error(error);

        alert(
            "Unable to calculate this activity."
        );

        return;
    }


    calculatedActivity = {

        ...result,

        id:
            Date.now().toString(),

        date:
            date,

        createdAt:
            new Date().toISOString()

    };


    displayCalculation(
        calculatedActivity
    );

}


// ========================================
// DISPLAY RESULT
// ========================================

function displayCalculation(result) {

    const placeholder =
        document.querySelector(
            ".result-placeholder"
        );

    const content =
        document.getElementById(
            "resultContent"
        );


    if (placeholder) {

        placeholder.style.display =
            "none";

    }


    if (content) {

        content.style.display =
            "block";

    }


    document.getElementById(
        "resultEmission"
    ).textContent =
        Number(
            result.emission
        ).toFixed(2);


    document.getElementById(
        "resultActivity"
    ).textContent =
        result.activityType;


    document.getElementById(
        "resultQuantity"
    ).textContent =
        `${result.quantity} ${result.unit}`;


    document.getElementById(
        "resultFactor"
    ).textContent =
        `${result.emissionFactor} ${result.factorUnit}`;


    const rangeElement =
        document.getElementById(
            "rangeResult"
        );


    const rangeText =
        document.getElementById(
            "resultRange"
        );


    if (
        result.range &&
        result.minEmission !== undefined &&
        result.maxEmission !== undefined
    ) {

        rangeElement.style.display =
            "block";


        rangeText.textContent =
            `${Number(
                result.minEmission
            ).toFixed(2)}–${Number(
                result.maxEmission
            ).toFixed(2)} kg CO₂e`;

    } else {

        rangeElement.style.display =
            "none";

    }

}


// ========================================
// SAVE
// ========================================

async function saveCalculatedActivity() {

    if (!calculatedActivity) {

        alert(
            "Please calculate an activity first."
        );

        return;
    }


    await addActivity(
        calculatedActivity
    );


    alert(
        "Activity saved successfully!"
    );


    window.location.href =
        "dashboard.html";
}


// ========================================
// RESET
// ========================================

function resetCalculation() {

    calculatedActivity = null;


    const placeholder =
        document.querySelector(
            ".result-placeholder"
        );

    const content =
        document.getElementById(
            "resultContent"
        );


    if (placeholder) {

        placeholder.style.display =
            "block";

    }


    if (content) {

        content.style.display =
            "none";

    }


    document.getElementById(
        "quantity"
    ).value = "";

}


// ========================================
// OTHER
// ========================================

function calculateOther(quantity, type) {

    const factor =
        OTHER_FACTORS[type];


    if (!factor) {

        throw new Error(
            "Other factor not found."
        );

    }


    const emission =
        quantity *
        Number(factor.factor || 0);


    return {

        category: "Other",

        activityType:
            factor.name,

        quantity:
            quantity,

        unit:
            "units",

        emissionFactor:
            factor.factor,

        factorUnit:
            factor.unit,

        emission:
            roundNumber(emission),

        minEmission:
            roundNumber(emission),

        maxEmission:
            roundNumber(emission),

        range:
            false,

        source:
            factor.source

    };

}