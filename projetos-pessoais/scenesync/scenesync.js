// Variáveis para controle do tempo e cenas
let startTime = null;
let timerInterval;
const scenes = [];
let isRecording = false;

// Função para formatar o tempo
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Atualização do cronômetro
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = formatTime(elapsedTime);
}

// Função para gerar relatório em tempo real
function updateReport() {
    const reportElement = document.getElementById('report');
    
    // Cria o relatório com a lógica correta de sobreposição
    const reportLines = scenes.map((scene, index) => {
        const startTime = formatTime(scene.start);
        const endTime = scene.end !== null 
            ? formatTime(scene.end) 
            : 'Em andamento';
        
        // Se for a última cena e a gravação estiver em andamento, não mostra o tipo
        if (index === scenes.length - 1 && scene.end === null) {
            return `${startTime} até ${endTime}`;
        }
        
        return `${startTime} até ${endTime} - ${scene.type}`;
    });
    
    reportElement.innerHTML = reportLines.join('\n');
}

// Função para atualizar o estado dos botões
function updateButtonStates() {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const goodSceneButton = document.getElementById('goodSceneButton');
    const reviewSceneButton = document.getElementById('reviewSceneButton');
    const badSceneButton = document.getElementById('badSceneButton');
    const downloadReportBtn = document.getElementById('downloadReportBtn');

    // Estado inicial: todos os botões de cena e finalizar inativos
    if (!startTime) {
        startButton.classList.remove('disabled');
        stopButton.classList.add('disabled');
        goodSceneButton.classList.add('disabled');
        reviewSceneButton.classList.add('disabled');
        badSceneButton.classList.add('disabled');
        downloadReportBtn.classList.add('disabled');
    } 
    // Durante a gravação
    else if (isRecording) {
        startButton.classList.add('disabled');
        stopButton.classList.remove('disabled');
        goodSceneButton.classList.remove('disabled');
        reviewSceneButton.classList.remove('disabled');
        badSceneButton.classList.remove('disabled');
        downloadReportBtn.classList.add('disabled');
    }
    // Após finalizar
    else {
        startButton.classList.remove('disabled');
        stopButton.classList.add('disabled');
        goodSceneButton.classList.add('disabled');
        reviewSceneButton.classList.add('disabled');
        badSceneButton.classList.add('disabled');
        
        // Habilita o botão de download se houver relatório
        const reportElement = document.getElementById('report');
        if (reportElement.innerText.trim() !== '') {
            downloadReportBtn.classList.remove('disabled');
        } else {
            downloadReportBtn.classList.add('disabled');
        }
    }
}

// Botão Iniciar
document.getElementById('startButton').addEventListener('click', () => {
    if (isRecording) return; // Previne múltiplos inícios
    
    startTime = Date.now();
    scenes.length = 0; // Limpa cenas anteriores
    isRecording = true;
    
    // Adiciona cena inicial
    scenes.push({ 
        start: 0, 
        end: null, 
        type: 'Gravando' 
    });
    
    timerInterval = setInterval(updateTimer, 1000);
    updateReport();
    updateButtonStates(); // Atualiza estado dos botões
});

// Botão Finalizar
document.getElementById('stopButton').addEventListener('click', () => {
    if (!startTime || !isRecording) return;
    
    clearInterval(timerInterval);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    
    // Finaliza a última cena
    if (scenes.length > 0) {
        const lastScene = scenes[scenes.length - 1];
        if (lastScene.end === null) {
            lastScene.end = elapsedTime;
        }
    }
    
    // Substitui a última cena por 'Finalizado'
    if (scenes.length > 0) {
        const lastScene = scenes[scenes.length - 1];
        lastScene.type = 'Finalizado';
    }
    
    isRecording = false;
    updateReport();
    updateButtonStates(); // Atualiza estado dos botões
    
    // Adiciona tempo total
    const reportElement = document.getElementById('report');
    reportElement.innerHTML += `\nTempo total: ${formatTime(elapsedTime)}.`;
    
    // Adiciona relatório detalhado
    const detailedReportHTML = generateDetailedReport();
    const detailedReportContainer = document.createElement('div');
    detailedReportContainer.innerHTML = detailedReportHTML;
    reportElement.appendChild(detailedReportContainer);
    
    // Rola a tela para o relatório
    const detailedReportElement = reportElement.querySelector('.mt-4');
    if (detailedReportElement) {
        detailedReportElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
});

// Função para registrar uma cena
function registerScene(type) {
    if (!startTime || !isRecording) return;
    
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    
    // Finaliza a última cena em aberto
    if (scenes.length > 0) {
        const lastScene = scenes[scenes.length - 1];
        if (lastScene.end === null) {
            lastScene.end = elapsedTime;
            
            // Atualiza o tipo da última cena
            lastScene.type = type;
        }
    }
    
    // Adiciona nova cena
    scenes.push({ 
        start: elapsedTime, 
        end: null, 
        type: type 
    });
    
    console.log('Cena registrada:', { 
        start: elapsedTime, 
        end: null, 
        type: type 
    });
    console.log('Cenas atuais:', scenes);
    
    updateReport();
}

// Botões de Cena
document.getElementById('goodSceneButton').addEventListener('click', () => registerScene('Cena Boa'));
document.getElementById('reviewSceneButton').addEventListener('click', () => registerScene('Cena Revisar'));
document.getElementById('badSceneButton').addEventListener('click', () => registerScene('Cena Ruim'));

// Função para gerar relatório detalhado
function generateDetailedReport() {
    console.log('Gerando relatório detalhado. Cenas:', scenes);

    const sceneTypes = {
        'Cena Boa': [],
        'Cena Revisar': [],
        'Cena Ruim': []
    };

    // Agrupa cenas por tipo
    scenes.forEach(scene => {
        console.log('Processando cena:', scene);
        
        // Verifica se a cena tem um tipo válido e foi completamente gravada
        if (scene.type in sceneTypes && scene.end !== null && scene.end !== undefined) {
            sceneTypes[scene.type].push({
                start: formatTime(scene.start),
                end: formatTime(scene.end)
            });
        }
    });

    console.log('Cenas agrupadas:', sceneTypes);

    // Constrói o relatório detalhado em HTML
    let detailedReport = `
    <div class="mt-4">
        <h4>Relatório Detalhado</h4>
        <table class="table table-striped table-bordered rounded">
            <thead class="thead-dark">
                <tr>
                    <th>Tipo de Cena</th>
                    <th>Início</th>
                    <th>Fim</th>
                </tr>
            </thead>
            <tbody>`;

    const colorClasses = {
        'Cena Boa': 'table-success',
        'Cena Revisar': 'table-warning',
        'Cena Ruim': 'table-danger'
    };

    let hasScenes = false;
    for (const [type, intervals] of Object.entries(sceneTypes)) {
        if (intervals.length > 0) {
            hasScenes = true;
            intervals.forEach((interval, index) => {
                detailedReport += `
                <tr class="${colorClasses[type]}">
                    <td>${type}</td>
                    <td>${interval.start}</td>
                    <td>${interval.end}</td>
                </tr>`;
            });
        }
    }

    // Se não houver cenas, adiciona uma linha informativa
    if (!hasScenes) {
        detailedReport += `
        <tr>
            <td colspan="3" class="text-center">Nenhuma cena registrada</td>
        </tr>`;
    }

    detailedReport += `
            </tbody>
        </table>
    </div>`;

    console.log('Relatório gerado:', detailedReport);

    return detailedReport;
}

// Função para baixar relatório
function downloadReport() {
    const reportElement = document.getElementById('report');
    const reportText = reportElement.innerText;
    
    // Cria um blob com o texto do relatório
    const blob = new Blob([reportText], { type: 'text/plain' });
    
    // Cria um link de download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'relatorio_scenesync.txt';
    
    // Adiciona o link ao documento, clica nele e remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Função de geração de relatório final
function generateReport() {
    console.log('Relatório final:', scenes);
}

// Chama updateButtonStates no carregamento da página
document.addEventListener('DOMContentLoaded', updateButtonStates);

// Adiciona evento de download do relatório
document.getElementById('downloadReportBtn').addEventListener('click', () => {
    const downloadButton = document.getElementById('downloadReportBtn');
    const reportElement = document.getElementById('report');
    
    // Só permite download se houver conteúdo no relatório
    if (reportElement.innerText.trim() !== '') {
        downloadReport();
    }
});
