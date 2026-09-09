

/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL = "https://arqvyxwnkrhumvnstvgy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycXZ5eHdua3JodW12bnN0dmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2OTM0NzAsImV4cCI6MjEwMzI2OTQ3MH0.siCWKtTK312QP0tqOG1jxRSuCy93_jn7jwSYDFfM3MM";


/* =========================================================
   ELEMENTS
========================================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarToggle =
    document.getElementById("sidebarToggle");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const projectForm =
    document.getElementById("projectForm");

const dropZone =
    document.getElementById("dropZone");

const fileInput =
    document.getElementById("fileInput");

const previewContainer =
    document.getElementById("previewContainer");

const preview =
    document.getElementById("preview");

const removeImage =
    document.getElementById("removeImage");

const titleInput =
    document.getElementById("title");

const categoryInput =
    document.getElementById("category");

const linkInput =
    document.getElementById("link");

const imageInput =
    document.getElementById("image");

const submitProject =
    document.getElementById("submitProject");

const resetForm =
    document.getElementById("resetForm");

const formMessage =
    document.getElementById("formMessage");

const projectsList =
    document.getElementById("projectsList");

const projectSearch =
    document.getElementById("projectSearch");

const projectFilter =
    document.getElementById("projectFilter");


/* =========================================================
   DELETE MODAL ELEMENTS
========================================================= */

const deleteModal =
    document.getElementById("deleteModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");


/* =========================================================
   STATE
========================================================= */

let projects = [];

let uploadedImageUrl = "";

let projectToDelete = null;


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

    sidebar?.classList.add("active");

    sidebarOverlay?.classList.add("active");

}


function closeSidebar() {

    sidebar?.classList.remove("active");

    sidebarOverlay?.classList.remove("active");

}


sidebarToggle?.addEventListener(
    "click",
    () => {

        if (
            sidebar?.classList.contains("active")
        ) {

            closeSidebar();

        } else {

            openSidebar();

        }

    }
);


sidebarOverlay?.addEventListener(
    "click",
    closeSidebar
);


document
    .querySelectorAll(".nav-item")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".nav-item")
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });

                link.classList.add("active");

                closeSidebar();

            }
        );

    });


/* =========================================================
   IMAGE UPLOAD
========================================================= */

dropZone?.addEventListener(
    "click",
    () => {

        fileInput?.click();

    }
);


fileInput?.addEventListener(
    "change",
    event => {

        const file =
            event.target.files?.[0];

        if (file) {

            uploadImage(file);

        }

    }
);


dropZone?.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

        dropZone.classList.add(
            "dragging"
        );

    }
);


dropZone?.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove(
            "dragging"
        );

    }
);


dropZone?.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        dropZone.classList.remove(
            "dragging"
        );

        const file =
            event.dataTransfer.files?.[0];

        if (file) {

            uploadImage(file);

        }

    }
);


/* =========================================================
   UPLOAD IMAGE
========================================================= */

async function uploadImage(file) {

    if (
        !file ||
        !file.type.startsWith("image/")
    ) {

        showMessage(
            "Please select a valid image.",
            "error"
        );

        return;

    }


    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        showMessage(
            "Image must be smaller than 5MB.",
            "error"
        );

        return;

    }


    dropZone?.classList.add(
        "uploading"
    );


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${extension}`;


    try {

        const response =
            await fetch(

                `${SUPABASE_URL}/storage/v1/object/project-images/${fileName}`,

                {
                    method: "POST",

                    headers: {

                        apikey:
                            SUPABASE_KEY,

                        Authorization:
                            `Bearer ${SUPABASE_KEY}`,

                        "Content-Type":
                            file.type,

                        "x-upsert":
                            "false"

                    },

                    body: file

                }

            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Storage upload error:",
                errorText
            );

            throw new Error(
                "Image upload failed."
            );

        }


        uploadedImageUrl =
            `${SUPABASE_URL}/storage/v1/object/public/project-images/${fileName}`;


        if (imageInput) {

            imageInput.value =
                uploadedImageUrl;

        }


        if (preview) {

            preview.src =
                uploadedImageUrl;

        }


        if (previewContainer) {

            previewContainer.hidden =
                false;

        }


        dropZone?.classList.add(
            "uploaded"
        );


        showMessage(
            "Image uploaded successfully.",
            "success"
        );


    } catch (error) {

        console.error(
            "Image upload error:",
            error
        );


        showMessage(
            "Image upload failed. Check your Storage policies.",
            "error"
        );


    } finally {

        dropZone?.classList.remove(
            "uploading"
        );

    }

}


/* =========================================================
   REMOVE IMAGE
========================================================= */

removeImage?.addEventListener(
    "click",
    event => {

        event.preventDefault();

        event.stopPropagation();

        removeUploadedImage();

    }
);


function removeUploadedImage() {

    uploadedImageUrl = "";


    if (imageInput) {

        imageInput.value = "";

    }


    if (preview) {

        preview.src = "";

    }


    if (previewContainer) {

        previewContainer.hidden =
            true;

    }


    dropZone?.classList.remove(
        "uploaded"
    );


    if (fileInput) {

        fileInput.value = "";

    }

}


/* =========================================================
   ADD PROJECT
========================================================= */

projectForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const title =
            titleInput?.value.trim() || "";


        const category =
            categoryInput?.value.trim() || "";


        const projectUrl =
            linkInput?.value.trim() || "";


        const imageUrl =
            uploadedImageUrl ||
            imageInput?.value.trim() ||
            "";


        /* VALIDATION */

        if (!title) {

            showMessage(
                "Please enter a project title.",
                "error"
            );

            titleInput?.focus();

            return;

        }


        if (!category) {

            showMessage(
                "Please select a category.",
                "error"
            );

            categoryInput?.focus();

            return;

        }


        if (!imageUrl) {

            showMessage(
                "Please upload a project image.",
                "error"
            );

            return;

        }


        if (!submitProject) return;


        const originalButton =
            submitProject.innerHTML;


        submitProject.disabled =
            true;


        submitProject.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Adding Project...
        `;


        const project = {

            title:
                title,

            category:
                category,

            image_url:
                imageUrl,

            project_url:
                projectUrl || null,

            featured:
                false

        };


        try {

            const response =
                await fetch(

                    `${SUPABASE_URL}/rest/v1/projects`,

                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            apikey:
                                SUPABASE_KEY,

                            Authorization:
                                `Bearer ${SUPABASE_KEY}`,

                            Prefer:
                                "return=representation"

                        },

                        body:
                            JSON.stringify(project)

                    }

                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Supabase insert error:",
                    errorText
                );

                throw new Error(
                    "Project could not be added."
                );

            }


            showMessage(
                "Project added successfully!",
                "success"
            );


            resetProjectForm();


            await loadProjects();


        } catch (error) {

            console.error(
                "Add project error:",
                error
            );


            showMessage(
                "Could not add project.",
                "error"
            );


        } finally {

            submitProject.disabled =
                false;

            submitProject.innerHTML =
                originalButton;

        }

    }
);


/* =========================================================
   LOAD PROJECTS
========================================================= */

async function loadProjects() {

    if (!projectsList) {

        console.warn(
            "projectsList was not found."
        );

        return;

    }


    projectsList.innerHTML = `
        <div class="empty-projects">

            <div class="empty-icon">

                <i class="fa-solid fa-spinner fa-spin"></i>

            </div>

            <h3>
                Loading Projects...
            </h3>

            <p>
                Please wait.
            </p>

        </div>
    `;


    try {

        const response =
            await fetch(

                `${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`,

                {

                    method:
                        "GET",

                    cache:
                        "no-store",

                    headers: {

                        apikey:
                            SUPABASE_KEY,

                        Authorization:
                            `Bearer ${SUPABASE_KEY}`,

                        Accept:
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
                "Load projects error:",
                errorText
            );

            throw new Error(
                `Could not load projects: ${response.status}`
            );

        }


        const data =
            await response.json();


        projects =
            Array.isArray(data)
                ? data
                : [];


        updateDashboard();

        renderProjects();


    } catch (error) {

        console.error(
            "Project loading error:",
            error
        );


        projectsList.innerHTML = `

            <div class="empty-projects">

                <div class="empty-icon">

                    <i class="fa-solid fa-circle-exclamation"></i>

                </div>

                <h3>
                    Unable to Load Projects
                </h3>

                <p>
                    Check your Supabase connection
                    and RLS policies.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   DASHBOARD STATISTICS
========================================================= */

function updateDashboard() {

    const total =
        projects.length;


    const design =
        projects.filter(
            project =>
                String(
                    project.category || ""
                ).toLowerCase() === "design"
        ).length;


    const video =
        projects.filter(
            project =>
                String(
                    project.category || ""
                ).toLowerCase() === "video"
        ).length;


    const featured =
        projects.filter(
            project =>
                project.featured === true
        ).length;


    const totalElement =
        document.getElementById(
            "totalProjects"
        );


    const designElement =
        document.getElementById(
            "designProjects"
        );


    const videoElement =
        document.getElementById(
            "videoProjects"
        );


    const featuredElement =
        document.getElementById(
            "featuredProjects"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (designElement) {

        designElement.textContent =
            design;

    }


    if (videoElement) {

        videoElement.textContent =
            video;

    }


    if (featuredElement) {

        featuredElement.textContent =
            featured;

    }

}


/* =========================================================
   RENDER PROJECTS
========================================================= */

function renderProjects() {

    if (!projectsList) return;


    const search =
        projectSearch?.value
            .trim()
            .toLowerCase() || "";


    const filter =
        projectFilter?.value
            ?.trim()
            .toLowerCase() || "all";


    const filtered =
        projects.filter(project => {

            const title =
                String(
                    project.title || ""
                ).toLowerCase();


            const category =
                String(
                    project.category || ""
                ).toLowerCase();


            const matchesSearch =
                title.includes(search) ||
                category.includes(search);


            const matchesCategory =
                filter === "all" ||
                category === filter;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    if (!filtered.length) {

        projectsList.innerHTML = `

            <div class="empty-projects">

                <div class="empty-icon">

                    <i class="fa-solid fa-folder-open"></i>

                </div>

                <h3>
                    No Projects Found
                </h3>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;

    }


    projectsList.innerHTML =
        filtered
            .map(createProjectCard)
            .join("");

}


/* =========================================================
   PROJECT CARD
========================================================= */

function createProjectCard(project) {

    const image =
        escapeHTML(
            project.image_url || ""
        );


    const title =
        escapeHTML(
            project.title ||
            "Untitled"
        );


    const category =
        escapeHTML(
            project.category ||
            "Other"
        );


    const link =
        escapeHTML(
            project.project_url ||
            "#"
        );


    const projectId =
        escapeHTML(
            String(
                project.id
            )
        );


    return `

        <article
            class="admin-project-card"
            data-id="${projectId}"
        >

            <div class="project-image">

                <img
                    src="${image}"
                    alt="${title}"
                    loading="lazy"
                >

                <span class="project-category">
                    ${category}
                </span>

            </div>


            <div class="project-card-content">

                <h3>
                    ${title}
                </h3>


                <p>
                    ${category}
                </p>


                <div class="project-actions">

                    <a
                        href="${link}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-view"
                    >

                        <i class="fa-solid fa-eye"></i>

                        View

                    </a>


                    <button
                        type="button"
                        class="project-delete"
                        data-id="${projectId}"
                    >

                        <i class="fa-solid fa-trash"></i>

                        Delete

                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   OPEN DELETE MODAL
========================================================= */

projectsList?.addEventListener(
    "click",
    event => {

        const deleteButton =
            event.target.closest(
                ".project-delete"
            );


        if (!deleteButton) return;


        const projectId =
            deleteButton.dataset.id;


        if (!projectId) {

            console.error(
                "Delete button has no project ID."
            );

            return;

        }


        projectToDelete =
            projectId;


        if (!deleteModal) {

            console.error(
                "deleteModal was not found in admin.html."
            );

            return;

        }


        deleteModal.classList.add(
            "active"
        );


        deleteModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }
);


/* =========================================================
   CANCEL DELETE
========================================================= */

cancelDelete?.addEventListener(
    "click",
    () => {

        closeDeleteModal();

    }
);


/* =========================================================
   CLOSE DELETE MODAL
========================================================= */

function closeDeleteModal() {

    if (deleteModal) {

        deleteModal.classList.remove(
            "active"
        );


        deleteModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    projectToDelete =
        null;

}


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

deleteModal?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            deleteModal
        ) {

            closeDeleteModal();

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
            deleteModal?.classList.contains(
                "active"
            )
        ) {

            closeDeleteModal();

        }

    }
);


/* =========================================================
   CONFIRM DELETE
========================================================= */

confirmDelete?.addEventListener(
    "click",
    async () => {

        if (!projectToDelete) {

            return;

        }


        const id =
            projectToDelete;


        const originalButton =
            confirmDelete.innerHTML;


        confirmDelete.disabled =
            true;


        confirmDelete.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Deleting...
        `;


        try {

            const response =
                await fetch(

                    `${SUPABASE_URL}/rest/v1/projects?id=eq.${encodeURIComponent(id)}`,

                    {

                        method:
                            "DELETE",

                        headers: {

                            apikey:
                                SUPABASE_KEY,

                            Authorization:
                                `Bearer ${SUPABASE_KEY}`,

                            Prefer:
                                "return=representation"

                        }

                    }

                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Delete error:",
                    errorText
                );

                throw new Error(
                    `Delete failed: ${response.status}`
                );

            }


            /*
             * Check whether Supabase actually
             * deleted a row.
             */

            let deletedRows = [];


            try {

                deletedRows =
                    await response.json();

            } catch {

                deletedRows = [];

            }


            /*
             * If return=representation
             * returned zero rows, the DELETE
             * policy may be blocking the operation.
             */

            if (
                Array.isArray(
                    deletedRows
                ) &&
                deletedRows.length === 0
            ) {

                console.warn(
                    "Delete returned zero rows."
                );

            }


            /* REMOVE FROM LOCAL ARRAY */

            projects =
                projects.filter(
                    project =>
                        String(
                            project.id
                        ) !== String(id)
                );


            /* UPDATE DASHBOARD */

            updateDashboard();


            /* UPDATE PROJECT LIST */

            renderProjects();


            /* CLOSE MODAL */

            closeDeleteModal();


            /* SUCCESS */

            showMessage(
                "Project deleted successfully.",
                "success"
            );


        } catch (error) {

            console.error(
                "Delete project error:",
                error
            );


            showMessage(
                "Could not delete project. Check your Supabase DELETE policy.",
                "error"
            );


        } finally {

            confirmDelete.disabled =
                false;


            confirmDelete.innerHTML =
                originalButton;

        }

    }
);


/* =========================================================
   SEARCH
========================================================= */

projectSearch?.addEventListener(
    "input",
    () => {

        renderProjects();

    }
);


/* =========================================================
   CATEGORY FILTER
========================================================= */

projectFilter?.addEventListener(
    "change",
    () => {

        renderProjects();

    }
);


/* =========================================================
   RESET FORM
========================================================= */

resetForm?.addEventListener(
    "click",
    () => {

        setTimeout(
            () => {

                removeUploadedImage();

                hideMessage();

            },
            50
        );

    }
);


/* =========================================================
   RESET PROJECT FORM
========================================================= */

function resetProjectForm() {

    projectForm?.reset();

    removeUploadedImage();

}


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    message,
    type
) {

    if (!formMessage) return;


    formMessage.hidden =
        false;


    formMessage.textContent =
        message;


    formMessage.className =
        `form-message ${type}`;


    setTimeout(
        () => {

            hideMessage();

        },
        4000
    );

}


function hideMessage() {

    if (!formMessage) return;


    formMessage.hidden =
        true;


    formMessage.textContent =
        "";

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


/* =========================================================
   START ADMIN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProjects();

    }
);


/* =========================================================
   LOGOUT BTN
========================================================= */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", async () => {

    logoutBtn.disabled = true;

    try {
        await supabase.auth.signOut();
        window.location.href = "admin-login.html";
    } catch (error) {
        console.error("Logout error:", error);
        logoutBtn.disabled = false;
    }

});