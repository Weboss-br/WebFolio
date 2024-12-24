document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('salaryForm');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultContainer = document.getElementById('resultContainer');
    const additionalInfoContainer = document.getElementById('additionalInfoContainer');
    const employerCostsContainer = document.getElementById('employerCostsContainer');
    const taxesContainer = document.getElementById('taxesContainer');
    const employerTotalCostsContainer = document.getElementById('employerTotalCostsContainer');
    const taxesBreakdownContainer = document.getElementById('taxesBreakdownContainer');

    // Elementos de resultado
    const monthlyHoursEl = document.getElementById('monthlyHours');
    const hourlyRateEl = document.getElementById('hourlyRate');
    const annualSalaryEl = document.getElementById('annualSalary');
    const additionalInfoEl = document.getElementById('additionalInfo');

    // Constantes de impostos (estimativa simplificada)
    const INSS_RATE = 0.11; // 11% de contribuição previdenciária
    const FGTS_RATE = 0.08; // 8% de FGTS
    const OUTRAS_CONTRIBUICOES = 0.20; // Outras contribuições estimadas em 20%
    const IR_RATES = [
        { min: 0, max: 1903.98, rate: 0 },
        { min: 1903.99, max: 2826.65, rate: 0.075 },
        { min: 2826.66, max: 3751.05, rate: 0.15 },
        { min: 3751.06, max: 4664.68, rate: 0.225 },
        { min: 4664.69, max: Infinity, rate: 0.275 }
    ];

    // Função para formatar moeda brasileira
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // Validação do formulário
    function validateForm() {
        let isValid = form.checkValidity();
        form.classList.add('was-validated');

        // Validação customizada para horários
        const startMorning = document.getElementById('startMorning').value;
        const endMorning = document.getElementById('endMorning').value;
        const startAfternoon = document.getElementById('startAfternoon').value;
        const endAfternoon = document.getElementById('endAfternoon').value;

        if (convertTimeToMinutes(startMorning) >= convertTimeToMinutes(endMorning)) {
            alert('Horário de início da manhã deve ser menor que o horário de fim da manhã.');
            isValid = false;
        }

        if (convertTimeToMinutes(startAfternoon) >= convertTimeToMinutes(endAfternoon)) {
            alert('Horário de início da tarde deve ser menor que o horário de fim da tarde.');
            isValid = false;
        }

        return isValid;
    }

    // Calcular imposto de renda
    function calculateIncomeTax(salary) {
        const taxableIncome = salary;
        let totalTax = 0;

        for (const bracket of IR_RATES) {
            if (taxableIncome > bracket.min) {
                const taxablePart = Math.min(taxableIncome, bracket.max) - bracket.min;
                totalTax += taxablePart * bracket.rate;
            }
        }

        return totalTax;
    }

    calculateBtn.addEventListener('click', () => {
        if (!validateForm()) return;

        const salary = parseFloat(document.getElementById('salary').value);
        const startMorning = document.getElementById('startMorning').value;
        const endMorning = document.getElementById('endMorning').value;
        const startAfternoon = document.getElementById('startAfternoon').value;
        const endAfternoon = document.getElementById('endAfternoon').value;
        const workDays = parseInt(document.getElementById('workDays').value);

        // Converte horários para minutos
        const startMorningMinutes = convertTimeToMinutes(startMorning);
        const endMorningMinutes = convertTimeToMinutes(endMorning);
        const startAfternoonMinutes = convertTimeToMinutes(startAfternoon);
        const endAfternoonMinutes = convertTimeToMinutes(endAfternoon);

        // Calcula tempo total trabalhado em minutos por dia
        const morningShiftMinutes = endMorningMinutes - startMorningMinutes;
        const afternoonShiftMinutes = endAfternoonMinutes - startAfternoonMinutes;
        const totalMinutesPerDay = morningShiftMinutes + afternoonShiftMinutes;

        // Calcula tempo total trabalhado em horas por mês
        const totalHoursPerMonth = (totalMinutesPerDay / 60) * workDays;
        const totalMinutesPerMonth = totalMinutesPerDay * workDays;

        // Calcula ganhos por hora e por ano
        const hourlyRate = salary / totalHoursPerMonth;
        const minuteRate = salary / (totalMinutesPerMonth);
        const annualSalary = salary * 12;

        // Calcula impostos
        const inssContribution = salary * INSS_RATE;
        const incomeTax = calculateIncomeTax(salary);
        const totalTaxes = inssContribution + incomeTax;

        // Calcula horas necessárias para ganhar R$ 500 e R$ 1 milhão
        const hoursTo500 = 500 / hourlyRate;
        const daysTo500 = hoursTo500 / (totalHoursPerMonth / workDays);
        const hoursToMillion = 1000000 / (hourlyRate * 12);
        const daysToMillion = hoursToMillion / (totalHoursPerMonth / workDays);
        const calendarDaysToMillion = hoursToMillion / 8; // Considerando 8h por dia

        // Exibe os resultados
        monthlyHoursEl.textContent = `${totalHoursPerMonth.toFixed(2)} h`;
        hourlyRateEl.textContent = formatCurrency(hourlyRate);
        annualSalaryEl.textContent = formatCurrency(annualSalary);

        // Adiciona informações de custos do empregador
        const employerTotalCost = salary * (1 + FGTS_RATE + OUTRAS_CONTRIBUICOES);
        const additionalCosts = employerTotalCost - salary;

        employerCostsContainer.innerHTML = `
            <p>💼 Custo total para o empregador:</p>
            <ul>
                <li>Salário Base: <strong>${formatCurrency(salary)}</strong></li>
                <li>FGTS (8%): <strong>${formatCurrency(salary * FGTS_RATE)}</strong></li>
                <li>Outras Contribuições (20%): <strong>${formatCurrency(salary * OUTRAS_CONTRIBUICOES)}</strong></li>
                <li>Custo Total: <strong>${formatCurrency(employerTotalCost)}</strong></li>
                <li>Custos Adicionais: <strong>${formatCurrency(additionalCosts)}</strong></li>
            </ul>
            <p>📊 O custo real para o empregador é <strong>${((additionalCosts / salary) * 100).toFixed(1)}%</strong> maior que seu salário base.</p>
        `;

        // Separa os impostos para o segundo card
        taxesContainer.innerHTML = `
            <p>💸 Detalhamento de Impostos:</p>
            <ul>
                <li>INSS (11%): <strong>${formatCurrency(inssContribution)}</strong></li>
                <li>Imposto de Renda: <strong>${formatCurrency(incomeTax)}</strong></li>
                <li>Total de Impostos: <strong>${formatCurrency(totalTaxes)}</strong></li>
                <li>Impacto Total: <strong>${((totalTaxes / salary) * 100).toFixed(1)}%</strong> do salário</li>
            </ul>
            <p>💰 Salário Líquido: <strong>${formatCurrency(salary - totalTaxes)}</strong></p>
        `;

        // Adiciona informações extras
        additionalInfoEl.innerHTML = `
            <p>🕒 Para ganhar R$ 500 você precisa trabalhar: <strong>${hoursTo500.toFixed(2)} horas</strong> 
            (isso dá cerca de <strong>${daysTo500.toFixed(1)} dias trabalhados</strong>)</p>
            <p>💰 Para ganhar R$ 1 milhão, você precisará trabalhar: 
                <strong>${hoursToMillion.toFixed(2)} horas</strong>
                (cerca de <strong>${daysToMillion.toFixed(0)} dias úteis</strong> 
                ou <strong>${Math.ceil(calendarDaysToMillion)} dias corridos</strong>)
            </p>
            <p>⏱️ Seu minuto vale: <strong>${formatCurrency(minuteRate)}</strong></p>
            <p>💸 Impostos estimados (mensais):</p>
            <ul>
                <li>INSS (11%): <strong>${formatCurrency(inssContribution)}</strong></li>
                <li>Imposto de Renda: <strong>${formatCurrency(incomeTax)}</strong></li>
                <li>Total de Impostos: <strong>${formatCurrency(totalTaxes)}</strong></li>
            </ul>
        `;

        // Mostra o container de resultados
        resultContainer.style.display = 'block';
        additionalInfoContainer.style.display = 'block';
        employerCostsContainer.style.display = 'block';
        taxesContainer.style.display = 'block';

        // Rola suavemente para o resultado
        resultContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    });

    function convertTimeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
});
