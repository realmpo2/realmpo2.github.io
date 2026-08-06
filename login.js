// 1. Core Supabase Credentials
const SUPABASE_BASE_URL = "https://rrxxnrhjdfkkzkggyuby.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8otqa5vZveDxDRaVCV1wOg_i3A5sVPI"; // ⚠️ Replace this with your project's public anon key

// 2. Safe URL Param handling
const params = new URLSearchParams(window.location.search);
if (params.get("n")) {
  document.getElementById("app-need-account").textContent = params.get("n");
}

let page = 1;
let cAccDet = {};

function logIn() {}

// 3. Optimized Multi-Step Form Wizard
function createAccount() {
  if (page == 1) {
    document.getElementById("log-in-section").innerHTML = `
      <h1>1 - Create Account</h1>
      <input id="uname" placeholder="Username">*
      <input id="pword" placeholder="Password" type="password">*
      <input id="bday" placeholder="Birthday" type="date">*
      <button onclick="page = 2; createAccount()">Next</button>
      <br>Inputs marked with a * are required
    `;
  } else if (page == 2) {
    cAccDet.uname = document.getElementById("uname").value;
    cAccDet.pword = document.getElementById("pword").value;
    cAccDet.bday = document.getElementById("bday").value;
    document.getElementById("log-in-section").innerHTML = `
      <h1>2 - Personalization</h1>
      <input id="dname" placeholder="Display Name">*
      <input id="email" placeholder="Email Address" type="email">*
      <input id="names" placeholder="Firstname Middlename Lastname" type="email">
      <button onclick="page = 3; finishRegistration()">Finish & Sign Up</button>
      <br>Inputs marked with a * are required
    `;
  }
}

// 4. Complete Registration & Database Link Engine
async function finishRegistration() {
  // Capture the final inputs from step 2
  cAccDet.dname = document.getElementById("dname").value;
  cAccDet.email = document.getElementById("email").value;
  cAccDet.fname = document.getElementById("names").value.split(" ")[0];
  cAccDet.mname = document.getElementById("names").value.split(" ")[1];
  cAccDet.mname = document.getElementById("names").value.split(" ")[1];

  if (!cAccDet.dname || !cAccDet.email || !cAccDet.bday) {
    alert("Please fill out all required fields.");
    return;
  }

  document.getElementById("log-in-section").innerHTML = `<h1>Creating your profile... Please wait.</h1>`;

  try {

    // ---- STEP B: Map Data to Your Custom Meower-ProX_Accounts Columns ----
    const dbResponse = await fetch(`${SUPABASE_BASE_URL}/rest/v1/Meower-ProX_Accounts`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        username: cAccDet.uname,
        display_name: cAccDet.dname,
        bday: cAccDet.bday,
        email: cAccDet.email,
        fname: cAccDet.fname,
        mname: cAccDet.mname,
        lname: cAccDet.lname,
        // profile_picture, friends, and mpts will fallback to defaults automatically
      })
    });

    if (!dbResponse.ok) {
      const dbError = await dbResponse.json();
      throw new Error(dbError.message || "Failed to inject row into Meower-ProX_Accounts table.");
    }

    // Entire registration chain successfully resolved
    document.getElementById("log-in-section").innerHTML = `
      <h1>Account Initialized!</h1>
      <button onclick="if (params.get("n")) {window.location.replace(params.get("n"));}">Click to go back</button>
    `;

  } catch (error) {
    alert("Registration error: " + error.message);
    page = 1; 
    createAccount(); // Revert back safely to step 1
  }
}
