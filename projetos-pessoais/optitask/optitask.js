// Estrutura de dados
class OptiTaskManager {
    constructor() {
        this.state = {
            modulos: [],
            posicoes: [],
            produtos: [],
            todoList: []
        };
        this.carregarDados();
    }

    // Gerenciamento de Módulos
    adicionarModulo(modulo) {
        modulo.id = this.gerarId('MOD');
        this.state.modulos.push(modulo);
        this.salvarDados();
        return modulo;
    }

    editarModulo(id, novosDados) {
        const index = this.state.modulos.findIndex(m => m.id === id);
        if (index !== -1) {
            this.state.modulos[index] = { ...this.state.modulos[index], ...novosDados };
            this.salvarDados();
            return true;
        }
        return false;
    }

    removerModulo(id) {
        this.state.modulos = this.state.modulos.filter(m => m.id !== id);
        this.salvarDados();
    }

    // Gerenciamento de Posições
    adicionarPosicao(posicao) {
        posicao.id = this.gerarId('POS');
        this.state.posicoes.push(posicao);
        this.salvarDados();
        return posicao;
    }

    // Gerenciamento de Produtos
    adicionarProduto(produto) {
        produto.id = this.gerarId('PRD');
        this.state.produtos.push(produto);
        this.salvarDados();
        return produto;
    }

    // Gerenciamento de To-Do List
    gerarTodoList() {
        // Lógica para gerar to-do list baseada nos dados atuais
        this.state.todoList = [];
        // TODO: Implementar lógica de geração
        this.salvarDados();
    }

    // Utilitários
    gerarId(prefixo) {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `${prefixo}-${timestamp}-${random}`;
    }

    // Persistência de dados
    salvarDados() {
        localStorage.setItem('optiTaskData', JSON.stringify(this.state));
        this.dispararEvento('dadosAtualizados');
    }

    carregarDados() {
        const dados = localStorage.getItem('optiTaskData');
        if (dados) {
            this.state = JSON.parse(dados);
        }
    }

    // Exportação/Importação
    exportarDados() {
        const dataStr = JSON.stringify(this.state, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `optitask-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async importarDados(arquivo) {
        try {
            const texto = await arquivo.text();
            const dados = JSON.parse(texto);
            
            // Validação básica dos dados
            if (dados && typeof dados === 'object' && 
                Array.isArray(dados.modulos) && 
                Array.isArray(dados.posicoes) && 
                Array.isArray(dados.produtos)) {
                
                this.state = dados;
                this.salvarDados();
                return true;
            }
            throw new Error('Formato de arquivo inválido');
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            throw error;
        }
    }

    // Sistema de eventos
    dispararEvento(tipo) {
        const evento = new CustomEvent('optiTask', { 
            detail: { tipo, dados: this.state }
        });
        document.dispatchEvent(evento);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const optiTask = new OptiTaskManager();

    // Referências aos elementos do modal
    const modalModulo = document.getElementById('modalModulo');
    const formModulo = document.getElementById('formModulo');
    const inputNomeModulo = document.getElementById('inputNomeModulo');
    const inputTipoModulo = document.getElementById('inputTipoModulo');
    const inputNumColunas = document.getElementById('inputNumColunas');
    const posicoesContainer = document.getElementById('posicoesContainer');

    // Gerar posições dinamicamente
    inputNumColunas.addEventListener('change', () => {
        const numColunas = parseInt(inputNumColunas.value);
        posicoesContainer.innerHTML = ''; // Limpar container

        for (let coluna = 1; coluna <= numColunas; coluna++) {
            const colunaDiv = document.createElement('div');
            colunaDiv.classList.add('mb-3');
            
            const labelColuna = document.createElement('label');
            labelColuna.classList.add('form-label');
            labelColuna.textContent = `Posições da Coluna ${coluna}`;
            colunaDiv.appendChild(labelColuna);

            const posicoes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
            posicoes.slice(0, 5).forEach(letra => {
                const posicaoDiv = document.createElement('div');
                posicaoDiv.classList.add('input-group', 'mb-2');

                const posicaoInputCodigo = document.createElement('input');
                posicaoInputCodigo.type = 'text';
                posicaoInputCodigo.classList.add('form-control', 'bg-dark', 'text-white', 'border-secondary');
                posicaoInputCodigo.value = `${letra}${coluna}`;
                posicaoInputCodigo.readOnly = true;

                const posicaoInputNome = document.createElement('input');
                posicaoInputNome.type = 'text';
                posicaoInputNome.classList.add('form-control', 'bg-dark', 'text-white', 'border-secondary');
                posicaoInputNome.placeholder = `Nome da posição ${letra}${coluna}`;
                posicaoInputNome.required = true;

                posicaoDiv.appendChild(posicaoInputCodigo);
                posicaoDiv.appendChild(posicaoInputNome);
                
                colunaDiv.appendChild(posicaoDiv);
            });

            posicoesContainer.appendChild(colunaDiv);
        }
    });

    // Submissão do formulário
    formModulo.addEventListener('submit', (e) => {
        e.preventDefault();

        // Coletar dados do módulo
        const nomeModulo = inputNomeModulo.value;
        const tipoModulo = inputTipoModulo.value;
        const numColunas = parseInt(inputNumColunas.value);

        // Gerar posições
        const posicoes = [];
        const posicoesInputs = posicoesContainer.querySelectorAll('.input-group');
        
        posicoesInputs.forEach(posicaoInput => {
            const codigo = posicaoInput.querySelector('input:first-child').value;
            const nome = posicaoInput.querySelector('input:last-child').value;
            const coluna = parseInt(codigo.slice(-1));

            posicoes.push({
                id: `POS-${codigo}`,
                codigo: codigo,
                nome: nome,
                coluna: coluna,
                status: 'disponivel'
            });
        });

        // Criar módulo
        const novoModulo = {
            nome: nomeModulo,
            tipo: tipoModulo,
            numColunas: numColunas,
            posicoes: posicoes
        };

        // Adicionar módulo
        const moduloCriado = optiTask.adicionarModulo(novoModulo);
        
        // Fechar modal
        const modalInstance = bootstrap.Modal.getInstance(modalModulo);
        modalInstance.hide();

        // Atualizar visualização (a ser implementado)
        console.log('Módulo criado:', moduloCriado);
    });

    // Event Listeners para exportar/importar
    document.getElementById('btnExportar').addEventListener('click', () => {
        optiTask.exportarDados();
    });

    document.getElementById('btnImportar').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const arquivo = e.target.files[0];
            try {
                await optiTask.importarDados(arquivo);
                alert('Dados importados com sucesso!');
            } catch (error) {
                alert('Erro ao importar dados: ' + error.message);
            }
        };
        input.click();
    });

    // Exemplo de uso do sistema de eventos
    document.addEventListener('optiTask', (e) => {
        if (e.detail.tipo === 'dadosAtualizados') {
            console.log('Dados atualizados:', e.detail.dados);
            // TODO: Atualizar interface
        }
    });
});

    // Exemplo de uso do sistema de eventos
    document.addEventListener('optiTask', (e) => {
        if (e.detail.tipo === 'dadosAtualizados') {
            console.log('Dados atualizados:', e.detail.dados);
            // TODO: Atualizar interface
        }
    });
});
