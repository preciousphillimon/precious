const SUPABASE_URL = "https://arqvyxwnkrhumvnstvgy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycXZ5eHdua3JodW12bnN0dmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2OTM0NzAsImV4cCI6MjEwMzI2OTQ3MH0.siCWKtTK312QP0tqOG1jxRSuCy93_jn7jwSYDFfM3MM";

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const projectForm = document.getElementById("projectForm");

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("image");
const linkInput = document.getElementById("link");

let uploadedImageUrl = "";


/* ===========================
   OPEN FILE PICKER
=========================== */

dropZone.addEventListener("click", () => {
    fileInput.click();
});


/* ===========================
   DRAG OVER
=========================== */

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();

    dropZone.style.borderColor = "#00ff99";
});


/* ===========================
   DRAG LEAVE
=========================== */

dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "#00d084";
});


/* ===========================
   DROP IMAGE
=========================== */

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();

    dropZone.style.borderColor = "#00d084";

    const file = e.dataTransfer.files[0];

    uploadImage(file);
});


/* ===========================
   SELECT IMAGE
=========================== */

fileInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    uploadImage(file);

});


/* ===========================
   UPLOAD IMAGE
=========================== */

async function uploadImage(file) {

    if (!file) return;


    if (!file.type.startsWith("image/")) {
        alert("Please select an image.");
        return;
    }


    if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5MB.");
        return;
    }


    const extension = file.name.split(".").pop();

    const fileName =
        `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;


    dropZone.querySelector("p").textContent = "Uploading...";


    try {

        const response = await fetch(
            `${SUPABASE_URL}/storage/v1/object/project-images/${fileName}`,
            {
                method: "POST",

                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": file.type
                },

                body: file
            }
        );


        if (!response.ok) {

            const error = await response.text();

            console.error(error);

            throw new Error("Upload failed");

        }


        uploadedImageUrl =
            `${SUPABASE_URL}/storage/v1/object/public/project-images/${fileName}`;


        preview.src = uploadedImageUrl;

        preview.style.display = "block";


        imageInput.value = uploadedImageUrl;


        dropZone.querySelector("p").textContent =
            "Image uploaded successfully ✓";


    } catch (error) {

        console.error(error);

        alert("Image upload failed.");

        dropZone.querySelector("p").textContent =
            "Drag & Drop Image Here or Click";

    }

}


/* ===========================
   ADD PROJECT
=========================== */

projectForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    if (!titleInput.value.trim()) {

        alert("Please enter a project title.");

        return;

    }


    if (!uploadedImageUrl) {

        alert("Please upload an image first.");

        return;

    }


    const project = {

        title: titleInput.value.trim(),

        category: categoryInput.value.trim(),

        image_url: uploadedImageUrl,

        project_url: linkInput.value.trim() || "#"

    };


    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/projects`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                    Prefer: "return=representation"
                },

                body: JSON.stringify(project)
            }
        );


        if (!response.ok) {

            const error = await response.text();

            console.error(error);

            throw new Error("Database insert failed");

        }


        alert("Project added successfully!");


        projectForm.reset();

        preview.src = "";

        preview.style.display = "none";

        uploadedImageUrl = "";

        dropZone.querySelector("p").textContent =
            "Drag & Drop Image Here or Click";


    } catch (error) {

        console.error(error);

        alert("Error adding project.");

    }

});