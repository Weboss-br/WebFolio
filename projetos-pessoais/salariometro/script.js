document.addEventListener('DOMContentLoaded', () => {
    console.log("Script e DOM carregados!");

    const calculateBtn = document.getElementById('calculateBtn');
    const monthlyHoursEl = document.getElementById('monthlyHours');
    const hourlyRateEl = document.getElementById('hourlyRate');
    const annualSalaryEl = document.getElementById('annualSalary');
    const additionalInfoEl = document.getElementById('additionalInfo');
    const resultContainer = document.getElementById('resultContainer');
    const additionalInfoContainer = document.getElementById('additionalInfoContainer');

    if (!calculateBtn) {
        console.error("Botão 'Calcular Rendimentos' não encontrado!");
        return;
    }

    const INSS_RATE = 0.11; // INSS padrão
    const minimumWage = 1320; // Salário mínimo atual no Brasil (2024)

    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    calculateBtn.addEventListener('click', () => {
        console.log("Botão clicado!");

        const salary = parseFloat(document.getElementById('salary').value || 0);
        const benefits = parseFloat(document.getElementById('benefits').value || 0);
        const workDays = parseInt(document.getElementById('workDays').value || 0);

        if (isNaN(salary) || salary <= 0 || isNaN(workDays) || workDays <= 0) {
            alert("Por favor, insira valores válidos para salário e dias úteis.");
            return;
        }

        const totalHoursPerMonth = 8 * workDays;
        const hourlyRate = salary / totalHoursPerMonth;
        const annualSalary = salary * 12;
        const inssContribution = salary * INSS_RATE;
        const netSalary = salary - inssContribution;
        const totalEmployerCost = salary + benefits + (salary * 0.2) + (salary * 0.08);

        monthlyHoursEl.textContent = `${totalHoursPerMonth.toFixed(2)} h`;
        hourlyRateEl.textContent = formatCurrency(hourlyRate);
        annualSalaryEl.textContent = formatCurrency(annualSalary);

        document.getElementById('grossSalary').textContent = formatCurrency(salary + benefits);
        document.getElementById('netSalary').textContent = formatCurrency(netSalary);

        additionalInfoEl.innerHTML = `
            <p>🏢 Custo Total para o Empregador: <strong>${formatCurrency(totalEmployerCost)}</strong></p>
            <ul>
                <li>INSS (11%): <strong>${formatCurrency(inssContribution)}</strong></li>
                <li>Benefícios: <strong>${formatCurrency(benefits)}</strong></li>
                <li>FGTS (8%): <strong>${formatCurrency(salary * 0.08)}</strong></li>
                <li>INSS Patronal (20%): <strong>${formatCurrency(salary * 0.2)}</strong></li>
            </ul>
            <p><strong>Valor total de Imposto: ${formatCurrency(inssContribution + salary * 0.2)}</strong></p>
        `;

        resultContainer.style.display = 'block';
        additionalInfoContainer.style.display = 'block';

        // Rolar a página para mostrar os resultados
        const resultContainerElement = document.getElementById('resultContainer');
        resultContainerElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    });
});