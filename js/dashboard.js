// ========================================
// DASHBOARD CONTROLLER
// ========================================
// Multi-Day Carbon Analysis & Green/Red Signals
// ========================================

const DAILY_BUDGET_KG = 6.00; // Sustainable daily CO₂e budget threshold

document.addEventListener("DOMContentLoaded", async () => {

    setupDashboardActions();

    await loadDashboard();

});


// ========================================
// ACTION BUTTONS (SAMPLE DATA & RESET)
// ========================================

function setupDashboardActions() {

    const loadBtn = document.getElementById("loadSampleDataBtn");
    const resetBtn = document.getElementById("resetDataBtn");

    if (loadBtn) {

        loadBtn.addEventListener("click", async () => {

            const originalText = loadBtn.textContent;
            loadBtn.disabled = true;
            loadBtn.textContent = "⏳ Loading Data...";

            try {

                await clearAllData();

                const sampleActivities =
                    typeof getSample3DaysActivities === "function"
                        ? getSample3DaysActivities()
                        : [];

                for (const item of sampleActivities) {
                    await addActivity(item);
                }

                await loadDashboard();

                alert("🌱 3-day sample data loaded successfully!\n\n• Day 1: 3.56 kg CO₂e (🟢 Green Signal)\n• Day 2: 20.41 kg CO₂e (🔴 Red Signal)\n• Day 3: 4.73 kg CO₂e (🟢 Green Signal)");

            } catch (err) {

                console.error("Failed to load sample data:", err);
                alert("Could not load sample data. Check console for details.");

            } finally {

                loadBtn.disabled = false;
                loadBtn.textContent = originalText;

            }

        });

    }

    if (resetBtn) {

        resetBtn.addEventListener("click", async () => {

            if (confirm("Are you sure you want to clear all activities?")) {

                await clearAllData();
                await loadDashboard();

            }

        });

    }

}


// ========================================
// MAIN LOAD DASHBOARD
// ========================================

async function loadDashboard() {

    const activities = await getActivities();

    const analysis = analyzeDailyData(activities);

    updateSignalBanner(activities, analysis);

    updateDashboardSummary(activities, analysis);

    update3DayAnalysis(activities, analysis);

    updateCategoryBreakdown(activities);

    updateRecentActivities(activities);

}


// ========================================
// MULTI-DAY DATA ANALYSIS ENGINE
// ========================================

function analyzeDailyData(activities) {

    if (!activities || activities.length === 0) {

        return {
            days: [],
            totalEmission: 0,
            avgEmission: 0,
            greenDays: 0,
            redDays: 0,
            amberDays: 0,
            categoryTotals: { Transport: 0, Food: 0, Shopping: 0, Other: 0 },
            latestDay: null,
            peakDay: null,
            lowestDay: null
        };

    }

    // Group activities by date (YYYY-MM-DD)
    const grouped = {};

    activities.forEach(activity => {

        const dateStr =
            activity.date ||
            (activity.createdAt ? activity.createdAt.slice(0, 10) : "Unknown");

        if (!grouped[dateStr]) {

            grouped[dateStr] = [];

        }

        grouped[dateStr].push(activity);

    });

    // Sort dates ascending (oldest to newest: Day 1, Day 2, Day 3)
    const sortedDates = Object.keys(grouped).sort();

    const categoryTotals = { Transport: 0, Food: 0, Shopping: 0, Other: 0 };
    let greenCount = 0;
    let redCount = 0;
    let amberCount = 0;

    const days = sortedDates.map((dateStr, index) => {

        const dayActivities = grouped[dateStr];

        const dayTotal = dayActivities.reduce((sum, act) => {
            return sum + Number(act.emission || 0);
        }, 0);

        const dayCategories = { Transport: 0, Food: 0, Shopping: 0, Other: 0 };

        let topActivity = null;
        let topEmission = -1;

        dayActivities.forEach(act => {

            const cat = act.category || "Other";
            const em = Number(act.emission || 0);

            if (dayCategories[cat] !== undefined) {
                dayCategories[cat] += em;
                categoryTotals[cat] += em;
            } else {
                dayCategories.Other += em;
                categoryTotals.Other += em;
            }

            if (em > topEmission) {
                topEmission = em;
                topActivity = act;
            }

        });

        // Determine Traffic Light Signal
        // <= 6.00 kg: GREEN SIGNAL (Eco Safe)
        // > 10.00 kg: RED SIGNAL (High Alert)
        // 6.01 - 10.00 kg: AMBER SIGNAL (Moderate)
        let signalType = "green";
        let signalLabel = "GREEN SIGNAL";
        let signalSub = "ECO SAFE";
        let deltaText = "";
        let note = "";

        if (dayTotal <= DAILY_BUDGET_KG) {

            signalType = "green";
            signalLabel = "GREEN SIGNAL";
            signalSub = "ECO SAFE";
            const under = (DAILY_BUDGET_KG - dayTotal).toFixed(2);
            deltaText = `▼ ${under} kg below budget`;
            note = "Eco-conscious day: Sustainable transit & lower footprint meals kept emissions well within planetary target.";
            greenCount++;

        } else if (dayTotal > 10.00) {

            signalType = "red";
            signalLabel = "RED SIGNAL";
            signalSub = "HIGH ALERT";
            const over = (dayTotal - DAILY_BUDGET_KG).toFixed(2);
            deltaText = `▲ +${over} kg OVER BUDGET`;
            note = `High emission alert: Driven by ${topActivity ? topActivity.activityType : 'energy consumption'}. Exceeded target by +${Math.round((dayTotal / DAILY_BUDGET_KG - 1) * 100)}%.`;
            redCount++;

        } else {

            signalType = "amber";
            signalLabel = "AMBER SIGNAL";
            signalSub = "MODERATE";
            const over = (dayTotal - DAILY_BUDGET_KG).toFixed(2);
            deltaText = `▲ +${over} kg over eco budget`;
            note = "Moderate impact: Slightly exceeds daily target. Check transit and dietary options for quick savings.";
            amberCount++;

        }

        return {
            index: index + 1,
            dateStr: dateStr,
            dateObj: new Date(dateStr + "T00:00:00"),
            total: dayTotal,
            count: dayActivities.length,
            activities: dayActivities,
            categories: dayCategories,
            topActivity: topActivity,
            signal: {
                type: signalType,
                label: signalLabel,
                sub: signalSub,
                deltaText: deltaText,
                note: note
            }
        };

    });

    const totalEmission = activities.reduce((sum, act) => sum + Number(act.emission || 0), 0);
    const avgEmission = days.length > 0 ? totalEmission / days.length : 0;

    let peakDay = days[0] || null;
    let lowestDay = days[0] || null;

    days.forEach(d => {
        if (d.total > (peakDay ? peakDay.total : -1)) peakDay = d;
        if (d.total < (lowestDay ? lowestDay.total : Infinity)) lowestDay = d;
    });

    // The most recent recorded day
    const latestDay = days.length > 0 ? days[days.length - 1] : null;

    return {
        days: days,
        totalEmission: totalEmission,
        avgEmission: avgEmission,
        greenDays: greenCount,
        redDays: redCount,
        amberDays: amberCount,
        categoryTotals: categoryTotals,
        latestDay: latestDay,
        peakDay: peakDay,
        lowestDay: lowestDay
    };

}


// ========================================
// PROMINENT SIGNAL BANNER (TRAFFIC LIGHT)
// ========================================

function updateSignalBanner(activities, analysis) {

    const banner = document.getElementById("signalBanner");
    const light = document.getElementById("signalLight");
    const pill = document.getElementById("signalPill");
    const sub = document.getElementById("signalBadgeSub");
    const headline = document.getElementById("signalHeadline");
    const detail = document.getElementById("signalDetail");
    const meterFill = document.getElementById("signalMeterFill");
    const meterText = document.getElementById("signalMeterText");

    if (!banner || !light || !pill) return;

    if (!activities || activities.length === 0 || !analysis.latestDay) {

        banner.className = "signal-banner state-green";
        light.className = "signal-light green";
        pill.className = "signal-pill green";
        pill.textContent = "🟢 READY TO TRACK";
        sub.textContent = "TARGET ≤ 6.00 kg/day";
        headline.textContent = "No Activities Recorded Yet";
        detail.textContent = "Click '🌱 Load 3-Day Fake Data' above to preview live analysis and green/red signal lights, or record an activity.";
        if (meterFill) {
            meterFill.className = "signal-meter-fill green";
            meterFill.style.width = "0%";
        }
        if (meterText) meterText.textContent = "0.00 / 6.00 kg CO₂e";
        return;

    }

    const currentDay = analysis.latestDay;
    const signal = currentDay.signal;
    const emissionVal = currentDay.total;

    // Set classes based on signal
    banner.className = `signal-banner state-${signal.type}`;
    light.className = `signal-light ${signal.type}`;
    pill.className = `signal-pill ${signal.type}`;

    if (signal.type === "green") {

        pill.textContent = "🟢 GREEN SIGNAL";
        sub.textContent = `ECO SAFE · TARGET ≤ ${DAILY_BUDGET_KG.toFixed(2)} kg/day`;
        headline.textContent = `On Track: Latest Daily Footprint is ${emissionVal.toFixed(2)} kg CO₂e`;
        const pctBelow = Math.round((1 - emissionVal / DAILY_BUDGET_KG) * 100);
        detail.textContent = `Healthy emissions! Your footprint is ${pctBelow}% below the sustainable daily budget of ${DAILY_BUDGET_KG.toFixed(2)} kg CO₂e. Overall: ${analysis.greenDays} of ${analysis.days.length} days achieved Green Signals.`;

        if (meterFill) {
            meterFill.className = "signal-meter-fill green";
            const pct = Math.min(100, Math.max(12, Math.round((emissionVal / DAILY_BUDGET_KG) * 100)));
            meterFill.style.width = `${pct}%`;
        }

    } else if (signal.type === "red") {

        pill.textContent = "🔴 RED SIGNAL";
        sub.textContent = `HIGH ALERT · EXCEEDS 10.00 kg/day`;
        headline.textContent = `High Emission Alert: Daily Footprint reached ${emissionVal.toFixed(2)} kg CO₂e`;
        const pctAbove = Math.round((emissionVal / DAILY_BUDGET_KG - 1) * 100);
        detail.textContent = `Action required: Emissions surged +${pctAbove}% above the daily eco budget. Top contributor: ${currentDay.topActivity ? currentDay.topActivity.activityType : 'energy consumption'}.`;

        if (meterFill) {
            meterFill.className = "signal-meter-fill red";
            meterFill.style.width = "100%";
        }

    } else {

        pill.textContent = "🟡 AMBER SIGNAL";
        sub.textContent = `MODERATE IMPACT · TARGET ≤ ${DAILY_BUDGET_KG.toFixed(2)} kg/day`;
        headline.textContent = `Moderate Footprint: Daily Total is ${emissionVal.toFixed(2)} kg CO₂e`;
        detail.textContent = `Approaching upper threshold limit. Minor transit or energy adjustments will bring your status back to Green.`;

        if (meterFill) {
            meterFill.className = "signal-meter-fill amber";
            const pct = Math.min(100, Math.round((emissionVal / DAILY_BUDGET_KG) * 100));
            meterFill.style.width = `${pct}%`;
        }

    }

    if (meterText) {
        meterText.textContent = `${emissionVal.toFixed(2)} / ${DAILY_BUDGET_KG.toFixed(2)} kg CO₂e`;
    }

}


// ========================================
// SUMMARY METRICS
// ========================================

function updateDashboardSummary(activities, analysis) {

    setText("totalEmission", analysis.totalEmission.toFixed(2));
    setText("activityCount", activities.length);

    // Biggest Contributor
    let biggestCategory = "—";
    let biggestValue = 0;

    Object.keys(analysis.categoryTotals).forEach(category => {
        if (analysis.categoryTotals[category] > biggestValue) {
            biggestValue = analysis.categoryTotals[category];
            biggestCategory = category;
        }
    });

    setText("biggestContributor", biggestCategory);

    // Signal Performance
    const perfElem = document.getElementById("signalPerformance");
    const perfDesc = document.getElementById("signalPerformanceDesc");

    if (analysis.days.length > 0) {

        if (perfElem) {
            perfElem.textContent = `${analysis.greenDays} / ${analysis.days.length} Days`;
        }

        if (perfDesc) {
            const greenPct = Math.round((analysis.greenDays / analysis.days.length) * 100);
            perfDesc.textContent = `${greenPct}% Green Signal rate (${analysis.redDays} Red alert)`;
        }

    } else {

        if (perfElem) perfElem.textContent = "—";
        if (perfDesc) perfDesc.textContent = "green vs red signal ratio";

    }

}


// ========================================
// 3-DAY CARBON ANALYSIS & DAILY SIGNALS
// ========================================

function update3DayAnalysis(activities, analysis) {

    const grid = document.getElementById("dailySignalsGrid");
    const insightsList = document.getElementById("insightsList");
    const dateRangeBadge = document.getElementById("analysisDateRange");

    if (!grid || !insightsList) return;

    if (!activities || activities.length === 0 || analysis.days.length === 0) {

        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; background: var(--surface); border-radius: 16px; padding: 40px 20px; border: 1.5px dashed var(--border);">
                <div class="empty-icon">📊</div>
                <h3>No Daily Analysis Available</h3>
                <p>Add activities or load sample data to explore multi-day trends and green/red signals.</p>
                <button type="button" class="btn btn-secondary" onclick="document.getElementById('loadSampleDataBtn').click()" style="margin-top: 15px;">
                    🌱 Load 3-Day Fake Data
                </button>
            </div>
        `;

        insightsList.innerHTML = `
            <div class="insight-item" style="grid-column: 1 / -1; text-align: center; color: var(--text-light); padding: 25px;">
                Insight recommendations will appear once activities are logged.
            </div>
        `;

        setText("insightsTotal", "0 kg");
        setText("insightsAvg", "0 kg/day");
        setText("insightsGreenDays", "0 / 0");
        setText("insightsRedDays", "0 / 0");

        return;

    }

    // Update Date Range Badge
    if (dateRangeBadge && analysis.days.length > 0) {
        const first = analysis.days[0].dateObj;
        const last = analysis.days[analysis.days.length - 1].dateObj;

        const opt = { month: "short", day: "numeric" };
        const d1 = first.toLocaleDateString("en-IN", opt);
        const d2 = last.toLocaleDateString("en-IN", opt);

        dateRangeBadge.textContent = d1 === d2 ? d1 : `${d1} – ${d2}`;
    }

    // Render Daily Cards (up to 3 recent days)
    const displayDays = analysis.days.slice(-3);

    grid.innerHTML = displayDays.map((day, idx) => {

        const dayNum = idx + 1;
        const dateFormatted = day.dateObj.toLocaleDateString("en-IN", {
            weekday: "short",
            month: "short",
            day: "numeric"
        });

        // Category Mini-Bar Percentages
        const dayTot = day.total > 0 ? day.total : 1;
        const pTrans = ((day.categories.Transport || 0) / dayTot * 100).toFixed(1);
        const pFood = ((day.categories.Food || 0) / dayTot * 100).toFixed(1);
        const pShop = ((day.categories.Shopping || 0) / dayTot * 100).toFixed(1);
        const pOther = ((day.categories.Other || 0) / dayTot * 100).toFixed(1);

        const deltaClass = day.signal.type;

        return `
            <div class="daily-signal-card card-${day.signal.type}">

                <div class="daily-card-header">
                    <div>
                        <span class="daily-day-label">Day ${dayNum}</span>
                        <strong class="daily-date-val">${escapeDashboardHtml(dateFormatted)}</strong>
                    </div>
                    <span class="signal-pill ${day.signal.type}">
                        ${day.signal.type === 'green' ? '🟢' : (day.signal.type === 'red' ? '🔴' : '🟡')}
                        ${day.signal.label}
                    </span>
                </div>

                <div class="daily-card-emission">
                    <div class="daily-emission-num">
                        ${day.total.toFixed(2)}
                        <small>kg CO₂e</small>
                    </div>
                    <span class="daily-delta-badge ${deltaClass}">
                        ${escapeDashboardHtml(day.signal.deltaText)}
                    </span>
                </div>

                <!-- MINI CATEGORY BREAKDOWN BAR -->
                <div class="category-mini-bar" title="Transport: ${pTrans}%, Food: ${pFood}%, Shopping: ${pShop}%, Other: ${pOther}%">
                    <div class="mini-bar-seg transport" style="width: ${pTrans}%;"></div>
                    <div class="mini-bar-seg food" style="width: ${pFood}%;"></div>
                    <div class="mini-bar-seg shopping" style="width: ${pShop}%;"></div>
                    <div class="mini-bar-seg other" style="width: ${pOther}%;"></div>
                </div>

                <div class="daily-meta-list">
                    <div class="daily-meta-row">
                        <span>Activities Logged:</span>
                        <strong>${day.count} activities</strong>
                    </div>
                    <div class="daily-meta-row">
                        <span>Peak Contributor:</span>
                        <strong>${day.topActivity ? escapeDashboardHtml(day.topActivity.activityType) + ' (' + day.topActivity.emission.toFixed(2) + ' kg)' : '—'}</strong>
                    </div>
                </div>

                <div class="daily-note">
                    ${escapeDashboardHtml(day.signal.note)}
                </div>

            </div>
        `;

    }).join("");

    // Update Analysis Summary Stats
    setText("insightsTotal", `${analysis.totalEmission.toFixed(2)} kg`);
    setText("insightsAvg", `${analysis.avgEmission.toFixed(2)} kg/day`);

    const greenRatio = `${analysis.greenDays} / ${analysis.days.length} (${Math.round((analysis.greenDays / analysis.days.length) * 100)}%)`;
    const redRatio = `${analysis.redDays} / ${analysis.days.length} (${Math.round((analysis.redDays / analysis.days.length) * 100)}%)`;

    setText("insightsGreenDays", greenRatio);
    setText("insightsRedDays", redRatio);

    // Generate Smart Analytical Insights
    const insights = [];

    // 1. Hotspot Category Analysis
    const total = analysis.totalEmission > 0 ? analysis.totalEmission : 1;
    const catEntries = Object.entries(analysis.categoryTotals).sort((a, b) => b[1] - a[1]);
    const topCat = catEntries[0];
    const topCatPct = Math.round((topCat[1] / total) * 100);

    insights.push(`
        <div class="insight-item insight-hotspot">
            <div class="insight-item-header">
                <span>🔥</span>
                <strong>Primary Hotspot: ${escapeDashboardHtml(topCat[0])} (${topCatPct}%)</strong>
            </div>
            <p class="insight-item-text">
                ${escapeDashboardHtml(topCat[0])} generated ${topCat[1].toFixed(2)} kg CO₂e out of your ${analysis.totalEmission.toFixed(2)} kg total footprint across the 3 days. Focusing reductions here will yield the fastest carbon improvements.
            </p>
        </div>
    `);

    // 2. Red Signal Spike Investigation
    if (analysis.peakDay && analysis.peakDay.total > DAILY_BUDGET_KG) {

        const peak = analysis.peakDay;
        const peakPct = Math.round((peak.total / total) * 100);

        insights.push(`
            <div class="insight-item insight-red-spike">
                <div class="insight-item-header">
                    <span>🚨</span>
                    <strong>Red Signal Alert on Day ${peak.index} (${peak.total.toFixed(2)} kg CO₂e)</strong>
                </div>
                <p class="insight-item-text">
                    Day ${peak.index} triggered a Red Signal, accounting for ${peakPct}% of your total 3-day footprint. The highest emitter was ${peak.topActivity ? escapeDashboardHtml(peak.topActivity.activityType) + ' (' + peak.topActivity.emission.toFixed(2) + ' kg)' : 'high energy consumption'}.
                </p>
            </div>
        `);

    }

    // 3. Green Signal Recovery / Sustainable Actions
    if (displayDays.length >= 2) {

        const d2 = displayDays[1];
        const d3 = displayDays[2] || null;

        if (d3 && d2.total > d3.total) {

            const dropPct = Math.round(((d2.total - d3.total) / d2.total) * 100);

            insights.push(`
                <div class="insight-item insight-green-recovery">
                    <div class="insight-item-header">
                        <span>🌱</span>
                        <strong>Green Signal Recovery: -${dropPct}% Emission Drop</strong>
                    </div>
                    <p class="insight-item-text">
                        Emissions dropped by ${dropPct}% from Day 2 (${d2.total.toFixed(2)} kg) to Day 3 (${d3.total.toFixed(2)} kg), returning your status safely to a Green Signal through public transport and balanced meal choices.
                    </p>
                </div>
            `);

        } else if (analysis.lowestDay) {

            insights.push(`
                <div class="insight-item insight-green-recovery">
                    <div class="insight-item-header">
                        <span>🌱</span>
                        <strong>Best Performance: Day ${analysis.lowestDay.index} (${analysis.lowestDay.total.toFixed(2)} kg)</strong>
                    </div>
                    <p class="insight-item-text">
                        Day ${analysis.lowestDay.index} achieved the lowest environmental impact, staying well under the ${DAILY_BUDGET_KG.toFixed(2)} kg limit with zero high-carbon vehicular travel.
                    </p>
                </div>
            `);

        }

    }

    // 4. Target Scorecard & Recommendations
    insights.push(`
        <div class="insight-item insight-target">
            <div class="insight-item-header">
                <span>🎯</span>
                <strong>Target Scorecard: ${Math.round((analysis.greenDays / analysis.days.length) * 100)}% Green Consistency</strong>
            </div>
            <p class="insight-item-text">
                ${analysis.greenDays} out of ${analysis.days.length} days met planetary sustainability guidelines. Keeping individual fossil car trips under 15 km and choosing plant-based meals 3 days a week will guarantee a permanent Green Signal.
            </p>
        </div>
    `);

    insightsList.innerHTML = insights.join("");

}


// ========================================
// CATEGORY DONUT CHART BREAKDOWN
// ========================================

function updateCategoryBreakdown(activities) {

    const totals = {
        Transport: 0,
        Food: 0,
        Shopping: 0,
        Other: 0
    };

    activities.forEach(activity => {
        const cat = activity.category || "Other";
        const val = Number(activity.emission || 0);
        if (totals[cat] !== undefined) {
            totals[cat] += val;
        } else {
            totals.Other += val;
        }
    });

    const total = Object.values(totals).reduce((sum, value) => sum + value, 0);

    setText("donutTotal", total.toFixed(2));
    setText("transportTotal", totals.Transport.toFixed(2) + " kg");
    setText("foodTotal", totals.Food.toFixed(2) + " kg");
    setText("shoppingTotal", totals.Shopping.toFixed(2) + " kg");
    setText("otherTotal", totals.Other.toFixed(2) + " kg");

    const donut = document.getElementById("donutChart");

    if (!donut) return;

    if (total === 0) {
        donut.style.background = "conic-gradient(#e5ece8 0deg 360deg)";
        return;
    }

    const transportDegrees = (totals.Transport / total) * 360;
    const foodDegrees = (totals.Food / total) * 360;
    const shoppingDegrees = (totals.Shopping / total) * 360;

    const transportEnd = transportDegrees;
    const foodEnd = transportEnd + foodDegrees;
    const shoppingEnd = foodEnd + shoppingDegrees;

    donut.style.background = `
        conic-gradient(
            var(--chart-transport) 0deg ${transportEnd}deg,
            var(--chart-food) ${transportEnd}deg ${foodEnd}deg,
            var(--chart-shopping) ${foodEnd}deg ${shoppingEnd}deg,
            var(--chart-other) ${shoppingEnd}deg 360deg
        )
    `;

}


// ========================================
// RECENT ACTIVITIES (WITH GREEN/RED SIGNALS)
// ========================================

function updateRecentActivities(activities) {

    const container = document.getElementById("recentActivities");

    if (!container) return;

    if (activities.length === 0) {

        container.innerHTML = `
            <div class="empty-dashboard">
                <span>🌱</span>
                <p>No activities recorded yet.</p>
                <a href="add-activity.html" class="btn btn-primary">
                    Add Activity
                </a>
            </div>
        `;

        return;

    }

    const recent = [...activities]
        .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
        .slice(0, 6);

    container.innerHTML = recent.map(activity => {

        const icon = getDashboardIcon(activity.category);
        const emission = Number(activity.emission || 0);

        // Mini Green/Red Signal Badge
        let badgeClass = "green";
        let badgeLabel = "🟢 Eco";

        if (emission > 3.0) {
            badgeClass = "red";
            badgeLabel = "🔴 High";
        } else if (emission > 1.5) {
            badgeClass = "amber";
            badgeLabel = "🟡 Mod";
        }

        const dateStr = activity.date
            ? new Date(activity.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short", day: "numeric" })
            : "Recent";

        return `
            <div class="recent-activity">

                <div class="recent-icon">
                    ${icon}
                </div>

                <div class="recent-info">
                    <strong>
                        ${escapeDashboardHtml(activity.activityType || "Activity")}
                    </strong>
                    <span>
                        ${escapeDashboardHtml(activity.category || "Other")} · ${escapeDashboardHtml(dateStr)}
                    </span>
                </div>

                <div class="recent-meta-right">
                    <strong class="recent-emission">
                        ${emission.toFixed(2)} kg
                    </strong>
                    <span class="activity-signal ${badgeClass}">
                        ${badgeLabel}
                    </span>
                </div>

            </div>
        `;

    }).join("");

}


// ========================================
// HELPERS
// ========================================

function setText(id, value) {

    const element = document.getElementById(id);

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