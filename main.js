/* =========================================================
   PRECIOUS PHILLIMON PORTFOLIO
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {
        loader.classList.add("hidden");
    }, 800);

});


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {

    menuBtn.addEventListener("click", () => {

        const isOpen = nav.classList.toggle("active");

        menuBtn.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });


    // Close menu when clicking a navigation link

    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("active");

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =========================================================
   ACTIVE NAVIGATION ON SCROLL
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");

function updateActiveNav() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;

        const sectionBottom =
            sectionTop + section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionBottom
        ) {

            currentSection = section.id;

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        const href =
            link.getAttribute("href");

        if (href === `#${currentSection}`) {

            link.classList.add("active");

        }

    });

}

window.addEventListener(
    "scroll",
    updateActiveNav
);

updateActiveNav();


/* =========================================================
   BACK TO TOP BUTTON
========================================================= */

const topBtn =
    document.getElementById("topBtn");

if (topBtn) {

    topBtn.style.display = "none";


    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {

            topBtn.style.display = "flex";

        } else {

            topBtn.style.display = "none";

        }

    });


    topBtn.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.querySelector(".contact-form");

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const button =
                contactForm.querySelector("button");

            if (!button) return;


            const originalHTML =
                button.innerHTML;


            button.disabled = true;

            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Sending...
            `;


            setTimeout(() => {

                button.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Message Sent
                `;


                setTimeout(() => {

                    button.innerHTML =
                        originalHTML;

                    button.disabled = false;

                    contactForm.reset();

                }, 2000);

            }, 1200);

        }
    );

}


/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL = "https://arqvyxwnkrhumvnstvgy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycXZ5eHdua3JodW12bnN0dmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2OTM0NzAsImV4cCI6MjEwMzI2OTQ3MH0.siCWKtTK312QP0tqOG1jxRSuCy93_jn7jwSYDFfM3MM";



/* =========================================================
   PORTFOLIO VARIABLES
========================================================= */

const portfolioGrid =
    document.getElementById("portfolioGrid");

const filterButtons =
    document.querySelectorAll(
        ".portfolio-filter button"
    );


let allProjects = [];


/* =========================================================
   LOAD PROJECTS FROM SUPABASE
========================================================= */

async function loadProjects() {

    if (!portfolioGrid) {

        console.warn(
            "Portfolio grid not found."
        );

        return;

    }


    portfolioGrid.innerHTML = `
        <div class="portfolio-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>Loading projects...</p>

        </div>
    `;


    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/projects?select=*`,
            {
                method: "GET",

                headers: {

                    "apikey": SUPABASE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`,

                    "Content-Type":
                        "application/json"

                }

            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Supabase error:",
                errorText
            );

            throw new Error(
                `Supabase returned ${response.status}`
            );

        }


        const projects =
            await response.json();


        if (!Array.isArray(projects)) {

            throw new Error(
                "Invalid projects response."
            );

        }


        allProjects = projects;


        console.log(
            "Projects loaded:",
            allProjects
        );


        renderProjects(
            allProjects
        );


        setupPortfolioFilters();


    } catch (error) {

        console.error(
            "Portfolio loading error:",
            error
        );


        portfolioGrid.innerHTML = `

            <div class="portfolio-error">

                <i class="fa-solid fa-circle-exclamation"></i>

                <h3>
                    Unable to load projects
                </h3>

                <p>
                    Please check your Supabase
                    connection and try again.
                </p>

                <button
                    type="button"
                    id="retryProjects">

                    <i class="fa-solid fa-rotate"></i>

                    Try Again

                </button>

            </div>

        `;


        const retryButton =
            document.getElementById(
                "retryProjects"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadProjects
            );

        }

    }

}


/* =========================================================
   RENDER PROJECTS
========================================================= */

function renderProjects(projects) {

    if (!portfolioGrid) return;


    if (!projects.length) {

        portfolioGrid.innerHTML = `

            <div class="portfolio-empty">

                <i class="fa-solid fa-folder-open"></i>

                <h3>
                    No Projects Yet
                </h3>

                <p>
                    Projects will appear here soon.
                </p>

            </div>

        `;

        return;

    }


    portfolioGrid.innerHTML =
        projects.map(project => {

            const title =
                escapeHTML(
                    project.title ||
                    "Untitled Project"
                );


            const category =
                escapeHTML(
                    project.category ||
                    "Design"
                );


            const image =
                escapeAttribute(
                    project.image_url ||
                    ""
                );


            const projectURL =
                escapeAttribute(
                    project.project_url ||
                    "#"
                );


            return `

                <article
                    class="portfolio-card"
                    data-category="${category.toLowerCase()}">

                    <img
                        src="${image}"
                        alt="${title}"
                        loading="lazy"
                        onerror="this.style.display='none';">

                    <div class="overlay">

                        <h3>
                            ${title}
                        </h3>

                        <p>
                            ${category}
                        </p>

                        ${
                            project.project_url &&
                            project.project_url !== "#"

                            ?

                            `
                            <a
                                href="${projectURL}"
                                target="_blank"
                                rel="noopener noreferrer">

                                View Project

                                <i class="fa-solid fa-arrow-up-right-from-square"></i>

                            </a>
                            `

                            :

                            ""
                        }

                    </div>

                </article>

            `;

        }).join("");


    initializePortfolioReveal();

}


/* =========================================================
   PORTFOLIO FILTERS
========================================================= */

function setupPortfolioFilters() {

    if (!filterButtons.length) return;


    filterButtons.forEach(button => {

        /*
           Prevent adding the same event
           listener multiple times.
        */

        if (button.dataset.listenerAdded) {
            return;
        }


        button.dataset.listenerAdded = "true";


        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                const filter =
                    (
                        button.dataset.filter ||
                        button.textContent
                    )
                    .toLowerCase()
                    .trim();


                if (
                    filter === "all"
                ) {

                    renderProjects(
                        allProjects
                    );

                    return;

                }


                const filteredProjects =
                    allProjects.filter(
                        project => {

                            const category =
                                String(
                                    project.category ||
                                    ""
                                )
                                .toLowerCase()
                                .trim();


                            return category.includes(
                                filter
                            );

                        }
                    );


                renderProjects(
                    filteredProjects
                );

            }
        );

    });

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

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


function escapeAttribute(value) {

    return escapeHTML(value);

}


/* =========================================================
   PORTFOLIO SCROLL REVEAL
========================================================= */

function initializePortfolioReveal() {

    const cards =
        document.querySelectorAll(
            ".portfolio-card"
        );


    const reveal = () => {

        const trigger =
            window.innerHeight * 0.88;


        cards.forEach(card => {

            const top =
                card.getBoundingClientRect()
                    .top;


            if (top < trigger) {

                card.classList.add(
                    "show"
                );

            }

        });

    };


    reveal();

}


/* =========================================================
   GENERAL SCROLL REVEAL
========================================================= */

const generalRevealElements =
    document.querySelectorAll(
        `
        .service-card,
        .skill-card,
        .process-card,
        .testimonial-card,
        .about-image,
        .about-content
        `
    );


function revealGeneralElements() {

    const trigger =
        window.innerHeight * 0.88;


    generalRevealElements.forEach(
        element => {

            const top =
                element
                    .getBoundingClientRect()
                    .top;


            if (top < trigger) {

                element.classList.add(
                    "show"
                );

            }

        }
    );

}


window.addEventListener(
    "scroll",
    revealGeneralElements
);

revealGeneralElements();


/* =========================================================
   HEADER SHRINK
========================================================= */

const header =
    document.getElementById("header");


if (header) {

    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 80
            ) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );

            }

        }
    );

}


/* =========================================================
   HERO NAME
========================================================= */

const heroName =
    document.querySelector(
        ".hero h1"
    );


if (heroName) {

    heroName.classList.add(
        "hero-name-visible"
    );

}


/* =========================================================
   START WEBSITE
========================================================= */

loadProjects();