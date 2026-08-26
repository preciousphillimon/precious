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
   MOBILE NAV
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {

    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("active");

        const icon = menuBtn.querySelector("i");

        if (icon) {

            icon.classList.toggle(
                "fa-bars",
                !nav.classList.contains("active")
            );

            icon.classList.toggle(
                "fa-xmark",
                nav.classList.contains("active")
            );

        }

    });

}


document.querySelectorAll("#nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav?.classList.remove("active");

        const icon = menuBtn?.querySelector("i");

        if (icon) {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

});


/* =========================================================
   ACTIVE NAV ON SCROLL
========================================================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll("#nav a");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;

        if (window.scrollY >= sectionTop) {
            current = section.id;
        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================================================
   BACK TO TOP
========================================================= */

const topBtn =
    document.getElementById("topBtn");


if (topBtn) {

    window.addEventListener("scroll", () => {

        topBtn.classList.toggle(
            "show",
            window.scrollY > 400
        );

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

            const btn =
                contactForm.querySelector("button");

            if (!btn) return;

            const originalText =
                btn.innerHTML;


            btn.disabled = true;

            btn.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Sending...
            `;


            setTimeout(() => {

                btn.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Message Sent
                `;


                setTimeout(() => {

                    btn.innerHTML =
                        originalText;

                    btn.disabled = false;

                    contactForm.reset();

                }, 2000);

            }, 1500);

        }
    );

}


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL = "https://arqvyxwnkrhumvnstvgy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycXZ5eHdua3JodW12bnN0dmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2OTM0NzAsImV4cCI6MjEwMzI2OTQ3MH0.siCWKtTK312QP0tqOG1jxRSuCy93_jn7jwSYDFfM3MM";


/* =========================================================
   PORTFOLIO
========================================================= */

const portfolioGrid =
    document.getElementById("portfolioGrid");

let projects = [];


/* =========================================================
   PROJECT MODAL ELEMENTS
========================================================= */

const projectModal =
    document.getElementById("projectModal");

const modalClose =
    document.getElementById("modalClose");

const modalImage =
    document.getElementById("modalImage");

const modalTitle =
    document.getElementById("modalTitle");

const modalCategory =
    document.getElementById("modalCategory");

const modalDescription =
    document.getElementById("modalDescription");

const modalLink =
    document.getElementById("modalLink");

let currentProjectId = null;


/* =========================================================
   OPEN PROJECT MODAL
========================================================= */

function openProjectModal(project) {

    if (!projectModal || !project) {
        return;
    }


    currentProjectId =
        project.id;


    /* IMAGE */

    if (modalImage) {

        modalImage.src =
            project.image_url || "";

        modalImage.alt =
            project.title ||
            "Project";

    }


    /* TITLE */

    if (modalTitle) {

        modalTitle.textContent =
            project.title ||
            "Untitled Project";

    }


    /* CATEGORY */

    if (modalCategory) {

        modalCategory.textContent =
            project.category ||
            "Design";

    }


    /* DESCRIPTION */

    if (modalDescription) {

        modalDescription.textContent =
            project.description ||
            "A project from my creative portfolio.";

    }


    /* PROJECT LINK */

    if (modalLink) {

        const url =
            String(
                project.project_url || ""
            ).trim();


        if (url) {

            modalLink.href = url;

            modalLink.target = "_blank";

            modalLink.rel =
                "noopener noreferrer";

            modalLink.style.display =
                "inline-flex";

        } else {

            modalLink.removeAttribute("href");

            modalLink.style.display =
                "none";

        }

    }


    /* SHOW MODAL */

    projectModal.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   CLOSE PROJECT MODAL
========================================================= */

function closeProjectModal() {

    if (!projectModal) {
        return;
    }


    projectModal.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "modal-open"
    );


    currentProjectId = null;

}


/* =========================================================
   MODAL CLOSE BUTTON
========================================================= */

modalClose?.addEventListener(
    "click",
    closeProjectModal
);


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

projectModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            projectModal
        ) {

            closeProjectModal();

        }

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            projectModal?.classList.contains("active")
        ) {

            closeProjectModal();

        }

    }
);


/* =========================================================
   LOAD PROJECTS FROM SUPABASE
========================================================= */

async function loadProjects() {

    if (!portfolioGrid) {

        console.warn(
            "portfolioGrid not found."
        );

        return;

    }


    /* LOADING */

    portfolioGrid.innerHTML = `
        <div class="portfolio-loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>
                Loading projects...
            </p>

        </div>
    `;


    try {

        const response =
            await fetch(
                `${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`,
                {
                    method: "GET",

                    cache: "no-store",

                    headers: {

                        "apikey":
                            SUPABASE_KEY,

                        "Authorization":
                            `Bearer ${SUPABASE_KEY}`,

                        "Accept":
                            "application/json",

                        "Cache-Control":
                            "no-cache"

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


        const data =
            await response.json();


        projects =
            Array.isArray(data)
                ? data
                : [];


        console.log(
            "Projects loaded:",
            projects
        );


        renderProjects(projects);


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
                    Please refresh the page and try again.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   RENDER PROJECTS
========================================================= */

function renderProjects(projectList) {

    if (!portfolioGrid) {
        return;
    }


    /* NO PROJECTS */

    if (
        !Array.isArray(projectList) ||
        projectList.length === 0
    ) {

        portfolioGrid.innerHTML = `

            <div class="portfolio-empty">

                <i class="fa-solid fa-folder-open"></i>

                <h3>
                    No Projects Yet
                </h3>

                <p>
                    Projects will appear here.
                </p>

            </div>

        `;

        return;

    }


    /* CREATE CARDS */

    portfolioGrid.innerHTML =
        projectList.map(project => {

            const id =
                escapeAttribute(
                    String(project.id || "")
                );


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


            const categoryValue =
                escapeAttribute(
                    String(
                        project.category ||
                        ""
                    ).toLowerCase()
                );


            return `

                <article
                    class="portfolio-card"
                    data-project-id="${id}"
                    data-category="${categoryValue}"
                    tabindex="0"
                    role="button"
                    aria-label="View ${title}"
                >

                    <div class="portfolio-image">

                        <img
                            src="${image}"
                            alt="${title}"
                            loading="lazy"
                        >

                    </div>


                    <div class="overlay">

                        <span
                            class="portfolio-category"
                        >
                            ${category}
                        </span>


                        <h3>
                            ${title}
                        </h3>


                        <button
                            type="button"
                            class="project-preview-btn"
                        >

                            View Project

                            <i
                                class="fa-solid fa-arrow-right"
                            ></i>

                        </button>

                    </div>

                </article>

            `;

        }).join("");


    setupProjectCards();

    revealOnScroll();

}


/* =========================================================
   PROJECT CARD EVENTS
========================================================= */

function setupProjectCards() {

    if (!portfolioGrid) {
        return;
    }


    const cards =
        portfolioGrid.querySelectorAll(
            ".portfolio-card"
        );


    cards.forEach(card => {

        /* CLICK */

        card.addEventListener(
            "click",
            event => {

                /*
                 * Prevent unwanted behaviour
                 * when clicking inside the modal
                 * or other elements.
                 */

                event.preventDefault();


                const projectId =
                    card.dataset.projectId;


                if (!projectId) {
                    return;
                }


                const project =
                    projects.find(
                        item =>
                            String(item.id) ===
                            String(projectId)
                    );


                if (!project) {

                    console.warn(
                        "Project not found:",
                        projectId
                    );

                    return;

                }


                openProjectModal(
                    project
                );

            }
        );


        /* KEYBOARD */

        card.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {

                    return;

                }


                event.preventDefault();


                const projectId =
                    card.dataset.projectId;


                if (!projectId) {
                    return;
                }


                const project =
                    projects.find(
                        item =>
                            String(item.id) ===
                            String(projectId)
                    );


                if (project) {

                    openProjectModal(
                        project
                    );

                }

            }
        );

    });

}


/* =========================================================
   PORTFOLIO FILTERS
========================================================= */

function setupPortfolioFilters() {

    const filterBtns =
        document.querySelectorAll(
            ".portfolio-filter button"
        );


    filterBtns.forEach(button => {

        /*
         * onclick prevents duplicate
         * listeners after re-render.
         */

        button.onclick = () => {

            /* ACTIVE BUTTON */

            filterBtns.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            const filter =
                button.textContent
                    .trim()
                    .toLowerCase();


            /* ALL */

            if (
                filter === "all"
            ) {

                renderProjects(
                    projects
                );

                return;

            }


            /* FILTER PROJECTS */

            const filteredProjects =
                projects.filter(project => {

                    const category =
                        String(
                            project.category ||
                            ""
                        ).toLowerCase();


                    return category.includes(
                        filter
                    );

                });


            renderProjects(
                filteredProjects
            );

        };

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
   SCROLL REVEAL
========================================================= */

function revealOnScroll() {

    const elements =
        document.querySelectorAll(

            ".service-card, " +
            ".skill-card, " +
            ".process-card, " +
            ".portfolio-card, " +
            ".testimonial-card, " +
            ".about-image, " +
            ".about-content"

        );


    const triggerBottom =
        window.innerHeight * 0.85;


    elements.forEach(element => {

        const top =
            element.getBoundingClientRect().top;


        if (
            top < triggerBottom
        ) {

            element.classList.add(
                "show"
            );

        }

    });

}


window.addEventListener(
    "scroll",
    revealOnScroll
);


/* =========================================================
   HEADER SCROLL
========================================================= */

const header =
    document.getElementById("header");


window.addEventListener(
    "scroll",
    () => {

        if (!header) {
            return;
        }


        header.classList.toggle(
            "scrolled",
            window.scrollY > 80
        );

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Load the portfolio from Supabase.
         */

        loadProjects();


        /*
         * Setup filters immediately.
         * They will also be refreshed after
         * projects are rendered.
         */

        setupPortfolioFilters();


        revealOnScroll();

    }
);