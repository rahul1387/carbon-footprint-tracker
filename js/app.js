/* =========================================
   CARBON FOOTPRINT TRACKER
   MAIN APPLICATION
   ========================================= */


/* =========================================
   DOM READY
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();

});


/* =========================================
   NAVIGATION
   ========================================= */

function initializeNavigation() {

    const getStartedBtn =
        document.getElementById("getStartedBtn");

    const heroStartBtn =
        document.getElementById("heroStartBtn");

    const loginBtn =
        document.getElementById("loginBtn");

    const exploreBtn =
        document.getElementById("exploreBtn");


    /*
        Get Started
    */

    if (getStartedBtn) {

        getStartedBtn.addEventListener(
            "click",
            () => {

                showComingSoon(
                    "Account creation will be available in the next step."
                );

            }
        );

    }


    /*
        Hero Start Tracking
    */

    if (heroStartBtn) {

        heroStartBtn.addEventListener(
            "click",
            () => {

                showComingSoon(
                    "Activity tracking will be available in the next step."
                );

            }
        );

    }


    /*
        Login
    */

    if (loginBtn) {

        loginBtn.addEventListener(
            "click",
            () => {

                showComingSoon(
                    "Login will be available in the next step."
                );

            }
        );

    }


    /*
        Explore Dashboard
    */

    if (exploreBtn) {

        exploreBtn.addEventListener(
            "click",
            () => {

                document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }


    /*
        Navigation links
    */

    initializeSmoothLinks();

}


/* =========================================
   SMOOTH NAVIGATION
   ========================================= */
function initializeNavigation() {

    const heroStartBtn = document.getElementById("heroStartBtn");
    const exploreBtn = document.getElementById("exploreBtn");

    if (heroStartBtn) {
        heroStartBtn.addEventListener("click", () => {

            if (typeof isLoggedIn === "function" && isLoggedIn()) {
                window.location.href = "dashboard.html";
            } else {
                openAuth("signup");
            }

        });
    }

    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {

            document
                .getElementById("how-it-works")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        });
    }

    initializeSmoothLinks();
}


/* =========================================
   TEMPORARY MESSAGE
   ========================================= */

function showComingSoon(message) {

    alert(message);

}