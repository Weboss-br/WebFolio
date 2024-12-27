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

    // Tabela de Imposto de Renda 2024 (valores em R$)
    // IMPORTANTE: Esta é a tabela de IRRF (Imposto de Renda Retido na Fonte) - Cálculo Mensal
    // Aplica-se diretamente no salário mensal, com alíquotas progressivas e deduções específicas
    const irRanges = [
        { min: 0, max: 2112.00, rate: 0, deduction: 0 },
        { min: 2112.01, max: 2826.65, rate: 0.075, deduction: 158.40 },
        { min: 2826.66, max: 3751.05, rate: 0.15, deduction: 370.40 },
        { min: 3751.06, max: 4664.68, rate: 0.225, deduction: 661.75 },
        { min: 4664.69, max: Infinity, rate: 0.275, deduction: 1192.25 }
    ];

    // Tabela de Imposto de Renda para Declaração Anual 2024 (valores em R$)
    const irAnnualRanges = [
        { min: 0, max: 22847.76, rate: 0, deduction: 0 },
        { min: 22847.77, max: 33919.80, rate: 0.075, deduction: 1713.58 },
        { min: 33919.81, max: 45012.60, rate: 0.15, deduction: 4257.57 },
        { min: 45012.61, max: 55976.16, rate: 0.225, deduction: 7633.51 },
        { min: 55976.17, max: Infinity, rate: 0.275, deduction: 10432.32 }
    ];

    // Função para calcular o Imposto de Renda Retido na Fonte (IRRF)
    // Calcula o IR com base no salário mensal, considerando:
    // 1. Desconto prévio do INSS
    // 2. Tabela progressiva de alíquotas
    // 3. Deduções específicas para cada faixa de renda
    function calculateIR(salary) {
        const irCalculation = irRanges.find(range => 
            salary >= range.min && salary <= range.max
        );

        if (!irCalculation) return 0;

        // Base de cálculo: salário após desconto do INSS
        const taxableBase = salary - INSS_RATE * salary;
        const irValue = (taxableBase * irCalculation.rate) - irCalculation.deduction;
        return Math.max(irValue, 0);
    }

    // Função para calcular o Imposto de Renda Anual (Declaração de Ajuste)
    function calculateAnnualIR(annualSalary) {
        const irCalculation = irAnnualRanges.find(range => 
            annualSalary >= range.min && annualSalary <= range.max
        );

        if (!irCalculation) return 0;

        // Cálculo do IR anual considera a base de cálculo total do ano
        const irValue = (annualSalary * irCalculation.rate) - irCalculation.deduction;
        return Math.max(irValue, 0);
    }

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
        const irContribution = calculateIR(salary);
        const netSalary = salary - inssContribution - irContribution;
        const totalEmployerCost = salary + benefits + (salary * 0.2) + (salary * 0.08);

        monthlyHoursEl.textContent = `${totalHoursPerMonth.toFixed(2)} h`;
        hourlyRateEl.textContent = formatCurrency(hourlyRate);
        annualSalaryEl.textContent = formatCurrency(annualSalary);

        document.getElementById('grossSalary').textContent = formatCurrency(salary + benefits);
        document.getElementById('netSalary').textContent = formatCurrency(netSalary);
        document.getElementById('employerCost').textContent = formatCurrency(totalEmployerCost);
        
        const totalMonthlyTaxes = inssContribution + irContribution + salary * 0.2;
        const totalAnnualTaxes = totalMonthlyTaxes * 13;
        
        document.getElementById('totalTaxes').innerHTML = 
            `${formatCurrency(totalMonthlyTaxes)} Mensal\n😱 ${formatCurrency(totalAnnualTaxes)} Anual`;

        additionalInfoEl.innerHTML = `
            <ul>
                <li>INSS (11%): <strong>${formatCurrency(inssContribution)}</strong></li>
                <li>Imposto de Renda: <strong>${formatCurrency(irContribution)}</strong></li>
                <li>Benefícios: <strong>${formatCurrency(benefits)}</strong></li>
                <li>FGTS (8%): <strong>${formatCurrency(salary * 0.08)}</strong></li>
                <li>INSS Patronal (20%): <strong>${formatCurrency(salary * 0.2)}</strong></li>
            </ul>
        `;

        // Exemplo de uso para demonstração
        function demonstrateAnnualIRCalculation(monthlySalary) {
            const annualSalary = monthlySalary * 12;
            const annualIR = calculateAnnualIR(annualSalary);
            const totalMonthlyIR = calculateIR(monthlySalary) * 12;

            additionalInfoEl.innerHTML += `
                <hr>
                <h6>📊 Comparação IR Mensal vs Anual</h6>
                <p>Total IR Mensal (12 meses): <strong>${formatCurrency(totalMonthlyIR)}</strong></p>
                <p>IR Anual (Declaração de Ajuste): <strong>${formatCurrency(annualIR)}</strong></p>
                <p>💡 Diferença: <strong>${formatCurrency(Math.abs(annualIR - totalMonthlyIR))}</strong></p>
                <small>Nota: Os valores podem variar dependendo de deduções específicas não consideradas neste cálculo.</small>
            `;
        }

        demonstrateAnnualIRCalculation(salary);

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