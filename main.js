window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {
        loader.classList.add("hidden");
    }, 800);
});


/* ===========================
   MOBILE NAV TOGGLE
=========================== */

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}


/* ===========================
   CLOSE MENU ON LINK CLICK (MOBILE)
=========================== */

document.querySelectorAll("nav ul li a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });
});


/* ===========================
   ACTIVE NAV SCROLL SPY
=========================== */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});


/* ===========================
   BACK TO TOP BUTTON
=========================== */

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        topBtn.style.display = "block";
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


/* ===========================
   CONTACT FORM (FAKE SUBMIT UX)
=========================== */

const form = document.querySelector(".contact-form");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const btn = form.querySelector("button");

        const originalText = btn.innerHTML;
        btn.innerHTML = "Sending...";

        setTimeout(() => {
            btn.innerHTML = "Message Sent ✓";

            setTimeout(() => {
                btn.innerHTML = originalText;
                form.reset();
            }, 2000);

        }, 1500);
    });
}


/* ===========================
   PORTFOLIO FILTER (BASIC SYSTEM)
=========================== */

const filterBtns = document.querySelectorAll(".portfolio-filter button");
const portfolioCards = document.querySelectorAll(".portfolio-card");

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            // active button UI
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.textContent.toLowerCase();

            portfolioCards.forEach(card => {

                const category = card.querySelector("p").textContent.toLowerCase();

                if (filter === "all") {
                    card.style.display = "block";
                }
                else if (category.includes(filter)) {
                    card.style.display = "block";
                }
                else {
                    card.style.display = "none";
                }

            });

        });
    });
}


/* ===========================
   SCROLL REVEAL ANIMATION
=========================== */

const revealElements = document.querySelectorAll(
    ".service-card, .skill-card, .process-card, .portfolio-card, .testimonial-card, .about-image, .about-content"
);

const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;

    revealElements.forEach(el => {
        const top = el.getBoundingClientRect().top;

        if (top < triggerBottom) {
            el.classList.add("show");
        }
    });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();


/* ===========================
   NAV SHRINK ON SCROLL
=========================== */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
        header.style.padding = "12px 8%";
        header.style.background = "rgba(11,15,25,0.95)";
    } else {
        header.style.padding = "18px 8%";
        header.style.background = "rgba(11,15,25,0.8)";
    }
});


/* ===========================
   TYPING EFFECT (HERO NAME)
=========================== */

const heroTitle = document.querySelector(".hero h1");

if (heroTitle) {
    const text = heroTitle.innerText;
    heroTitle.innerText = "";

    let i = 0;

    const type = () => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 80);
        }
    };

    type();
}

const SUPABASE_URL = "https://bhzbvuqylfzvcogspbix.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoemJ2dXF5bGZ6dmNvZ3NwYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODQwOTcsImV4cCI6MjA5NzU2MDA5N30.NcJrl4DONWt_DQyWX_dR6IBt4pXz-10nqofHf1hMMAs";

async function loadProjects() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*`, {
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`
        }
    });

    const projects = await res.json();

    const grid = document.getElementById("portfolioGrid");

    grid.innerHTML = projects.map(p => `
        <div class="portfolio-card">
            <img src="${p.image_url}" alt="${p.title}">
            <div class="overlay">
                <h3>${p.title}</h3>
                <p>${p.category}</p>
                <a href="${p.project_url}" target="_blank">View Project</a>
            </div>
        </div>
    `).join("");
}

loadProjects();