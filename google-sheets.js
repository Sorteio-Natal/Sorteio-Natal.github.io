// Configuração do Google Sheets
const SHEET_ID = '1eJ7pn4HQbqS1oToSgQ0ZPHyw-n1IMklUW1dVldxrevE';
const API_KEY = 'AIzaSyBxvAWa8WEJuuBbVHHTHLaNUG5C6qIjG9s';

// Função para obter TODOS os dados da sheet
async function obterTodosDados() {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Desejos!A:C?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
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
        const pessoa = await encontrarPessoaPorCodigo(codigo);
        
        if (!pessoa) {
            // Se a pessoa não existe, criar nova linha
            return await criarNovaLinha(codigo, novaWishlist);
        }

        // Atualizar linha existente
        const range = `Desejos!A${pessoa.linhaIndex}:C${pessoa.linhaIndex}`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?valueInputOption=RAW&key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [[pessoa.nome, codigo, JSON.stringify(novaWishlist)]]
            })
        });

        return response.ok;
    } catch (error) {
        console.error('Erro ao atualizar wishlist:', error);
        return false;
    }
}

// Função para criar nova linha
async function criarNovaLinha(codigo, wishlist) {
    try {
        // Primeiro precisamos do nome da pessoa a partir do código
        const nome = Object.keys(codigosPessoais).find(
            nome => codigosPessoais[nome] === codigo
        );
        
        if (!nome) {
            console.error('Nome não encontrado para o código:', codigo);
            return false;
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Desejos!A:C:append?valueInputOption=RAW&key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [[nome, codigo, JSON.stringify(wishlist)]]
            })
        });
        
        return response.ok;
    } catch (error) {
        console.error('Erro ao criar nova linha:', error);
        return false;
    }
}

// Função para obter wishlist de uma pessoa pelo nome
async function obterWishlistPorNome(nome) {
    const todosDados = await obterTodosDados();
    
    for (let i = 1; i < todosDados.length; i++) {
        const linha = todosDados[i];
        if (linha[0] === nome) {
            return JSON.parse(linha[2] || '[]');
        }
    }
    return [];
}