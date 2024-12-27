document.addEventListener('DOMContentLoaded', () => {
    const sortearBtn = document.getElementById('sortearBtn');
    const numerosContainer = document.getElementById('numerosContainer');
    const numerosContainer2 = document.getElementById('numerosContainer2');
    const ultimoResultadoContainer = document.createElement('div');
    ultimoResultadoContainer.classList.add('mt-4', 'text-center');
    numerosContainer.parentNode.insertBefore(ultimoResultadoContainer, numerosContainer.nextSibling);

    // Botão de download
    const btnDownloadResultado = document.createElement('button');
    btnDownloadResultado.classList.add('btn', 'btn-secondary', 'mt-3');
    btnDownloadResultado.textContent = 'Baixar Resultado';
    btnDownloadResultado.style.display = 'none';
    ultimoResultadoContainer.appendChild(btnDownloadResultado);

    // Buscar último resultado da Mega-Sena
    fetch('https://loteriascaixa-api.herokuapp.com/api/megasena/latest')
        .then(response => response.json())
        .then(data => {
            const resultadoHTML = `
                <h4>Último Concurso: ${data.concurso}</h4>
                <hr class="my-3 border-primary">
                <p>Data: ${data.data}</p>
                <div class="d-flex justify-content-center mb-3">
                    ${data.dezenas.map(numero => 
                        `<span class="badge bg-info mx-2 fs-5">${numero}</span>`
                    ).join('')}
                </div>
                <p>Valor Estimado Próximo Concurso: R$ ${data.valorEstimadoProximoConcurso.toLocaleString('pt-BR')}</p>
                <p>Ganhadores 6 acertos: ${data.premiacoes[0].ganhadores}</p>
            `;
            ultimoResultadoContainer.innerHTML = resultadoHTML + ultimoResultadoContainer.innerHTML;

            // Ativar botão de download
            btnDownloadResultado.style.display = 'inline-block';
            btnDownloadResultado.addEventListener('click', () => {
                const dadosParaDownload = {
                    concurso: data.concurso,
                    data: data.data,
                    dezenas: data.dezenas,
                    valorEstimadoProximoConcurso: data.valorEstimadoProximoConcurso,
                    ganhadores: data.premiacoes[0].ganhadores
                };

                const blob = new Blob([JSON.stringify(dadosParaDownload, null, 2)], {type: 'application/json'});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `resultado_megasena_concurso_${data.concurso}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
        })
        .catch(error => {
            ultimoResultadoContainer.innerHTML = `<p class="text-danger">Erro ao carregar resultado: ${error.message}</p>`;
        });

    sortearBtn.addEventListener('click', () => {
        // Sortear 6 números únicos entre 01 e 60
        const numeros = new Set();
        while (numeros.size < 6) {
            // Gera número entre 1 e 60, adiciona zero à esquerda se < 10
            const numero = Math.floor(Math.random() * 60) + 1;
            numeros.add(numero.toString().padStart(2, '0'));
        }

        // Converte o Set para array e ordena
        const numerosOrdenados = Array.from(numeros).sort((a, b) => Number(a) - Number(b));

        // Atualiza os badges com os números sorteados
        const badges = numerosContainer2.querySelectorAll('.badge');
        numerosOrdenados.forEach((numero, index) => {
            badges[index].textContent = numero;
            badges[index].classList.remove('bg-secondary');
            badges[index].classList.add('bg-success');
        });

        // Rolar suavemente para o próximo container
        setTimeout(() => {
            ultimoResultadoContainer.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
        }, 200);
    });
});
