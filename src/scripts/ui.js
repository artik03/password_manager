document.addEventListener("DOMContentLoaded", () => {
  fetchPasswords();

  document
    .getElementById("addPasswordForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      addPassword();
    });
});

function fetchPasswords() {
  fetch("/get-entries")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("passwordTableBody");
      tableBody.innerHTML = "";
      data.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${entry.name}</td>
          <td>
            <input type="password" value="${entry.password}" disabled id="password-${entry.name}" />
          </td>
          <td>
            <button onclick="showPassword('${entry.name}')">Show</button>
            <button onclick="copyPassword('${entry.name}')">Copy</button>
            <button onclick="deletePassword('${entry.name}')">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching passwords:", error));
}

function addPassword() {
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  fetch("/add-entry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  })
    .then((response) => {
      if (response.ok) {
        fetchPasswords();
        document.getElementById("addPasswordForm").reset();
      } else {
        console.error("Error adding password:", response.statusText);
      }
    })
    .catch((error) => console.error("Error adding password:", error));
}

function deletePassword(name) {
  fetch("/delete-entry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  })
    .then((response) => {
      if (response.ok) {
        fetchPasswords();
      } else {
        console.error("Error deleting password:", response.statusText);
      }
    })
    .catch((error) => console.error("Error deleting password:", error));
}

function showPassword(name) {
  const passwordField = document.getElementById(`password-${name}`);
  if (passwordField.type === "password") {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
}

function copyPassword(name) {
  const passwordField = document.getElementById(`password-${name}`);
  passwordField.disabled = false;
  passwordField.select();
  document.execCommand("copy");
  passwordField.disabled = true;
  alert("Password copied to clipboard");
}
