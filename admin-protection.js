/* =========================================================
   ADMIN AUTH PROTECTION
========================================================= */

const SUPABASE_URL = "https://arqvyxwnkrhumvnstvgy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycXZ5eHdua3JodW12bnN0dmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2OTM0NzAsImV4cCI6MjEwMzI2OTQ3MH0.siCWKtTK312QP0tqOG1jxRSuCy93_jn7jwSYDFfM3MM";


/* =========================================================
   SUPABASE CLIENT
========================================================= */

const {
    createClient
} = window.supabase;


const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================================================
   CHECK AUTH
========================================================= */

async function protectAdminPage() {

    try {

        const {
            data,
            error
        } =
            await supabase.auth.getSession();


        if (error) {

            console.error(
                "Authentication error:",
                error
            );

            window.location.replace(
                "admin-login.html"
            );

            return;

        }


        if (!data?.session) {

            window.location.replace(
                "admin-login.html"
            );

            return;

        }


        console.log(
            "Admin authenticated:",
            data.session.user.email
        );


    } catch (error) {

        console.error(
            "Admin protection error:",
            error
        );


        window.location.replace(
            "admin-login.html"
        );

    }

}


/* =========================================================
   AUTH STATE MONITOR
========================================================= */

supabase.auth.onAuthStateChange(
    (event, session) => {

        if (
            event === "SIGNED_OUT" ||
            !session
        ) {

            window.location.replace(
                "admin-login.html"
            );

        }

    }
);


/* =========================================================
   START PROTECTION
========================================================= */

protectAdminPage();