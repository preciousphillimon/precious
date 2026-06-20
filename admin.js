const SUPABASE_URL = "bhzbvuqylfzvcogspbix";
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