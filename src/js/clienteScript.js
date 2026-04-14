const formPesquisa = document.getElementById("formPesquisa");
const formCliente = document.getElementById("formCliente");

const cpfInput = document.getElementById("pesquisa");

const nome = document.getElementById("nome");
const cpfCliente = document.getElementById("cpfCliente");
const telefone = document.getElementById("telefone");

const editarBtn = document.getElementById("editar");
const salvarBtn = document.getElementById("salvar");
const excluirBtn = document.getElementById("excluir");
const cancelarEdicaoBtn = document.getElementById("cancelarEdicaoCliente");

const nomeCadastro = document.getElementById("nomeCadastro");
const cpfCadastro = document.getElementById("cpfCadastro");
const telefoneCadastro = document.getElementById("telefoneCadastro");

const token = localStorage.getItem("token");

const formCadastrar = document.getElementById("formCadastrarCliente");

window.onload = function () {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    document.getElementById("cadastro").classList.add("sem-cadastro");
    editarBtn.style.display = "none";
    excluirBtn.style.display = "none";
  }
};

cpfInput.addEventListener("input", () => {
  cpfInput.value = formatarCPF(cpfInput.value);
});

cpfCliente.addEventListener("input", () => {
  cpfCliente.value = formatarCPF(cpfCliente.value);
});

telefone.addEventListener("input", () => {
  telefone.value = formatarTelefone(telefone.value);
});

cpfCadastro.addEventListener("input", () => {
  cpfCadastro.value = formatarCPF(cpfCadastro.value);
});

telefoneCadastro.addEventListener("input", () => {
  telefoneCadastro.value = formatarTelefone(telefoneCadastro.value);
});

formPesquisa.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (
    cpfInput.value.trim() === "" ||
    validarCPF(cpfInput.value.trim()) === false
  ) {
    alert("CPF inválido, digite um CPF real.");
    return;
  }

  const body = {
    cpf: cpfInput.value,
  };

  try {
    const response = await fetch("/easysale/cliente/buscar-cliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const cliente = await response.json();
      preencherCliente(cliente);
    } else {
      const mensagem = await response.text();
      alert(mensagem);
    }
  } catch (error) {
    console.error(error);
  }
});

formPesquisa.addEventListener("reset", () => {
  formCliente.reset();

  nome.disabled = true;
  cpfCliente.disabled = true;
  telefone.disabled = true;

  editarBtn.style.display = "inline";
  excluirBtn.style.display = "inline";
  salvarBtn.style.display = "none";

  formCliente.style.display = "none";
});

function preencherCliente(cliente) {
  nome.value = cliente.nome;
  cpfCliente.value = formatarCPF(cliente.cpf);
  telefone.value = cliente.telefone;

  formCliente.style.display = "block";
}

editarBtn.addEventListener("click", () => {
  nome.disabled = false;
  cpfCliente.disabled = false;
  telefone.disabled = false;

  editarBtn.style.display = "none";
  excluirBtn.style.display = "none";
  salvarBtn.style.display = "inline";
  cancelarEdicaoBtn.style.display = "inline";
});

excluirBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const confirmar = confirm(
    "⚠️ Atenção! Excluir um cliente é uma ação permanente.\n\nDeseja realmente continuar?",
  );

  if (!confirmar) return;

  const body = {
    cpf: cpfInput.value,
  };
  try {
    const response = await fetch("/easysale/cliente/excluir-cliente", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      formPesquisa.reset();
      formCliente.reset();
    } else {
      const mensagem = await response.text();
      alert(mensagem);
    }
  } catch (error) {
    console.error(error);
  }
});

cancelarEdicaoBtn.addEventListener("click", async (event) => {

  event.preventDefault();

  nome.disabled = true;
  cpfCliente.disabled = true;
  telefone.disabled = true;

  editarBtn.style.display = "inline";
  salvarBtn.style.display = "none";
  cancelarEdicaoBtn.style.display = "none";
  excluirBtn.style.display = "inline";
});


formCliente.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (
    nome.value.trim() === "" ||
    nome.value.trim().length < 3 ||
    /^[a-zA-Z\s]+$/.test(nome.value.trim()) === false
  ) {
    alert(
      "O nome deve conter ao menos 3 letras e não possuir números ou caracteres especiais.",
    );
    return;
  }
  if (
    cpfCliente.value.trim() === "" ||
    validarCPF(cpfCliente.value.trim()) === false
  ) {
    alert("CPF inválido, digite um CPF real.");
    return;
  }
  if (
    telefone.value.trim() === "" ||
    !/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(telefone.value.trim())
  ) {
    alert("Telefone inválido, digite um telefone real.");
    return;
  }

  const clienteAtualizado = {
    cpf: cpfCliente.value,
    nome: nome.value,
    telefone: telefone.value,
  };

  try {
    const response = await fetch("/easysale/cliente/editar-cliente", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(clienteAtualizado),
    });

    if (response.ok) {
      alert("Cliente atualizado com sucesso!");
      nome.disabled = true;
      cpfCliente.disabled = true;
      telefone.disabled = true;

      editarBtn.style.display = "inline";
      excluirBtn.style.display = "inline";
      salvarBtn.style.display = "none";
    } else {
      const mensagem = await response.text();
      alert(mensagem);
    }
  } catch (error) {
    console.error(error);
  }
});

formCadastrar.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (
    nomeCadastro.value.trim() === "" ||
    nomeCadastro.value.trim().length < 3 ||
    /^[a-zA-Z\s]+$/.test(nomeCadastro.value.trim()) === false
  ) {
    alert(
      "O nome deve conter ao menos 3 letras e não possuir números ou caracteres especiais.",
    );
    return;
  }
  if (
    cpfCadastro.value.trim() === "" ||
    validarCPF(cpfCadastro.value.trim()) === false
  ) {
    alert("CPF inválido, digite um CPF real.");
    return;
  }
  if (
    telefoneCadastro.value.trim() === "" ||
    !/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(telefoneCadastro.value.trim())
  ) {
    alert("Telefone inválido, digite um telefone real.");
    return;
  }

  const cliente = {
    nome: nomeCadastro.value,
    cpf: cpfCadastro.value,
    telefone: telefoneCadastro.value,
  };

  try {
    const response = await fetch("/easysale/cliente/cadastrar-cliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(cliente),
    });

    if (response.ok) {
      alert("Cliente cadastrado com sucesso!");
    } else {
      const mensagem = await response.text();
      alert(mensagem);
    }
  } catch (error) {
    console.error(error);
  }
});

function formatarTelefone(valor) {
  valor = valor.replace(/\D/g, "").slice(0, 11);

  if (valor.length <= 10) {
    return valor
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return valor
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatarCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

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
