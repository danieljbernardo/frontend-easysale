const token = localStorage.getItem("token");

const formPesquisa = document.getElementById("formPesquisa");
const pesquisaCpf = document.getElementById("pesquisaCpf");
const pesquisaData = document.getElementById("pesquisaData");
const resultadoVenda = document.getElementById("resultadoVenda");

const formVenda = document.getElementById("formVenda");
const cpfVenda = document.getElementById("cpfVenda");
const notaFiscal = document.getElementById("notaFiscal");
const dataVenda = document.getElementById("dataVenda");
const pagamentoForma = document.getElementById("pagamentoForma");
const valorTotal = document.getElementById("valorTotal");
const editarVendaBtn = document.getElementById("editarVenda");
const salvarVendaBtn = document.getElementById("salvarVenda");
const cancelarEdicaoBtn = document.getElementById("cancelarEdicaoVenda");
const excluirVendaBtn = document.getElementById("excluirVenda");
const gerarRelatorioBtn = document.getElementById("gerarRelatorio");

const tabelaItens = document.getElementById("tabelaItens");
const adicionarItemBtn = document.getElementById("adicionarItemBtn");
const formNovoItemWrapper = document.getElementById("formNovoItemWrapper");
const novoItemCodigo = document.getElementById("novoItemCodigo");
const novoItemQtd = document.getElementById("novoItemQtd");
const novoItemPreco = document.getElementById("novoItemPreco");
const novoItemSubtotal = document.getElementById("novoItemSubtotal");
const salvarNovoItemBtn = document.getElementById("salvarNovoItem");
const cancelarNovoItemBtn = document.getElementById("cancelarNovoItem");

const formCadastrarVenda = document.getElementById("formCadastrarVenda");
const cpfCadastro = document.getElementById("cpfCadastro");
const pagamentoCadastro = document.getElementById("pagamentoCadastro");
const adicionarItemCadastroBtn = document.getElementById("adicionarItemCadastroBtn");
const formItemCadastroWrapper = document.getElementById("formItemCadastroWrapper");
const itemCadastroCodigo = document.getElementById("itemCadastroCodigo");
const itemCadastroQtd = document.getElementById("itemCadastroQtd");
const itemCadastroPreco = document.getElementById("itemCadastroPreco");
const itemCadastroSubtotal = document.getElementById("itemCadastroSubtotal");
const confirmarItemCadastroBtn = document.getElementById("confirmarItemCadastro");
const cancelarItemCadastroBtn = document.getElementById("cancelarItemCadastro");
const totalCadastroEl = document.getElementById("totalCadastro");
const itensCadastroLista = document.getElementById("itensCadastroLista");

let vendaAtual = null; 
let itensCadastro = [];

pesquisaCpf.addEventListener("input", () => { pesquisaCpf.value = formatarCPF(pesquisaCpf.value); });
cpfCadastro.addEventListener("input", () => { cpfCadastro.value = formatarCPF(cpfCadastro.value); });

novoItemQtd.addEventListener("input", calcularSubtotalNovo);
novoItemPreco.addEventListener("input", calcularSubtotalNovo);
itemCadastroQtd.addEventListener("input", calcularSubtotalCadastro);
itemCadastroPreco.addEventListener("input", calcularSubtotalCadastro);

function calcularSubtotalNovo() {
    const qtd = parseFloat(novoItemQtd.value) || 0;
    const preco = parseFloat(novoItemPreco.value) || 0;
    novoItemSubtotal.value = (qtd * preco).toFixed(2);
}

function calcularSubtotalCadastro() {
    const qtd = parseFloat(itemCadastroQtd.value) || 0;
    const preco = parseFloat(itemCadastroPreco.value) || 0;
    itemCadastroSubtotal.value = (qtd * preco).toFixed(2);
}

formPesquisa.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const cpf = pesquisaCpf.value.trim();
    if (!validarCPF(cpf)) {
        alert("CPF inválido.");
        return;
    }
    
    const data = pesquisaData.value;
    if (!data) {
        alert("Selecione uma data.");
        return;
    }
    
    const dataFormatada = formatarDataParaBackend(data);
    
    const body = { cpf: cpf, data: dataFormatada };
    
    try {
        const response = await fetch("/easysale/venda/buscar-venda", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            const vendas = await response.json(); 
            if (vendas.length === 0) {
                alert("Nenhuma venda encontrada.");
                return;
            }
            
            vendaAtual = vendas[0];
            preencherFormularioVenda(vendaAtual);
            resultadoVenda.style.display = "block";
        } else {
            const mensagem = await response.text();
            alert(mensagem);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao buscar venda.");
    }
});

formPesquisa.addEventListener("reset", () => {
    resultadoVenda.style.display = "none";
    vendaAtual = null;
    resetarCamposVenda();
    tabelaItens.innerHTML = "";
    formNovoItemWrapper.style.display = "none";
});

function preencherFormularioVenda(venda) {
    cpfVenda.value = formatarCPF(venda.clienteCpf);
    notaFiscal.value = venda.notaFiscalNumero || "—";
    dataVenda.value = venda.dataVenda;
    pagamentoForma.value = venda.pagamentoForma;
    valorTotal.value = `R$ ${parseFloat(venda.valorTotal).toFixed(2).replace(".", ",")}`;
    
    renderizarItens(venda.itensVenda || []);
}

function renderizarItens(itens) {
    if (!itens || itens.length === 0) {
        tabelaItens.innerHTML = '<p class="text-muted">Nenhum item nesta venda.</p>';
        return;
    }
    
    let html = `<table class="tabela-itens"><thead>
        <tr>
            <th>Cód. Produto</th>
            <th>Nome</th>
            <th>Qtd.</th>
            <th>Preço Unit.</th>
            <th>Subtotal</th>
            <th>Ações</th>
        </tr>
        </thead><tbody>`;
    
    itens.forEach(item => {
        const itemId = item.itemVendaId || item.id;
        html += `
            <tr id="linha-item-${itemId}">
                <td>
                    <span class="item-display-codigo">${item.produtoCodigo}</span>
                    <input type="number" class="form-control form-control-sm item-edit-codigo" 
                           value="${item.produtoCodigo}" style="display:none;width:90px;" min="100" max="999">
                </td>
                <td>${item.produtoNome}</td>
                <td>
                    <span class="item-display-qtd">${item.quantidade}</span>
                    <input type="number" class="form-control form-control-sm item-edit-qtd" 
                           value="${item.quantidade}" style="display:none;width:80px;" min="1">
                </td>
                <td>R$ ${parseFloat(item.precoUnitario).toFixed(2).replace(".", ",")}</td>
                <td>R$ ${parseFloat(item.subtotal).toFixed(2).replace(".", ",")}</td>
                <td>
                    <button type="button" class="btn botao-sm btn-editar-item" data-id="${itemId}">Editar</button>
                    <button type="button" class="btn botao-sm btn-salvar-item" data-id="${itemId}" style="display:none;">Salvar</button>
                    <button type="button" class="btn botao-excluir-sm btn-excluir-item" data-id="${itemId}">Excluir</button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    tabelaItens.innerHTML = html;
    
    document.querySelectorAll(".btn-editar-item").forEach(btn => {
        btn.addEventListener("click", () => entrarEdicaoItem(btn.dataset.id));
    });
    document.querySelectorAll(".btn-salvar-item").forEach(btn => {
        btn.addEventListener("click", () => salvarEdicaoItem(btn.dataset.id));
    });
    document.querySelectorAll(".btn-excluir-item").forEach(btn => {
        btn.addEventListener("click", () => excluirItem(btn.dataset.id));
    });
}

function entrarEdicaoItem(id) {
    const linha = document.getElementById(`linha-item-${id}`);
    if (!linha) return;
    
    linha.querySelectorAll(".item-display-codigo, .item-display-qtd").forEach(el => el.style.display = "none");
    linha.querySelectorAll(".item-edit-codigo, .item-edit-qtd").forEach(el => el.style.display = "inline-block");
    linha.querySelector(".btn-editar-item").style.display = "none";
    linha.querySelector(".btn-salvar-item").style.display = "inline-block";
}

async function salvarEdicaoItem(id) {
    const linha = document.getElementById(`linha-item-${id}`);
    const codigo = parseInt(linha.querySelector(".item-edit-codigo").value);
    const qtd = parseInt(linha.querySelector(".item-edit-qtd").value);
    
    if (!validarCodigo(codigo)) {
        alert("Código inválido (100-999).");
        return;
    }
    if (isNaN(qtd) || qtd < 1) {
        alert("Quantidade inválida.");
        return;
    }
    
    const body = {
        itemVendaId: parseInt(id),
        produtoCodigo: codigo,
        quantidade: qtd
    };
    
    try {
        const response = await fetch("/easysale/venda/editar-item-venda", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            alert("Item atualizado com sucesso!");
            await recarregarVenda();
        } else {
            const mensagem = await response.text();
            alert(mensagem);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao editar item.");
    }
}

async function excluirItem(id) {
    if (!confirm("Deseja realmente excluir este item?")) return;
    
    try {
        const response = await fetch("/easysale/venda/excluir-item-venda", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ itemVendaId: parseInt(id), deletar: true })
        });
        
        if (response.ok) {
            alert("Item excluído com sucesso!");
            await recarregarVenda();
        } else {
            const mensagem = await response.text();
            alert(mensagem);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir item.");
    }
}

async function recarregarVenda() {
    const body = {
        cpf: pesquisaCpf.value.trim(),
        data: formatarDataParaBackend(pesquisaData.value)
    };
    
    try {
        const response = await fetch("/easysale/venda/buscar-venda", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            const vendas = await response.json();
            if (vendas.length > 0) {
                vendaAtual = vendas[0];
                preencherFormularioVenda(vendaAtual);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

adicionarItemBtn.addEventListener("click", () => {
    if (!vendaAtual) {
        alert("Primeiro pesquise uma venda.");
        return;
    }
    formNovoItemWrapper.style.display = "block";
});

cancelarNovoItemBtn.addEventListener("click", () => {
    formNovoItemWrapper.style.display = "none";
    novoItemCodigo.value = "";
    novoItemQtd.value = "";
    novoItemPreco.value = "";
    novoItemSubtotal.value = "";
});

salvarNovoItemBtn.addEventListener("click", async () => {
    const codigo = parseInt(novoItemCodigo.value);
    const qtd = parseInt(novoItemQtd.value);
    const preco = parseFloat(novoItemPreco.value);
    const subtotal = parseFloat(novoItemSubtotal.value);
    
    if (!validarCodigo(codigo)) {
        alert("Código inválido (100-999).");
        return;
    }
    if (isNaN(qtd) || qtd < 1) {
        alert("Quantidade inválida.");
        return;
    }
    if (isNaN(preco) || preco <= 0) {
        alert("Preço inválido.");
        return;
    }
    
    const body = {
        vendaId: vendaAtual.vendaId || vendaAtual.id,
        produtoCodigo: codigo,
        quantidade: qtd,
        precoUnitario: preco,
        subtotal: subtotal
    };
    
    try {
        const response = await fetch("/easysale/venda/criar-item-venda", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            alert("Item adicionado com sucesso!");
            formNovoItemWrapper.style.display = "none";
            novoItemCodigo.value = "";
            novoItemQtd.value = "";
            novoItemPreco.value = "";
            novoItemSubtotal.value = "";
            await recarregarVenda();
        } else {
            const mensagem = await response.text();
            alert(mensagem);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao adicionar item.");
    }
});

adicionarItemCadastroBtn.addEventListener("click", () => {
    formItemCadastroWrapper.style.display = "block";
});

cancelarItemCadastroBtn.addEventListener("click", () => {
    formItemCadastroWrapper.style.display = "none";
    itemCadastroCodigo.value = "";
    itemCadastroQtd.value = "";
    itemCadastroPreco.value = "";
    itemCadastroSubtotal.value = "";
});

confirmarItemCadastroBtn.addEventListener("click", () => {
    const codigo = parseInt(itemCadastroCodigo.value);
    const qtd = parseInt(itemCadastroQtd.value);
    const preco = parseFloat(itemCadastroPreco.value);
    const subtotal = parseFloat(itemCadastroSubtotal.value);
    
    if (!validarCodigo(codigo)) {
        alert("Código inválido (100-999).");
        return;
    }
    if (isNaN(qtd) || qtd < 1) {
        alert("Quantidade inválida.");
        return;
    }
    if (isNaN(preco) || preco <= 0) {
        alert("Preço inválido.");
        return;
    }
    
    itensCadastro.push({ codigo, qtd, preco, subtotal });
    formItemCadastroWrapper.style.display = "none";
    itemCadastroCodigo.value = "";
    itemCadastroQtd.value = "";
    itemCadastroPreco.value = "";
    itemCadastroSubtotal.value = "";
    renderizarItensCadastro();
});

function renderizarItensCadastro() {
    itensCadastroLista.innerHTML = "";
    let total = 0;
    
    itensCadastro.forEach((item, index) => {
        total += item.subtotal;
        const div = document.createElement("div");
        div.className = "item-cadastro-linha";
        div.innerHTML = `
            <span>Cód: <strong>${item.codigo}</strong></span>
            <span>Qtd: <strong>${item.qtd}</strong></span>
            <span>Unit: <strong>R$ ${item.preco.toFixed(2).replace(".", ",")}</strong></span>
            <span>Subtotal: <strong>R$ ${item.subtotal.toFixed(2).replace(".", ",")}</strong></span>
            <button type="button" class="btn botao-excluir-sm" data-index="${index}">
                <i class="bi bi-trash"></i>
            </button>
        `;
        div.querySelector("button").addEventListener("click", () => {
            itensCadastro.splice(index, 1);
            renderizarItensCadastro();
        });
        itensCadastroLista.appendChild(div);
    });
    
    totalCadastroEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

formCadastrarVenda.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const cpf = cpfCadastro.value.trim();
    if (!validarCPF(cpf)) {
        alert("CPF inválido.");
        return;
    }
    
    const formaPagamento = pagamentoCadastro.value;
    if (!formaPagamento) {
        alert("Selecione a forma de pagamento.");
        return;
    }
    
    if (itensCadastro.length === 0) {
        alert("Adicione ao menos um item.");
        return;
    }
    
    const produtos = itensCadastro.map(item => item.codigo).join(",");
    const quantidades = itensCadastro.map(item => item.qtd).join(",");
    
    const body = {
        cpf: cpf,
        formaPagamento: formaPagamento,
        produtos: produtos,
        quantidades: quantidades
    };
    
    try {
        const response = await fetch("/easysale/venda/cadastrar-venda", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "nota_fiscal.pdf";
            a.click();
            URL.revokeObjectURL(url);
            
            alert("Venda cadastrada com sucesso!");
            
            itensCadastro = [];
            renderizarItensCadastro();
            formCadastrarVenda.reset();
        } else {
            const mensagem = await response.text();
            alert(mensagem);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao cadastrar venda.");
    }
});

editarVendaBtn.addEventListener("click", () => {
    cpfVenda.disabled = false;
    dataVenda.disabled = false;
    pagamentoForma.disabled = false;
    
    editarVendaBtn.style.display = "none";
    salvarVendaBtn.style.display = "inline";
    cancelarEdicaoBtn.style.display = "inline";
    excluirVendaBtn.style.display = "none";
    gerarRelatorioBtn.style.display = "none";
});

cancelarEdicaoBtn.addEventListener("click", () => {
    if (vendaAtual) {
        preencherFormularioVenda(vendaAtual);
    }
    
    cpfVenda.disabled = true;
    dataVenda.disabled = true;
    pagamentoForma.disabled = true;
    
    editarVendaBtn.style.display = "inline";
    salvarVendaBtn.style.display = "none";
    cancelarEdicaoBtn.style.display = "none";
    excluirVendaBtn.style.display = "inline";
    gerarRelatorioBtn.style.display = "inline";
});

formVenda.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    if (!vendaAtual) return;
    
    const body = {
        vendaId: vendaAtual.vendaId || vendaAtual.id,
        clienteCpf: cpfVenda.value.trim(),
        pagamentoForma: pagamentoForma.value,
        dataVenda: formatarDataParaBackend(dataVenda.value)
    };
    
    try {
        const response = await fetch("/easysale/venda/editar-venda", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            alert("Venda atualizada com sucesso!");
            await recarregarVenda();
            
            cpfVenda.disabled = true;
            dataVenda.disabled = true;
            pagamentoForma.disabled = true;
            
            editarVendaBtn.style.display = "inline";
            salvarVendaBtn.style.display = "none";
            cancelarEdicaoBtn.style.display = "none";
            excluirVendaBtn.style.display = "inline";
            gerarRelatorioBtn.style.display = "inline";
        } else {
            const mensagem = await response.text();
            alert(mensagem);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao editar venda.");
    }
});

excluirVendaBtn.addEventListener("click", async () => {
    if (!vendaAtual) return;
    
    if (!confirm("⚠️ Deseja realmente excluir esta venda?")) return;
    
    try {
        const response = await fetch("/easysale/venda/deletar-venda", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ codigo: vendaAtual.vendaId || vendaAtual.id })
        });
        
        if (response.ok) {
            alert("Venda excluída com sucesso!");
            formPesquisa.reset();
            resultadoVenda.style.display = "none";
            vendaAtual = null;
        } else {
            const mensagem = await response.text();
            alert(mensagem);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir venda.");
    }
});

gerarRelatorioBtn.addEventListener("click", async () => {
    if (!vendaAtual) {
        alert("Faça uma pesquisa primeiro.");
        return;
    }
    
    try {
        const body = {
            cpf: pesquisaCpf.value.trim(),
            data: formatarDataParaBackend(pesquisaData.value)
        };
        
        const response = await fetch("/easysale/usuario/gerar-relatorio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(body)
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "relatorio_vendas.pdf";
            a.click();
            URL.revokeObjectURL(url);
        } else {
            const mensagem = await response.text();
            alert(mensagem);
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao gerar relatório.");
    }
});

function formatarCPF(valor) {
    return valor.replace(/\D/g, "").slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarDataParaBackend(dataInput) {
    if (!dataInput) return "";
    const partes = dataInput.split("-");
    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataInput;
}

function formatarDataExibicao(valor) {
    if (!valor) return "—";
    if (typeof valor === "string") {
        if (valor.includes("/")) return valor;
        if (valor.includes("-")) {
            const [ano, mes, dia] = valor.split("-");
            return `${dia}/${mes}/${ano}`;
        }
    }
    return valor;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
    let d1 = (soma * 10) % 11;
    if (d1 === 10) d1 = 0;
    if (d1 !== parseInt(cpf[9])) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
    let d2 = (soma * 10) % 11;
    if (d2 === 10) d2 = 0;
    
    return d2 === parseInt(cpf[10]);
}

function validarCodigo(codigo) {
    return Number.isInteger(codigo) && codigo >= 100 && codigo <= 999;
}

function resetarCamposVenda() {
    cpfVenda.disabled = true;
    dataVenda.disabled = true;
    pagamentoForma.disabled = true;
    valorTotal.readOnly = true;
    valorTotal.style.backgroundColor = "#e9ecef";
    valorTotal.value = "";
    cpfVenda.value = "";
    notaFiscal.value = "";
    dataVenda.value = "";
    pagamentoForma.value = "DINHEIRO";
    
    editarVendaBtn.style.display = "inline";
    salvarVendaBtn.style.display = "none";
    cancelarEdicaoBtn.style.display = "none";
    excluirVendaBtn.style.display = "inline";
    gerarRelatorioBtn.style.display = "inline";
}

resetarCamposVenda();