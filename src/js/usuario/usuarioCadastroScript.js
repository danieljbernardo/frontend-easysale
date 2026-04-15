let nome = document.getElementById("nome").value.trim();
let cpf = document.getElementById("cpf");
let email = document.getElementById("email").value.trim();
let senha = document.getElementById("senha").value.trim();
let confirmarSenha = document.getElementById("confirmarSenha").value.trim();
let tipoUsuario = document.querySelector('input[name="tipoUsuario"]:checked');
const botao = document.getElementById("cadastrarUsuario");

botao.addEventListener("click", (event) => {
  event.preventDefault();

  if (nome === "" || nome.length < 3 || /^[a-zA-Z\s]+$/.test(nome) === false) {
    alert(
      "O nome deve conter ao menos 3 letras e não possuir números ou caracteres especiais.",
    );
  }
  if (cpf.value.trim() === "" || validarCPF(cpf.value) === false) {
    alert("CPF inválido, digite um CPF real.");
  }
  if (email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false) {
    alert("Email inválido, digite um email real.");
  }
  if (senha === "" || senha.length < 6) {
    alert("A senha deve conter ao menos 6 caracteres.");
  }
  if (confirmarSenha === "" || confirmarSenha !== senha) {
    alert("As senhas não coincidem.");
  }
  if (tipoUsuario === null) {
    alert("Selecione um tipo de usuário.");
  }

  const usuario = {
    nome: nome,
    cpf: cpf.value,
    email: email,
    senha: senha,
    role: tipoUsuario,
  };

  cadastrarUsuario(usuario);
});

async function cadastrarUsuario(usuario) {
  try {
    const response = await fetch("/easysale/autenticacao/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    if (response.ok) {
      window.location.href = "../../html/usuario/usuarioLogin.html";
    } else {
      const mensagem = await response.text();
      alert(mensagem);
    }
  } catch (error) {
    console.error(error);
  }
}

cpf.addEventListener("input", () => {
  cpf.value = cpf.value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
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

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;

  for (let i = 0; i < 9; i++) soma += cpf[i] * (10 - i);
  let d1 = (soma * 10) % 11;
  if (d1 == 10) d1 = 0;

  if (d1 != cpf[9]) return false;

  soma = 0;

  for (let i = 0; i < 10; i++) soma += cpf[i] * (11 - i);
  let d2 = (soma * 10) % 11;
  if (d2 == 10) d2 = 0;

  return d2 == cpf[10];
}
