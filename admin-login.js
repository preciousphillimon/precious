/* =========================================================
   SUPABASE ADMIN LOGIN
========================================================= */

const SUPABASE_URL = "https://arqvyxwnkrhumvnstvgy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFycXZ5eHdua3JodW12bnN0dmd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2OTM0NzAsImV4cCI6MjEwMzI2OTQ3MH0.siCWKtTK312QP0tqOG1jxRSuCy93_jn7jwSYDFfM3MM";


/* =========================================================
   SUPABASE CLIENT
========================================================= */

if (!window.supabase) {

    console.error("Supabase library failed to load.");

} else {

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const loginButton =
        document.getElementById("loginButton");

    const loginMessage =
        document.getElementById("loginMessage");

    const togglePassword =
        document.getElementById("togglePassword");


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(message, type = "error") {

        if (!loginMessage) return;

        loginMessage.hidden = false;

        loginMessage.textContent = message;

        loginMessage.className =
            `login-message ${type}`;

    }


    function hideMessage() {

        if (!loginMessage) return;

        loginMessage.hidden = true;

        loginMessage.textContent = "";

    }


    /* =====================================================
       PASSWORD TOGGLE
    ===================================================== */

    togglePassword?.addEventListener(
        "click",
        () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type = "text";

                togglePassword.innerHTML =
                    `<i class="fa-solid fa-eye-slash"></i>`;

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type = "password";

                togglePassword.innerHTML =
                    `<i class="fa-solid fa-eye"></i>`;

                togglePassword.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );


    /* =====================================================
       LOGIN
    ===================================================== */

    loginForm?.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideMessage();


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            if (!email || !password) {

                showMessage(
                    "Please enter your email and password."
                );

                return;

            }


            /* BUTTON LOADING */

            const originalButton =
                loginButton.innerHTML;

            loginButton.disabled = true;

            loginButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Signing In...
            `;


            try {

                console.log(
                    "Attempting Supabase login..."
                );


                const {
                    data,
                    error
                } =
                    await supabaseClient.auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (error) {

                    console.error(
                        "Login error:",
                        error
                    );

                    showMessage(
                        error.message ||
                        "Invalid email or password."
                    );

                    return;

                }


                if (!data?.session) {

                    showMessage(
                        "Login failed. No session was created."
                    );

                    return;

                }


                console.log(
                    "Login successful."
                );


                showMessage(
                    "Login successful. Redirecting...",
                    "success"
                );


                /* REDIRECT TO ADMIN */

                setTimeout(() => {

                    window.location.href =
                        "admin.html";

                }, 700);


            } catch (error) {

                console.error(
                    "Unexpected login error:",
                    error
                );

                showMessage(
                    "Something went wrong. Please try again."
                );

            } finally {

                loginButton.disabled = false;

                loginButton.innerHTML =
                    originalButton;

            }

        }
    );


    /* =====================================================
       CHECK EXISTING SESSION
    ===================================================== */

    async function checkSession() {

        try {

            const {
                data
            } =
                await supabaseClient.auth
                    .getSession();


            if (data?.session) {

                console.log(
                    "Existing admin session found."
                );

                /*
                 * If already logged in,
                 * don't show the login page.
                 */

                window.location.href =
                    "admin.html";

            }

        } catch (error) {

            console.error(
                "Session check failed:",
                error
            );

        }

    }


    checkSession();

}