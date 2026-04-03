let nome = document.getElementById("nome").value.trim();
let cpf = document.getElementById("cpf");
let email = document.getElementById("email").value.trim();
let senha = document.getElementById("senha").value.trim();
let confirmarSenha = document.getElementById("confirmarSenha").value.trim();
let tipoUsuario = document.querySelector('input[name="tipoUsuario"]:checked');


function cadastrarUsuario() {

    let validacao = true;

    if(nome===""||nome.length<3||/^[a-zA-Z\s]+$/.test(nome)===false){
        validacao = false;
        document.getElementById("nome-invalido").textContent = 
        "O nome deve conter ao menos 3 letras e não possuir números ou caracteres especiais.";
    }
    if(cpf.value.trim()===""||validarCPF(cpf.value)===false){
        validacao = false;
        document.getElementById("cpf-invalido").textContent = "CPF inválido, digite um CPF real.";
    }
    if(email===""||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)===false){
        validacao = false;
        document.getElementById("email-invalido").textContent = "Email inválido, digite um email real.";
    }
    if(senha===""||senha.length<6){
        validacao = false;
        document.getElementById("senha-invalido").textContent = "A senha deve conter ao menos 6 caracteres.";
    }
    if(confirmarSenha===""||confirmarSenha!==senha){
        validacao = false;
        document.getElementById("confirmarSenha-invalido").textContent = "As senhas não coincidem.";
    }
    if(tipoUsuario===null){
        validacao = false;
        document.getElementById("tipoUsuario-invalido").textContent = "Selecione um tipo de usuário.";
    }

    const usuario = {
    nome: nome,
    cpf: cpf,
    email: email,
    senha: senha,
    role: tipoUsuario
    };

    if(validacao){
     enviarCadastro(usuario);
    }

}

async function enviarCadastro(usuario) {
        try {
            const response = await fetch("/easysale/usuario/cadastrar", {
                method: "POST",
                withCredentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            }); 

            if (response.ok) {
                window.location.href = "./usuarioLoginScript.js";
            }

        }catch (error) {
            if(error.response.status>=400&&error.response.status<500){
                alert("Erro ao cadastrar usuário. Analise os dados e corrija o que estiver errado.");
            }
            if(error.response.status>=500){
                alert("Erro no servidor. Por favor, tente novamente mais tarde.");
            }
        }

    }

cpf.addEventListener("input", () => {
  cpf.value = cpf.value
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
});

document.querySelectorAll(".toggle-senha").forEach(icone => {

    icone.addEventListener("click", () => {

        const input = document.getElementById(icone.dataset.target);

        if(input.type === "password"){
            input.type = "text";
            icone.classList.replace("bi-eye","bi-eye-slash");
        }else{
            input.type = "password";
            icone.classList.replace("bi-eye-slash","bi-eye");
        }

    });

});

function validarCPF(cpf){

  cpf = cpf.replace(/\D/g, "");

  if(cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;

  for(let i=0;i<9;i++) soma += cpf[i]*(10-i);
  let d1 = (soma*10)%11;
  if(d1==10) d1=0;

  if(d1 != cpf[9]) return false;

  soma = 0;

  for(let i=0;i<10;i++) soma += cpf[i]*(11-i);
  let d2 = (soma*10)%11;
  if(d2==10) d2=0;

  return d2 == cpf[10];
}