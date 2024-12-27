document.addEventListener('DOMContentLoaded', () => {
    const sortearBtn = document.getElementById('sortearBtn');
    const numerosContainer = document.getElementById('numerosContainer');
    const numerosContainer2 = document.getElementById('numerosContainer2');
    const ultimoResultadoContainer = document.createElement('div');
    ultimoResultadoContainer.classList.add('mt-4', 'text-center');
    numerosContainer.parentNode.insertBefore(ultimoResultadoContainer, numerosContainer.nextSibling);

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
            ultimoResultadoContainer.innerHTML = resultadoHTML;
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
    });
});
