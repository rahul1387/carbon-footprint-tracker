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

    initializeSmoothLinks();

}


/* =========================================
   SMOOTH ANCHOR NAVIGATION
   ========================================= */

function initializeSmoothLinks() {

    const links =
        document.querySelectorAll('a[href^="#"]');


    links.forEach(link => {

        link.addEventListener("click", event => {

            const target =
                document.querySelector(
                    link.getAttribute("href")
                );


            if (!target) return;


            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        });

    });

}
