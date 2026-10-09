// ========================================
// ACTIVITY HISTORY
// ========================================

let currentFilter = "all";


document.addEventListener("DOMContentLoaded", async () => {

    initializeHistoryFilters();

    await loadHistory();

});


// ========================================
// FILTERS
// ========================================

function initializeHistoryFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                buttons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                await loadHistory();

            }
        );

    });

}


// ========================================
// LOAD
// ========================================

async function loadHistory() {

    const activities =
        await getActivities();


    const filtered =
        filterActivities(
            activities,
            currentFilter
        );


    updateHistorySummary(
        filtered
    );


    renderHistory(
        filtered
    );

}


// ========================================
// FILTER
// ========================================

function filterActivities(
    activities,
    filter
) {

    const now =
        new Date();


    return activities.filter(
        activity => {

            if (!activity.date) {

                return filter === "all";

            }


            const date =
                new Date(activity.date);


            if (filter === "all") {

                return true;

            }


            if (filter === "today") {

                return (
                    date.getFullYear() ===
                        now.getFullYear() &&

                    date.getMonth() ===
                        now.getMonth() &&

                    date.getDate() ===
                        now.getDate()
                );

            }


            if (filter === "week") {

                const start =
                    new Date(now);


                const day =
                    start.getDay();


                const difference =
                    day === 0
                        ? 6
                        : day - 1;


                start.setDate(
                    start.getDate() -
                    difference
                );


                start.setHours(
                    0, 0, 0, 0
                );


                return date >= start;

            }


            if (filter === "month") {

                return (
                    date.getFullYear() ===
                        now.getFullYear() &&

                    date.getMonth() ===
                        now.getMonth()
                );

            }


            return true;

        }
    );

}


// ========================================
// SUMMARY
// ========================================

function updateHistorySummary(
    activities
) {

    const count =
        activities.length;


    const total =
        activities.reduce(
            (sum, activity) =>
                sum +
                Number(
                    activity.emission || 0
                ),
            0
        );


    const categories = {

        Transport: 0,
        Food: 0,
        Shopping: 0,
        Other: 0

    };


    activities.forEach(activity => {

        if (
            categories[
                activity.category
            ] !== undefined
        ) {

            categories[
                activity.category
            ] += Number(
                activity.emission || 0
            );

        }

    });


    let highest = "—";
    let highestValue = 0;


    Object.keys(categories)
        .forEach(category => {

            if (
                categories[category] >
                highestValue
            ) {

                highestValue =
                    categories[category];

                highest =
                    category;

            }

        });


    setHistoryText(
        "historyActivityCount",
        count
    );


    setHistoryText(
        "historyTotalEmission",
        total.toFixed(2)
    );


    setHistoryText(
        "historyHighestCategory",
        highest
    );

}


// ========================================
// RENDER
// ========================================

function renderHistory(
    activities
) {

    const container =
        document.getElementById(
            "historyList"
        );


    const resultText =
        document.getElementById(
            "historyResultText"
        );


    if (!container) return;


    const sorted =
        [...activities].sort(
            (a, b) =>
                new Date(
                    b.date || b.createdAt
                ) -
                new Date(
                    a.date || a.createdAt
                )
        );


    if (resultText) {

        resultText.textContent =
            sorted.length === 0
                ? "No activities found."
                : `${sorted.length} activit${
                    sorted.length === 1
                        ? "y"
                        : "ies"
                } found`;

    }


    if (sorted.length === 0) {

        container.innerHTML = `

            <div class="history-empty">

                <div class="history-empty-icon">
                    🌱
                </div>

                <h3>
                    No activities found
                </h3>

                <p>
                    Start tracking your activities
                    to build your carbon footprint history.
                </p>

                <a
                    href="add-activity.html"
                    class="btn btn-primary">

                    Add Activity

                </a>

            </div>

        `;

        return;

    }


    container.innerHTML =
        sorted
            .map(
                createHistoryItem
            )
            .join("");

}


// ========================================
// HISTORY ITEM
// ========================================

function createHistoryItem(
    activity
) {

    const icon =
        getHistoryIcon(
            activity.category
        );


    const emission =
        Number(
            activity.emission || 0
        ).toFixed(2);


    return `

        <article class="history-item">

            <div class="history-item-icon">
                ${icon}
            </div>


            <div class="history-item-main">

                <div class="history-item-title">

                    <h3>
                        ${escapeHtml(
                            activity.activityType ||
                            "Activity"
                        )}
                    </h3>

                    <span class="history-category">
                        ${escapeHtml(
                            activity.category ||
                            "Other"
                        )}
                    </span>

                    <span class="activity-signal ${
                        Number(activity.emission || 0) > 3.0
                            ? 'red'
                            : (Number(activity.emission || 0) > 1.5 ? 'amber' : 'green')
                    }">
                        ${
                            Number(activity.emission || 0) > 3.0
                                ? '🔴 High Impact'
                                : (Number(activity.emission || 0) > 1.5 ? '🟡 Moderate' : '🟢 Eco')
                        }
                    </span>

                </div>


                <div class="history-item-details">

                    <span>
                        📅
                        ${formatHistoryDate(
                            activity.date
                        )}
                    </span>

                    <span>
                        📏
                        ${formatHistoryQuantity(
                            activity
                        )}
                    </span>

                </div>

            </div>


            <div class="history-item-emission">

                <strong>
                    ${emission}
                </strong>

                <span>
                    kg CO₂e
                </span>

            </div>


            <button
                type="button"
                class="history-delete"
                onclick="deleteHistoryActivity('${activity.id}')">

                🗑️

            </button>

        </article>

    `;

}


// ========================================
// DELETE
// ========================================

async function deleteHistoryActivity(
    id
) {

    if (
        !confirm(
            "Delete this activity?"
        )
    ) {

        return;

    }


    await deleteActivity(id);

    await loadHistory();

}


// ========================================
// HELPERS
// ========================================

function setHistoryText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


function getHistoryIcon(
    category
) {

    const icons = {

        Transport: "🚗",
        Food: "🍔",
        Shopping: "🛍️",
        Other: "⚡"

    };


    return icons[category] ||
        "🌱";

}


function formatHistoryQuantity(
    activity
) {

    const quantity =
        Number(
            activity.quantity || 0
        );


    if (
        activity.unit ===
        "grams"
    ) {

        if (quantity >= 1000) {

            return `${(
                quantity / 1000
            ).toFixed(2)} kg`;

        }

        return `${quantity} g`;

    }


    if (
        activity.unit ===
        "km"
    ) {

        return `${quantity} km`;

    }


    if (
        activity.unit ===
        "₹"
    ) {

        return `₹${quantity.toLocaleString(
            "en-IN"
        )}`;

    }


    if (
        activity.unit ===
        "items"
    ) {

        return `${quantity} item${
            quantity === 1
                ? ""
                : "s"
        }`;

    }


    return `${quantity} ${
        activity.unit || ""
    }`;

}


function formatHistoryDate(
    value
) {

    if (!value) {

        return "Unknown date";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown date";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}