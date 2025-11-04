// Mapeamento reverso: código -> nome
const codigoParaNome = {};
Object.keys(codigosPessoais).forEach(nome => {
    codigoParaNome[codigosPessoais[nome]] = nome;
});

function verificarCodigo() {
    const codigoInput = document.getElementById('codigoInput').value.trim().toUpperCase();
    
    if (!codigoInput) {
        alert('Por favor, insere o teu código!');
        return;
    }
    
    if (codigoParaNome[codigoInput]) {
        const nomePessoa = codigoParaNome[codigoInput];
        const amigoSecreto = sorteioFinal[nomePessoa];
        
        // Mostrar resultado com animação
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('resultadoSection').style.display = 'block';
        
        // Animação de revelação
        revelarResultado(amigoSecreto);
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
}

// Enter para submeter
document.getElementById('codigoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verificarCodigo();
    }
});

// Efeito de neve
function criarNeve() {
    const snowflakes = ['❄️', '⛄', '🎄', '🎁', '⭐'];
    
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

// Iniciar efeito de neve
criarNeve();