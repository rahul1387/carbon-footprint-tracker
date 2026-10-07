// ========================================
// DASHBOARD
// ========================================

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

});


// ========================================
// LOAD DASHBOARD
// ========================================

function loadDashboard() {

    const activities = getActivities();

    updateDashboardSummary(activities);

    updateCategoryBreakdown(activities);

    updateRecentActivities(activities);

}


// ========================================
// SUMMARY
// ========================================

function updateDashboardSummary(activities) {

    const totalEmission =
        activities.reduce(
            (total, activity) => {

                return total +
                    Number(activity.emission || 0);

            },
            0
        );


    const activityCount =
        activities.length;


    const categoryTotals = {

        Transport: 0,
        Food: 0,
        Shopping: 0,
        Other: 0

    };


    activities.forEach(activity => {

        if (
            categoryTotals[activity.category] !== undefined
        ) {

            categoryTotals[activity.category] +=
                Number(activity.emission || 0);

        }

    });


    let biggestCategory = "—";
    let biggestValue = 0;


    Object.keys(categoryTotals).forEach(category => {

        if (
            categoryTotals[category] > biggestValue
        ) {

            biggestValue =
                categoryTotals[category];

            biggestCategory =
                category;
        }

    });


    const totalElement =
        document.getElementById("totalEmission");

    const countElement =
        document.getElementById("activityCount");

    const biggestElement =
        document.getElementById("biggestContributor");


    if (totalElement) {

        totalElement.textContent =
            totalEmission.toFixed(2);

    }


    if (countElement) {

        countElement.textContent =
            activityCount;

    }


    if (biggestElement) {

        biggestElement.textContent =
            biggestCategory;

    }

}


// ========================================
// CATEGORY BREAKDOWN
// ========================================

function updateCategoryBreakdown(activities) {

    const totals = {

        Transport: 0,
        Food: 0,
        Shopping: 0,
        Other: 0

    };


    activities.forEach(activity => {

        if (
            totals[activity.category] !== undefined
        ) {

            totals[activity.category] +=
                Number(activity.emission || 0);

        }

    });


    const total =
        Object.values(totals).reduce(
            (sum, value) => sum + value,
            0
        );


    setText(
        "donutTotal",
        total.toFixed(2)
    );

    setText(
        "transportTotal",
        totals.Transport.toFixed(2) + " kg"
    );

    setText(
        "foodTotal",
        totals.Food.toFixed(2) + " kg"
    );

    setText(
        "shoppingTotal",
        totals.Shopping.toFixed(2) + " kg"
    );

    setText(
        "otherTotal",
        totals.Other.toFixed(2) + " kg"
    );


    const donut =
        document.getElementById("donutChart");


    if (!donut) return;


    if (total === 0) {

        donut.style.background =
            "conic-gradient(#e5ece8 0deg 360deg)";

        return;
    }


    const transportDegrees =
        totals.Transport / total * 360;

    const foodDegrees =
        totals.Food / total * 360;

    const shoppingDegrees =
        totals.Shopping / total * 360;


    const transportEnd =
        transportDegrees;

    const foodEnd =
        transportEnd + foodDegrees;

    const shoppingEnd =
        foodEnd + shoppingDegrees;


    donut.style.background = `
        conic-gradient(
            var(--chart-transport)
            0deg ${transportEnd}deg,

            var(--chart-food)
            ${transportEnd}deg ${foodEnd}deg,

            var(--chart-shopping)
            ${foodEnd}deg ${shoppingEnd}deg,

            var(--chart-other)
            ${shoppingEnd}deg 360deg
        )
    `;

}


// ========================================
// RECENT ACTIVITIES
// ========================================

function updateRecentActivities(activities) {

    const container =
        document.getElementById("recentActivities");


    if (!container) return;


    if (activities.length === 0) {

        container.innerHTML = `
            <div class="empty-dashboard">

                <span>🌱</span>

                <p>
                    No activities recorded yet.
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


    const recent =
        [...activities]
            .sort(
                (a, b) =>
                    new Date(b.date || b.createdAt) -
                    new Date(a.date || a.createdAt)
            )
            .slice(0, 5);


    container.innerHTML =
        recent
            .map(activity => {

                const icon =
                    getDashboardIcon(
                        activity.category
                    );

                return `
                    <div class="recent-activity">

                        <div class="recent-icon">
                            ${icon}
                        </div>

                        <div class="recent-info">

                            <strong>
                                ${escapeDashboardHtml(
                                    activity.activityType ||
                                    "Activity"
                                )}
                            </strong>

                            <span>
                                ${escapeDashboardHtml(
                                    activity.category ||
                                    "Other"
                                )}
                            </span>

                        </div>

                        <strong class="recent-emission">
                            ${Number(
                                activity.emission || 0
                            ).toFixed(2)}
                            kg
                        </strong>

                    </div>
                `;

            })
            .join("");

}


// ========================================
// HELPERS
// ========================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


function getDashboardIcon(category) {

    const icons = {

        Transport: "🚗",
        Food: "🍔",
        Shopping: "🛍️",
        Other: "⚡"

    };

    return icons[category] || "🌱";

}


function escapeDashboardHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}