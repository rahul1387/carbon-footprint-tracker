// ========================================
// LOCAL STORAGE
// ========================================

const STORAGE_KEYS = {

    ACTIVITIES: "cft_activities",

    GOALS: "cft_goals"

};


// ========================================
// ACTIVITIES
// ========================================

function getActivities() {

    const activities =
        localStorage.getItem(
            STORAGE_KEYS.ACTIVITIES
        );


    return activities
        ? JSON.parse(activities)
        : [];

}


function saveActivities(
    activities
) {

    localStorage.setItem(
        STORAGE_KEYS.ACTIVITIES,
        JSON.stringify(activities)
    );

}


function addActivity(
    activity
) {

    const activities =
        getActivities();


    activities.push(
        activity
    );


    saveActivities(
        activities
    );

}


function deleteActivity(
    activityId
) {

    const activities =
        getActivities();


    const filtered =
        activities.filter(
            activity =>
                activity.id !==
                activityId
        );


    saveActivities(
        filtered
    );

}


// ========================================
// GOALS
// ========================================

function getGoals() {

    const goals =
        localStorage.getItem(
            STORAGE_KEYS.GOALS
        );


    return goals
        ? JSON.parse(goals)
        : [];

}


function saveGoals(
    goals
) {

    localStorage.setItem(
        STORAGE_KEYS.GOALS,
        JSON.stringify(goals)
    );

}


// ========================================
// CLEAR DATA
// ========================================

function clearAllData() {

    localStorage.removeItem(
        STORAGE_KEYS.ACTIVITIES
    );

    localStorage.removeItem(
        STORAGE_KEYS.GOALS
    );

}