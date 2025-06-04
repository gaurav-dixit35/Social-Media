// Show Login form and hide Sign Up
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginBtn").classList.add("active");
  document.getElementById("signupBtn").classList.remove("active");
}

// Show Sign Up form and hide Login
function showSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("signupBtn").classList.add("active");
  document.getElementById("loginBtn").classList.remove("active");
}

// On page load
window.onload = function () {
  showLogin();
};

// Handle Sign Up
function signup(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    alert("Username already exists.");
    return;
  }

  users.push({ firstName, lastName, username, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Sign up successful! You can now log in.");
  showLogin();
}

function login(event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const validUser = users.find(user => user.username === username && user.password === password);

  if (!validUser) {
    alert("Invalid username or password.");
    return;
  }

  // Save username for session use
  localStorage.setItem("username", username);

  // Redirect to homepage
  window.location.href = "index.html";
}

