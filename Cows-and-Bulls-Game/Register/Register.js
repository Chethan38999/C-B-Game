document.getElementById("registrationForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
      alert("Password must be at least 8 characters long and contain at least one letter and one number.");
      return;
  }

  const data = {
      username: username,
      email: email,
      password: password
  };

  try {
      const response = await fetch("http://localhost:8080/users/register", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
      });

      if (response.ok) {
          alert("Registration successful!");
          window.location.href = "../Login/Login.html";
      } else {
          const contentType = response.headers.get("content-type");
          let errorMessage;
          
          if (contentType && contentType.includes("application/json")) {
              const errorData = await response.json();
              errorMessage = errorData.message;
          } else {
              errorMessage = await response.text();
          }
          
          alert(errorMessage);
      }
  } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
  }
});
