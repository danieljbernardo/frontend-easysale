let email = document.getElementById("email").value.trim();
let senha = document.getElementById("senha").value.trim();
const botao = document.getElementById("logarUsuario");

botao.addEventListener("click", async (event) => {
  event.preventDefault();

  const login = {
    email: email,
    senha: senha,
  };

  try {
    const response = await fetch("/easysale/usuario/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    });

    if (response.ok) {
      const dados = response.json();
      localStorage.setItem("token", dados.token);
      localStorage.setItem("role", dados.role);
      location.replace("../../html/home.html");
    } else {
      const mensagem = await response.text();
      alert(mensagem);
    }
  } catch (error) {
    console.error(error);
  }
});

document.querySelectorAll(".olho-senha").forEach((icone) => {
  icone.addEventListener("click", () => {
    const input = document.getElementById(icone.dataset.target);

    if (input.type === "password") {
      input.type = "text";
      icone.classList.replace("bi-eye-fill", "bi-eye-slash-fill");
    } else {
      input.type = "password";
      icone.classList.replace("bi-eye-slash-fill", "bi-eye-fill");
    }
  });
});
