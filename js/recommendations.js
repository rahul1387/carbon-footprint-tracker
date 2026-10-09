document.addEventListener("DOMContentLoaded", async () => {
    await loadRecommendations();
});


async function loadRecommendations() {
    const activities = await getActivities();

    updateSummary(activities);

    const container = document.getElementById("recommendationContent");

    if (!container) return;

    if (activities.length === 0) {
        showNoData(container);
        return;
    }

    const totals = calculateCategoryTotals(activities);

    const highestCategory = getHighestCategory(totals);

    container.innerHTML = buildRecommendationCards(
        totals,
        highestCategory
    );
}


function updateSummary(activities) {
    const totalEmission = activities.reduce(
        (total, activity) => total + Number(activity.emission || 0),
        0
    );

    const totals = calculateCategoryTotals(activities);
    const highestCategory = getHighestCategory(totals);

    const totalElement = document.getElementById("totalEmission");
    const categoryElement = document.getElementById("highestCategory");
    const countElement = document.getElementById("activityCount");

    if (totalElement) {
        totalElement.textContent =
            `${roundNumber(totalEmission)} kg CO₂e`;
    }

    if (categoryElement) {
        categoryElement.textContent =
            highestCategory ? highestCategory.name : "No data";
    }

    if (countElement) {
        countElement.textContent = activities.length;
    }
}


function calculateCategoryTotals(activities) {
    const totals = {
        Transport: 0,
        Food: 0,
        Shopping: 0,
        Other: 0
    };

    activities.forEach(activity => {
        const category = activity.category;

        if (Object.prototype.hasOwnProperty.call(totals, category)) {
            totals[category] += Number(activity.emission || 0);
        }
    });

    return totals;
}


function getHighestCategory(totals) {
    let highestName = null;
    let highestValue = 0;

    Object.entries(totals).forEach(([name, value]) => {
        if (value > highestValue) {
            highestValue = value;
            highestName = name;
        }
    });

    if (!highestName) {
        return null;
    }

    return {
        name: highestName,
        value: highestValue
    };
}


function buildRecommendationCards(totals, highestCategory) {

    const recommendations = {
        Transport: {
            icon: "🚗",
            title: "Transport",
            tips: [
                "Choose public transport such as buses, metro or rail when practical.",
                "For short journeys, consider walking or cycling.",
                "Combine multiple errands into a single trip.",
                "For unavoidable car journeys, sharing rides can reduce emissions per passenger."
            ]
        },

        Food: {
            icon: "🍔",
            title: "Food",
            tips: [
                "Try reducing the frequency of high-impact foods such as beef and mutton.",
                "Include more vegetables, fruits and lower-impact foods in your meals.",
                "Avoid buying more food than you need to reduce food waste.",
                "Plan meals ahead so that ingredients are used efficiently."
            ]
        },

        Shopping: {
            icon: "🛍️",
            title: "Shopping",
            tips: [
                "Buy products only when they are genuinely needed.",
                "Choose durable products that can be used for a longer period.",
                "Repair or reuse items before replacing them.",
                "For clothing, consider reusing, donating or buying second-hand items."
            ]
        },

        Other: {
            icon: "⚡",
            title: "Other",
            tips: [
                "Reduce unnecessary electricity consumption.",
                "Switch off lights and appliances when they are not required.",
                "Avoid unnecessary waste and reuse items where possible.",
                "Track more activities in this category when relevant so your estimate becomes more complete."
            ]
        }
    };


    return Object.entries(recommendations)
        .map(([category, data]) => {

            const total = totals[category] || 0;

            const isHighest =
                highestCategory &&
                highestCategory.name === category;

            const highlightClass =
                isHighest ? "highlight" : "";

            const priorityText =
                isHighest
                    ? "⭐ Highest impact — focus here first"
                    : "Recommended action area";

            return `
                <article class="recommendation-card ${highlightClass}">

                    <div class="recommendation-card-header">

                        <div class="recommendation-icon">
                            ${data.icon}
                        </div>

                        <div>
                            <h3>${data.title}</h3>

                            <div class="category-total">
                                Estimated impact:
                                ${roundNumber(total)} kg CO₂e
                            </div>
                        </div>

                    </div>

                    <ul>
                        ${data.tips
                            .map(tip => `<li>${tip}</li>`)
                            .join("")}
                    </ul>

                    <span class="priority-badge">
                        ${priorityText}
                    </span>

                </article>
            `;
        })
        .join("");
}


function showNoData(container) {
    container.innerHTML = `
        <div class="no-data">

            <div class="empty-icon">🌱</div>

            <h2>No activities tracked yet</h2>

            <p>
                Add your first activity to calculate your estimated
                carbon footprint and receive personalized recommendations.
            </p>

            <a href="add-activity.html" class="btn btn-primary">
                + Add Your First Activity
            </a>

        </div>
    `;
}


function roundNumber(number, decimals = 2) {
    const multiplier = Math.pow(10, decimals);

    return Math.round(number * multiplier) / multiplier;
}