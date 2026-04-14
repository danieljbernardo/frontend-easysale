const formPesquisa = document.getElementById("formPesquisa");
const formProduto = document.getElementById("formProduto");

const codigoInput = document.getElementById("pesquisa");

const nome = document.getElementById("nome");
const codigoProduto = document.getElementById("codigoProduto");
const preco = document.getElementById("preco");
const descricao = document.getElementById("descricao");

const editarBtn = document.getElementById("editar");
const salvarBtn = document.getElementById("salvar");
const excluirBtn = document.getElementById("excluir");
const cancelarEdicaoBtn = document.getElementById("cancelarEdicaoProduto");

const nomeCadastro = document.getElementById("nomeCadastro");
const codigoCadastro = document.getElementById("codigoCadastro");
const precoCadastro = document.getElementById("precoCadastro");
const descricaoCadastro = document.getElementById("descricaoCadastro");

const token = localStorage.getItem("token");

const formCadastrar = document.getElementById("formCadastrarProduto");

window.onload = function () {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    document.getElementById("cadastro").classList.add("sem-cadastro");
    editarBtn.style.display = "none";
    excluirBtn.style.display = "none";
  }
};

formPesquisa.addEventListener("submit", async (event) => {
  event.preventDefault();

  const codigo = parseInt(codigoInput.value.trim());

  if (!validarCodigo(codigo)) {
    alert("Código inválido. Digite um número inteiro entre 100 e 999.");
    return;
  }

  const body = { codigo };

  try {
    const response = await fetch("/easysale/produto/buscar-produto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const produto = await response.json();
      preencherProduto(produto);
    } else {
      const mensagem = await response.text();
      alert(mensagem);
    }
  } catch (error) {
    console.error(error);
  }
});

formPesquisa.addEventListener("reset", () => {
  formProduto.reset();

  nome.disabled = true;
  codigoProduto.disabled = true;
  preco.disabled = true;
  descricao.disabled = true;

  editarBtn.style.display = "inline";
  excluirBtn.style.display = "inline";
  salvarBtn.style.display = "none";

  formProduto.style.display = "none";
});

function preencherProduto(produto) {
  nome.value = produto.nome;
  codigoProduto.value = produto.codigo;
  preco.value = produto.preco;
  descricao.value = produto.descricao;

  formProduto.style.display = "block";
}

editarBtn.addEventListener("click", () => {
  nome.disabled = false;
  codigoProduto.disabled = false;
  preco.disabled = false;
  descricao.disabled = false;

  editarBtn.style.display = "none";
  excluirBtn.style.display = "none";
  salvarBtn.style.display = "inline";
  cancelarEdicaoBtn.style.display = "inline";
});

formProduto.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (nome.value.trim() === "" || nome.value.trim().length < 2) {
    alert("O nome deve conter ao menos 3 caracteres.");
    return;
  }

  const codigoEditado = parseInt(codigoProduto.value);
  if (!validarCodigo(codigoEditado)) {
    alert("Código inválido. Digite um número inteiro entre 100 e 999.");
    return;
  }

  const precoEditado = parseFloat(preco.value);
  if (isNaN(precoEditado) || precoEditado < 0) {
    alert("Preço inválido. Digite um valor maior ou igual a zero.");
    return;
  }

  if (descricao.value.trim() === "") {
    alert("A descrição não pode estar vazia.");
    return;
  }

  const produtoAtualizado = {
    codigo: codigoEditado,
    nome: nome.value.trim(),
    preco: precoEditado,
    descricao: descricao.value.trim(),
  };

  try {
    const response = await fetch("/easysale/produto/editar-produto", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(produtoAtualizado),
    });

    if (response.ok) {
      alert("Produto atualizado com sucesso!");
      nome.disabled = true;
      codigoProduto.disabled = true;
      preco.disabled = true;
      descricao.disabled = true;

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

excluirBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const confirmar = confirm(
    "⚠️ Atenção! Excluir um produto é uma ação permanente.\n\nDeseja realmente continuar?"
  );

  if (!confirmar) return;

  const body = { codigo: parseInt(codigoInput.value) };

  try {
    const response = await fetch("/easysale/produto/excluir-produto", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      formPesquisa.reset();
      formProduto.reset();
      formProduto.style.display = "none";
    } else {
      const mensagem = await response.text();
      alert(mensagem);
    }
  } catch (error) {
    console.error(error);
  }
});

cancelarEdicaoBtn.addEventListener("click", async(event) => {
  
  event.preventDefault();

  nome.disabled = true;
  codigoProduto.disabled = true;
  preco.disabled = true;
  descricao.disabled = true;

  editarBtn.style.display = "inline";
  excluirBtn.style.display = "inline"
  salvarBtn.style.display = "none";
  cancelarEdicaoBtn.style.display = "none";
});


formCadastrar.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (nomeCadastro.value.trim() === "" || nomeCadastro.value.trim().length < 2) {
    alert("O nome deve conter ao menos 2 caracteres.");
    return;
  }

  const codigoVal = parseInt(codigoCadastro.value);
  if (!validarCodigo(codigoVal)) {
    alert("Código inválido. Digite um número inteiro entre 100 e 999.");
    return;
  }

  const precoVal = parseFloat(precoCadastro.value);
  if (isNaN(precoVal) || precoVal < 0) {
    alert("Preço inválido. Digite um valor maior ou igual a zero.");
    return;
  }

  if (descricaoCadastro.value.trim() === "") {
    alert("A descrição não pode estar vazia.");
    return;
  }

  const produto = {
    nome: nomeCadastro.value.trim(),
    codigo: codigoVal,
    preco: precoVal,
    descricao: descricaoCadastro.value.trim(),
  };

  try {
    const response = await fetch("/easysale/produto/cadastrar-produto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(produto),
    });

    if (response.ok) {
      alert("Produto cadastrado com sucesso!");
      formCadastrar.reset();
    } else {
      const mensagem = await response.text();
      alert(mensagem);
    }
  } catch (error) {
    console.error(error);
  }
});

function validarCodigo(codigo) {
  return Number.isInteger(codigo) && codigo >= 100 && codigo <= 999;
}