const btnLogout = document.getElementById("logout");
const btnExcluirConta = document.getElementById("excluirConta");

window.onload = function(){
    const token = localStorage.getItem("token");
    if(!token) location.replace("../index.html")
}

btnLogout.addEventListener("click", async (event)=>{

    event.preventDefault();

    const confirmar = confirm(
    "⚠️ Atenção! Ao fazer logout você retornará para a área de LOGIN.\n\nDeseja realmente continuar?",
    );

    if(confirmar){
        localStorage.removeItem("token"); 
        localStorage.removeItem("role");
        location.replace("../html/usuario/usuarioLogin.html")
    } else return;

})

btnExcluirConta.addEventListener("click", async (event)=>{
    
    event.preventDefault();

    try{
       
        const confirmar = confirm(
         "❌ PERIGO!!! ISSO EXCLUIRÁ SUA CONTA PERMANENTEMENTE ❌.\n\nDeseja realmente continuar?",
         );

         if(!confirmar) return;

         const response = await fetch("/easysale/usuario/excluir-usuario", {
         method: "DELETE",
         headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
         },
     });


     if(response.ok){
        alert("Conta excluida com sucesso!");
        localStorage.removeItem("token"); 
        localStorage.removeItem("role");
        location.replace("../../index.html");

    }
    
    } catch(error){
        alert("Não foi possível excluir a sua conta");
    }
})

