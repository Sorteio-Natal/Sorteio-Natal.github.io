const BACKEND_URL = 'https://sorteio-backend-819546592483.europe-west1.run.app';

// Função para obter TODOS os dados da sheet
async function obterTodosDados() {
    try {
        const url = `${BACKEND_URL}/obter-dados`; // Endpoint do backend
        console.log('URL chamada para obter dados:', url);
        const response = await fetch(url);
        const data = await response.json();
        console.log('Resposta da API (obterTodosDados):', data);
        return data.values || [];
    } catch (error) {
        console.error('Erro ao obter dados:', error);
        return [];
    }
}

// Função para encontrar uma pessoa pelo código
async function encontrarPessoaPorCodigo(codigo) {
    const todosDados = await obterTodosDados();
    
    // Pular o cabeçalho (primeira linha)
    for (let i = 1; i < todosDados.length; i++) {
        const linha = todosDados[i];
        if (linha[1] === codigo) { // Coluna B é o código
            return {
                linhaIndex: i + 1, // +1 porque Sheets começa em 1, não em 0
                nome: linha[0],
                codigo: linha[1],
                wishlist: JSON.parse(linha[2] || '[]')
            };
        }
    }
    return null;
}

// Função para atualizar a wishlist de uma pessoa
async function atualizarWishlist(codigo, novaWishlist) {
    try {
        const nome = Object.keys(codigosPessoais).find(
            nome => codigosPessoais[nome] === codigo
        );

        if (!nome) {
            console.error('Nome não encontrado para o código:', codigo);
            return false;
        }

        console.log('A enviar dados para o backend:', {
            nome: nome,
            codigo: codigo,
            wishlist: JSON.stringify(novaWishlist)
        });

        const response = await fetch(`${BACKEND_URL}/atualizar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nome,
                codigo: codigo,
                wishlist:JSON.stringify(novaWishlist)
            })
        });

        console.log('Resposta do backend - Status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro HTTP:', response.status, errorText);
            return false;
        }

        const data = await response.json();
        console.log('Resposta do backend:', data);

        return data.success === true;
        
    } catch (error) {
        console.error('Erro ao atualizar wishlist:', error);
        return false;
    }
}

// Função para obter wishlist de uma pessoa pelo nome
async function obterWishlistPorNome(nome) {
    try{
        const todosDados = await obterTodosDados();
        
        for (let i = 1; i < todosDados.length; i++) {
            const linha = todosDados[i];
            if (linha[0] === nome) {
                const wishlistStr = linha[2] || '[]';
                console.log('Wishlist string encontrada:', wishlistStr);
                try {
                    const cleanedStr = wishlistStr.replace(/^"+|"+$/g, '');
                    return JSON.parse(cleanedStr);
                } catch (error) {
                    console.error('Erro ao parsar wishlist', parseError);
                    return [];
                }
            }
        }
        return [];
    } catch (error) {
        console.error('Erro ao obter wishlist por nome:', error);
        return [];
    }
}