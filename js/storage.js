// ========================================
// DATA LAYER
// ========================================
//
// Talks to the local Express + MongoDB backend
// at /api/activities.
//
// If the backend is not reachable (for example the
// pages are opened directly from disk, or the server
// is stopped) the layer transparently falls back to
// localStorage so the site keeps working.
//
// Any activities still stored in localStorage are
// automatically migrated into MongoDB the first time
// the site is loaded against the backend.
// ========================================


const STORAGE_KEYS = {

    ACTIVITIES: "cft_activities",

    GOALS: "cft_goals"   // legacy key, cleared on migration

};


// API is only usable when served over http(s)
const API_ENABLED =
    window.location.protocol === "http:" ||
    window.location.protocol === "https:";


const API_TIMEOUT_MS = 5000;


// Resolved once the startup migration finished
let dataLayerReady = null;


// ========================================
// API REQUEST
// ========================================

async function apiRequest(path, options = {}) {

    const controller = new AbortController();

    const timeout =
        setTimeout(() => controller.abort(), API_TIMEOUT_MS);


    try {

        const response = await fetch(
            path,
            {
                ...options,
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {})
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                `API ${response.status} for ${path}`
            );

        }


        return await response.json();

    } finally {

        clearTimeout(timeout);

    }

}


// ========================================
// API AVAILABILITY (cached per page load)
// ========================================

let apiAvailable = null;


async function isApiAvailable() {

    if (!API_ENABLED) {

        return false;

    }


    if (apiAvailable !== null) {

        return apiAvailable;

    }


    try {

        const health =
            await apiRequest("/api/health");

        apiAvailable = health.ok === true;

    } catch (error) {

        apiAvailable = false;

    }


    return apiAvailable;

}


// ========================================
// LOCAL FALLBACK HELPERS
// ========================================

function readLocalActivities() {

    const stored =
        localStorage.getItem(
            STORAGE_KEYS.ACTIVITIES
        );


    if (!stored) {

        return [];

    }


    try {

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed) ? parsed : [];

    } catch (error) {

        return [];

    }

}


function writeLocalActivities(activities) {

    localStorage.setItem(
        STORAGE_KEYS.ACTIVITIES,
        JSON.stringify(activities)
    );

}


// ========================================
// MIGRATION
// ========================================

async function migrateLocalActivities() {

    const pending =
        readLocalActivities();


    // Nothing to migrate - also clear the
    // legacy goals key left by older versions
    if (pending.length === 0) {

        localStorage.removeItem(
            STORAGE_KEYS.GOALS
        );

        return;

    }


    if (!(await isApiAvailable())) {

        // Offline: keep the data in localStorage
        return;

    }


    let migrated = 0;


    for (const activity of pending) {

        try {

            // Upsert on the server, so retries are safe
            await apiRequest(
                "/api/activities",
                {
                    method: "POST",
                    body: JSON.stringify(activity)
                }
            );

            migrated += 1;

        } catch (error) {

            console.warn(
                "Migration stopped:",
                error.message
            );

            // Keep the remaining items in localStorage
            return;

        }

    }


    if (migrated === pending.length) {

        localStorage.removeItem(
            STORAGE_KEYS.ACTIVITIES
        );

        localStorage.removeItem(
            STORAGE_KEYS.GOALS
        );

        console.info(
            `Migrated ${migrated} activities to MongoDB.`
        );

    }

}


// Runs once when this file loads
dataLayerReady = migrateLocalActivities();


// ========================================
// ACTIVITIES
// ========================================

async function getActivities() {

    await dataLayerReady;


    if (await isApiAvailable()) {

        try {

            return await apiRequest(
                "/api/activities"
            );

        } catch (error) {

            console.warn(
                "Using localStorage fallback:",
                error.message
            );

        }

    }


    return readLocalActivities();

}


async function saveActivities(activities) {

    await dataLayerReady;


    if (await isApiAvailable()) {

        try {

            for (const activity of activities) {

                await apiRequest(
                    "/api/activities",
                    {
                        method: "POST",
                        body: JSON.stringify(activity)
                    }
                );

            }

            return;

        } catch (error) {

            console.warn(
                "Using localStorage fallback:",
                error.message
            );

        }

    }


    writeLocalActivities(activities);

}


async function addActivity(activity) {

    await dataLayerReady;


    if (await isApiAvailable()) {

        try {

            await apiRequest(
                "/api/activities",
                {
                    method: "POST",
                    body: JSON.stringify(activity)
                }
            );

            return;

        } catch (error) {

            console.warn(
                "Using localStorage fallback:",
                error.message
            );

        }

    }


    const activities =
        readLocalActivities();


    activities.push(activity);


    writeLocalActivities(activities);

}


async function deleteActivity(activityId) {

    await dataLayerReady;


    if (await isApiAvailable()) {

        try {

            await apiRequest(
                `/api/activities/${encodeURIComponent(activityId)}`,
                { method: "DELETE" }
            );

            return;

        } catch (error) {

            console.warn(
                "Using localStorage fallback:",
                error.message
            );

        }

    }


    const activities =
        readLocalActivities();


    const filtered =
        activities.filter(
            activity => activity.id !== activityId
        );


    writeLocalActivities(filtered);

}


// ========================================
// CLEAR DATA
// ========================================

async function clearAllData() {

    await dataLayerReady;


    if (await isApiAvailable()) {

        try {

            await apiRequest(
                "/api/activities",
                { method: "DELETE" }
            );

        } catch (error) {

            console.warn(
                "Could not clear server data:",
                error.message
            );

        }

    }


    localStorage.removeItem(
        STORAGE_KEYS.ACTIVITIES
    );

    localStorage.removeItem(
        STORAGE_KEYS.GOALS
    );

}
