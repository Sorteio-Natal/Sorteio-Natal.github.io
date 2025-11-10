// Mapeamento reverso: código -> nome
const codigoParaNome = {};
Object.keys(codigosPessoais).forEach(nome => {
    codigoParaNome[codigosPessoais[nome]] = nome;
});

// Variáveis globais
let amigoSecretoAtual = null;
let pessoaAtual = null;
let minhaWishlistAtual = [];

function verificarCodigo() {
    const codigoInput = document.getElementById('codigoInput').value.trim().toUpperCase();
    
    if (!codigoInput) {
        alert('Por favor, insere o teu código!');
        return;
    }
    
    if (codigoParaNome[codigoInput]) {
        const nomePessoa = codigoParaNome[codigoInput];
        const amigoSecreto = sorteioFinal[nomePessoa];
        
        // Guardar nas variáveis globais
        pessoaAtual = nomePessoa;
        amigoSecretoAtual = amigoSecreto;
        
        // Mostrar resultado com animação
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('resultadoSection').style.display = 'block';
        
        // Animação de revelação
        document.querySelector('#resultadoSection h2').innerHTML = `🎅 Olá, ${nomePessoa}! O Teu Amigo Secreto é... 🎅`;
        revelarResultado(amigoSecreto);

        document.getElementById('botoesAcao').style.display = 'block';
        
    } else {
        alert('Código inválido! Verifica o código e tenta novamente.');
    }
}

function revelarResultado(nome) {
    const elementoResultado = document.getElementById('resultadoNome');
    elementoResultado.innerHTML = '';
    
    // Animação de digitação
    let texto = `✨ ${nome} ✨`;
    let i = 0;
    
    function typeWriter() {
        if (i < texto.length) {
            elementoResultado.innerHTML += texto.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    typeWriter();
}

function voltar() {
    document.getElementById('resultadoSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('codigoInput').value = '';
    document.getElementById('resultadoNome').innerHTML = '';
    document.getElementById('botoesAcao').style.display = 'none';
}

// Enter para submeter
document.getElementById('codigoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verificarCodigo();
    }
});

// Efeito de neve
function criarNeve() {
    const snowflakes = ['❄️','❄️','❄️','❄️', '⛄', '🎄', '🎁', '⭐'];
    
    setInterval(() => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.top = '-50px';
        snowflake.style.opacity = Math.random() * 0.7 + 0.3;
        
        document.body.appendChild(snowflake);
        
        // Animação
        setTimeout(() => {
            snowflake.style.transition = 'all ' + (Math.random() * 3 + 5) + 's linear';
            snowflake.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
            snowflake.style.opacity = '0';
        }, 100);
        
        // Remover após animação
        setTimeout(() => {
            document.body.removeChild(snowflake);
        }, 8000);
    }, 300);
}

// Função para gerir desejos - ATUALIZADA
function gerirDesejos() {
    const codigoInput = document.getElementById('codigoInput').value.trim().toUpperCase();
    
    if (!codigoInput) {
        alert('Por favor, insere o teu código primeiro!');
        return;
    }
    
    if (codigoParaNome[codigoInput]) {
        pessoaAtual = codigoParaNome[codigoInput];
        amigoSecretoAtual = sorteioFinal[pessoaAtual];
        
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('desejosSection').style.display = 'block';
        
        carregarMinhaLista();
    } else {
        alert('Código inválido!');
    }
}

// Carregar minha lista - ATUALIZADA
async function carregarMinhaLista() {
    minhaWishlistAtual = await obterWishlistPorNome(pessoaAtual);
    atualizarInterfaceLista();
}

// Atualizar a interface da lista
function atualizarInterfaceLista() {
    const itensLista = document.getElementById('itensLista');
    itensLista.innerHTML = '';
    
    if (minhaWishlistAtual.length === 0) {
        itensLista.innerHTML = '<li style="text-align: center; color: #666;">A tua lista está vazia. Adiciona alguns itens! 🎁</li>';
        return;
    }
    
    minhaWishlistAtual.forEach((item, index) => {
        const li = document.createElement('li');
        li.style.padding = '8px';
        li.style.margin = '5px 0';
        li.style.background = 'white';
        li.style.borderRadius = '5px';
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between';
        li.style.alignItems = 'center';
        
        li.innerHTML = `
            <span style="color: #2d8a3a;">🎁 ${item}</span>
            <button onclick="removerItem(${index})" style="background: #ff4444; color: black; border: none; border-radius: 15px; width: 30px; height: 30px; cursor: pointer; font-weight: bold; font-size: 18px; display: flex; align-items: center; justify-content: center; padding: 0;">✕</button>
        `;
        
        itensLista.appendChild(li);
    });
}

// Adicionar item à lista
function adicionarItem() {
    const novoItemInput = document.getElementById('novoItemInput');
    const novoItem = novoItemInput.value.trim();
    
    if (!novoItem) {
        alert('Por favor, escreve um item!');
        return;
    }
    
    if (minhaWishlistAtual.includes(novoItem)) {
        alert('Este item já está na tua lista!');
        return;
    }
    
    minhaWishlistAtual.push(novoItem);
    novoItemInput.value = '';
    atualizarInterfaceLista();
    
    // Mostrar feedback
    const statusDiv = document.getElementById('minhaListaStatus');
    statusDiv.innerHTML = '✅ Item adicionado! Não te esqueças de guardar.';
    statusDiv.style.color = 'green';
    setTimeout(() => statusDiv.innerHTML = '', 2000);
}

// Remover item da lista
function removerItem(index) {
    minhaWishlistAtual.splice(index, 1);
    atualizarInterfaceLista();
    
    // Mostrar feedback
    const statusDiv = document.getElementById('minhaListaStatus');
    statusDiv.innerHTML = '🗑️ Item removido! Não te esqueças de guardar.';
    statusDiv.style.color = 'orange';
    setTimeout(() => statusDiv.innerHTML = '', 2000);
}

// Limpar toda a lista
function limparLista() {
    if (confirm('Tens a certeza que queres limpar toda a tua lista?')) {
        minhaWishlistAtual = [];
        atualizarInterfaceLista();
        
        const statusDiv = document.getElementById('minhaListaStatus');
        statusDiv.innerHTML = '🗑️ Lista limpa! Não te esqueças de guardar.';
        statusDiv.style.color = 'orange';
    }
}

// Guardar lista - ATUALIZADA
async function guardarMinhaLista() {
    const statusDiv = document.getElementById('minhaListaStatus');
    
    statusDiv.innerHTML = '⏳ A guardar...';
    statusDiv.style.color = 'blue';
    
    const sucesso = await atualizarWishlist(codigosPessoais[pessoaAtual], minhaWishlistAtual);
    
    if (sucesso) {
        statusDiv.innerHTML = '✅ Lista guardada com sucesso!';
        statusDiv.style.color = 'green';
        
        // Atualizar também a lista do amigo se estiver a ver
        setTimeout(carregarListaAmigo, 1000);
    } else {
        statusDiv.innerHTML = '❌ Erro ao guardar. Tenta novamente.';
        statusDiv.style.color = 'red';
    }
}

// Carregar lista do amigo - ATUALIZADA
async function carregarListaAmigo() {
    const listaAmigo = await obterWishlistPorNome(amigoSecretoAtual);
    const listaAmigoSection = document.getElementById('listaAmigoSection');
    const listaAmigoContent = document.getElementById('listaAmigoContent');
    
    listaAmigoSection.style.display = 'block';
    
    if (listaAmigo.length > 0) {
        let html = `<h4>🎁 Lista de Desejos de ${amigoSecretoAtual}:</h4><ul style="text-align: left; list-style-type: none; padding: 0;">`;
        
        listaAmigo.forEach(item => {
            html += `<li style="padding: 8px; margin: 5px 0; background: #e8f5e8; border-radius: 5px;">🎁 ${item}</li>`;
        });
        
        html += '</ul>';
        listaAmigoContent.innerHTML = html;
    } else {
        listaAmigoContent.innerHTML = `
            <p>${amigoSecretoAtual} ainda não adicionou a sua lista de desejos.</p>
        `;
    }
}

function verListaAmigo() {
    // Ir para a página de desejos e mostrar apenas a lista do amigo
    document.getElementById('resultadoSection').style.display = 'none';
    document.getElementById('desejosSection').style.display = 'block';
    document.getElementById('minhaListaSection').style.display = 'none';
    document.getElementById('listaAmigoSection').style.display = 'block';
    
    carregarListaAmigo();
}

function gerirMinhaLista() {
    // Ir para a página de desejos e mostrar apenas a gestão da própria lista
    document.getElementById('resultadoSection').style.display = 'none';
    document.getElementById('desejosSection').style.display = 'block';
    document.getElementById('minhaListaSection').style.display = 'block';
    document.getElementById('listaAmigoSection').style.display = 'none';
    
    carregarMinhaLista();
}

function voltarParaResultado() {
    // Voltar da página de desejos para a página de resultado
    document.getElementById('desejosSection').style.display = 'none';
    document.getElementById('resultadoSection').style.display = 'block';
}

// Iniciar efeito de neve
criarNeve();