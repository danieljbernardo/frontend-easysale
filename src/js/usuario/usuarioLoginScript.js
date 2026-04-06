let email = document.getElementById("email").value.trim();
let senha = document.getElementById("senha").value.trim();


async function loginUsuario() {
        try {
            const login = {
            email: email,
            senha: senha,
            };

            const response = await fetch("/easysale/usuario/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(login)
            }); 

            if (response.ok) {
                window.location.href = "../../html/home.html";
            }

        }catch (error) {
            if(error.response.status>=400&&error.response.status<500){
                alert("Email ou senha inválidos. Por favor, verifique os dados e tente novamente.");
            }
            if(error.response.status>=500){
                alert("Erro no servidor. Por favor, tente novamente mais tarde.");
            }
        }

    }

document.querySelectorAll(".olho-senha").forEach(icone => {

    icone.addEventListener("click", () => {

        const input = document.getElementById(icone.dataset.target);

        if(input.type === "password"){
            input.type = "text";
            icone.classList.replace("bi-eye-fill","bi-eye-slash-fill");
        }else{
            input.type = "password";
            icone.classList.replace("bi-eye-slash-fill","bi-eye-fill");
        }

    });

});