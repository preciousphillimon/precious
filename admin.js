const SUPABASE_URL = "https://bhzbvuqylfzvcogspbix.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoemJ2dXF5bGZ6dmNvZ3NwYml4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODQwOTcsImV4cCI6MjA5NzU2MDA5N30.NcJrl4DONWt_DQyWX_dR6IBt4pXz-10nqofHf1hMMAs";

document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const project = {
        title: title.value,
        category: category.value,
        image_url: image.value,
        project_url: link.value
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: "return=representation"
        },
        body: JSON.stringify(project)
    });

    if (res.ok) {
        alert("Project added!");
        document.getElementById("projectForm").reset();
    } else {
        alert("Error adding project");
    }
});

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_ANON_KEY";

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

let uploadedImageUrl = "";

// click to open file picker
dropZone.addEventListener("click", () => {
    fileInput.click();
});

// drag over
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#00ff99";
});

// drop file
dropZone.addEventListener("drop", async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
});

// file input change
fileInput.addEventListener("change", (e) => {
    handleUpload(e.target.files[0]);
});

async function handleUpload(file) {
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    // upload to Supabase Storage
    const { data, error } = await fetch(`${SUPABASE_URL}/storage/v1/object/project-images/${fileName}`, {
        method: "POST",
        headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": file.type
        },
        body: file
    });

    if (error) {
        alert("Upload failed");
        return;
    }

    // public URL
    uploadedImageUrl = `${SUPABASE_URL}/storage/v1/object/public/project-images/${fileName}`;

    preview.src = uploadedImageUrl;
    preview.style.display = "block";
}

// submit project
document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const project = {
        title: title.value,
        category: category.value,
        image_url: uploadedImageUrl,
        project_url: link.value
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: "return=representation"
        },
        body: JSON.stringify(project)
    });

    if (res.ok) {
        alert("Project added!");
        document.getElementById("projectForm").reset();
        preview.style.display = "none";
        uploadedImageUrl = "";
    } else {
        alert("Error adding project");
    }
});