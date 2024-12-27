// Funções de cálculo para o Porcentômetro

// Porcentagem de um Número
document.getElementById('percentageForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const baseNumber = parseFloat(document.getElementById('baseNumber').value);
    const percentage = parseFloat(document.getElementById('percentageValue').value);
    const resultElement = document.getElementById('percentageResult');
    
    if (isNaN(baseNumber) || isNaN(percentage)) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }
    
    const result = (baseNumber * percentage) / 100;
    resultElement.textContent = `${percentage}% de ${baseNumber} = ${result.toFixed(2)}`;
});

// Variação Percentual
document.getElementById('percentageChangeForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const originalValue = parseFloat(document.getElementById('originalValue').value);
    const newValue = parseFloat(document.getElementById('newValue').value);
    const resultElement = document.getElementById('percentageChangeResult');
    
    if (isNaN(originalValue) || isNaN(newValue)) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }
    
    const percentageChange = ((newValue - originalValue) / originalValue) * 100;
    const changeType = percentageChange >= 0 ? 'aumento' : 'diminuição';
    
    resultElement.textContent = `Variação Percentual: ${Math.abs(percentageChange).toFixed(2)}% (${changeType})`;
});

// Juros Simples
document.getElementById('simpleInterestForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const principal = parseFloat(document.getElementById('principalAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value);
    const time = parseFloat(document.getElementById('timePeriod').value);
    const resultElement = document.getElementById('simpleInterestResult');
    
    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }
    
    const interest = (principal * rate * time) / 100;
    const total = principal + interest;
    
    resultElement.textContent = `Juros: R$ ${interest.toFixed(2)} | Total: R$ ${total.toFixed(2)}`;
});

// Juros Compostos
document.getElementById('compoundInterestForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar os valores do formulário
    const principal = parseFloat(document.getElementById('compoundPrincipal').value);
    const rate = parseFloat(document.getElementById('compoundRate').value) / 100; // Converter taxa para decimal
    const time = parseFloat(document.getElementById('compoundTime').value); // Tempo em anos
    const frequency = parseInt(document.getElementById('compoundFrequency').value, 10); // Frequência de composição por ano

    const resultElement = document.getElementById('compoundInterestResult');

    // Validação de entradas
    if (isNaN(principal) || isNaN(rate) || isNaN(time) || isNaN(frequency) || principal <= 0 || rate <= 0 || time <= 0 || frequency <= 0) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }

    // Cálculo de juros compostos
    const totalAmount = principal * Math.pow((1 + rate / frequency), frequency * time);
    const totalInterest = totalAmount - principal;

    // Exibir resultados no mini relatório
    resultElement.innerHTML = `
        <h4>Relatório do Cálculo</h4>
        <p><strong>Valor Inicial:</strong> R$ ${principal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Ganho em Juros:</strong> R$ ${totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Valor Final Total:</strong> R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    `;
});


// Valor Futuro com Depósitos Regulares
document.getElementById('futureValueForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar valores do formulário
    const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    const monthlyDeposit = parseFloat(document.getElementById('monthlyDeposit').value);
    const monthlyRate = parseFloat(document.getElementById('monthlyRate').value) / 100; // Converter para decimal
    const months = parseInt(document.getElementById('investmentPeriod').value, 10);

    const resultElement = document.getElementById('futureValueResult');

    // Validar entradas
    if (isNaN(initialInvestment) || isNaN(monthlyDeposit) || isNaN(monthlyRate) || isNaN(months) || initialInvestment < 0 || monthlyDeposit < 0 || monthlyRate < 0 || months <= 0) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }

    // Cálculo do valor futuro
    let futureValue = initialInvestment * Math.pow((1 + monthlyRate), months); // Crescimento do valor inicial
    let totalDeposits = initialInvestment; // Valor inicial já conta como depósito total
    for (let i = 1; i <= months; i++) {
        totalDeposits += monthlyDeposit; // Acumular depósitos
        futureValue += monthlyDeposit * Math.pow((1 + monthlyRate), (months - i)); // Somar os depósitos mensais com crescimento
    }

    const totalGains = futureValue - totalDeposits; // Ganho total em juros

    // Exibir resultados no mini relatório
    resultElement.innerHTML = `
        <h4>Relatório do Investimento</h4>
        <p><strong>Valor Inicial:</strong> R$ ${initialInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Depósitos Totais:</strong> R$ ${(totalDeposits - initialInvestment).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Ganho em Juros:</strong> R$ ${totalGains.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Valor Futuro Total:</strong> R$ ${futureValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    `;
});



// Desconto
document.getElementById('discountForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const originalPrice = parseFloat(document.getElementById('originalPrice').value);
    const discountPercentage = parseFloat(document.getElementById('discountPercentage').value);
    const resultElement = document.getElementById('discountResult');
    
    if (isNaN(originalPrice) || isNaN(discountPercentage)) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }
    
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const finalPrice = originalPrice - discountAmount;
    
    resultElement.textContent = `Desconto: R$ ${discountAmount.toFixed(2)} | Preço Final: R$ ${finalPrice.toFixed(2)}`;
});

// Cálculo de Margem de Lucro
document.getElementById('profitMarginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar valores do formulário
    const productCost = parseFloat(document.getElementById('productCost').value);
    const profitMargin = parseFloat(document.getElementById('profitMargin').value) / 100; // Converter para decimal

    const resultElement = document.getElementById('profitMarginResult');

    // Validar entradas
    if (isNaN(productCost) || isNaN(profitMargin) || productCost <= 0 || profitMargin < 0) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }

    // Cálculo do preço de venda
    const sellingPrice = productCost * (1 + profitMargin);

    // Exibir resultado
    resultElement.innerHTML = `
        <h4>Resultado</h4>
        <p><strong>Preço de Venda:</strong> R$ ${sellingPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Custo do Produto:</strong> R$ ${productCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Margem de Lucro:</strong> ${(profitMargin * 100).toFixed(2)}%</p>
    `;
});


// Margem de Lucro Composta
document.getElementById('compositeProfitMarginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar valores do formulário
    const productCost = parseFloat(document.getElementById('compositeProductCost').value);
    const profitMargin = parseFloat(document.getElementById('compositeProfitMargin').value) / 100; // Converter para decimal
    const costMargin = parseFloat(document.getElementById('compositeCostMargin').value) / 100 || 0; // Converter para decimal ou usar 0
    const additionalValue = parseFloat(document.getElementById('compositeAdditionalValue').value) || 0; // Usar 0 se estiver vazio

    const resultElement = document.getElementById('compositeProfitMarginResult');

    // Validar entradas
    if (isNaN(productCost) || isNaN(profitMargin) || productCost <= 0 || profitMargin < 0 || costMargin < 0 || additionalValue < 0) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }

    // Cálculo do preço de venda
    const adjustedCost = productCost * (1 + costMargin); // Custo ajustado com margem de custos/impostos
    const sellingPrice = adjustedCost * (1 + profitMargin) + additionalValue; // Preço com margem de lucro e valor adicional

    // Exibir resultado
    resultElement.innerHTML = `
        <h4>Resultado</h4>
        <p><strong>Custo do Produto:</strong> R$ ${productCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Margem de Lucro:</strong> ${(profitMargin * 100).toFixed(2)}%</p>
        <p><strong>Margem de Custos/Impostos:</strong> ${(costMargin * 100).toFixed(2)}%</p>
        <p><strong>Valor Bruto Adicional:</strong> R$ ${additionalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
         <p><strong>Preço de Venda:</strong> R$ ${sellingPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    `;
});

// Cálculo de Valorização/Desvalorização Percentual
document.getElementById('valueChangeForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar valores do formulário
    const originalValue = parseFloat(document.getElementById('originalValueChange').value);
    const currentValue = parseFloat(document.getElementById('currentValueChange').value);

    const resultElement = document.getElementById('valueChangeResult');

    // Validar entradas
    if (isNaN(originalValue) || isNaN(currentValue) || originalValue <= 0 || currentValue < 0) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }

    // Determinar tipo de variação
    let changeType, percentageChange;

    if (currentValue > originalValue) {
        changeType = 'Valorização';
        percentageChange = ((currentValue - originalValue) / originalValue) * 100;
    } else if (currentValue < originalValue) {
        changeType = 'Desvalorização';
        percentageChange = ((originalValue - currentValue) / originalValue) * 100;
    } else {
        changeType = 'Nenhuma alteração';
        percentageChange = 0;
    }

    // Exibir resultado
    resultElement.innerHTML = `
        <h4>Resultado</h4>
        <p><strong>Valor Original:</strong> R$ ${originalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Valor Atual:</strong> R$ ${currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>${changeType}:</strong> ${percentageChange.toFixed(2)}%</p>
    `;
});

// Conversão de Taxa Anual para Mensal (e vice-versa)
document.getElementById('rateConversionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Captura os valores do formulário
    const annualRate = parseFloat(document.getElementById('annualRate').value);
    const conversionType = document.getElementById('conversionPeriod').value; // 'mensal' ou 'anual'
    const resultElement = document.getElementById('rateConversionResult');

    // Valida as entradas
    if (isNaN(annualRate) || annualRate <= 0) {
        resultElement.textContent = 'Por favor, insira uma taxa anual válida.';
        return;
    }

    let convertedRate;
    if (conversionType === 'mensal') {
        // Converter de Anual para Mensal
        convertedRate = (Math.pow(1 + annualRate / 100, 1 / 12) - 1) * 100;
        resultElement.innerHTML = `
            <h4>Resultado</h4>
            <p><strong>Taxa Anual:</strong> ${annualRate.toFixed(2)}%</p>
            <p><strong>Taxa Mensal Equivalente:</strong> ${convertedRate.toFixed(4)}%</p>
        `;
    } else if (conversionType === 'anual') {
        // Converter de Mensal para Anual
        convertedRate = (Math.pow(1 + annualRate / 100, 12) - 1) * 100;
        resultElement.innerHTML = `
            <h4>Resultado</h4>
            <p><strong>Taxa Mensal:</strong> ${annualRate.toFixed(2)}%</p>
            <p><strong>Taxa Anual Equivalente:</strong> ${convertedRate.toFixed(2)}%</p>
        `;
    }
});


//Calculadora de Divisão Proporcional
document.getElementById('proportionalDivisionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar os valores do formulário
    const totalValue = parseFloat(document.getElementById('totalValue').value);
    const rawWeights = document.getElementById('weights').value;

    const resultElement = document.getElementById('proportionalDivisionResult');

    // Validar entradas
    if (isNaN(totalValue) || totalValue <= 0 || !rawWeights.trim()) {
        resultElement.innerHTML = '<p class="text-danger">Por favor, insira um valor total válido e pesos proporcionais.</p>';
        return;
    }

    // Processar os pesos
    const weights = rawWeights
        .split(',')
        .map(weight => parseFloat(weight.trim()))
        .filter(weight => !isNaN(weight) && weight > 0);

    if (weights.length === 0) {
        resultElement.innerHTML = '<p class="text-danger">Por favor, insira pesos proporcionais válidos.</p>';
        return;
    }

    // Calcular o total dos pesos
    const totalWeights = weights.reduce((sum, weight) => sum + weight, 0);

    // Calcular as divisões proporcionais
    const results = weights.map(weight => (weight / totalWeights) * totalValue);

    // Gerar o relatório com estilo padrão
    let resultHTML = `
        <h4 class="text-light">Resultado</h4> <!-- Título do resultado em branco -->
        <p><strong>Valor Total:</strong> R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Divisão Proporcional:</strong></p>
        <ul class="list-unstyled">
    `;
    results.forEach((value, index) => {
        resultHTML += `<li><strong>Parte ${index + 1}:</strong> R$ ${value.toFixed(2)}</li>`;
    });
    resultHTML += '</ul>';

    // Exibir o resultado
    resultElement.innerHTML = resultHTML;
});



// Calculadora de ROI
document.getElementById('roiForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Capturar os valores do formulário
    const gain = parseFloat(document.getElementById('gain').value);
    const cost = parseFloat(document.getElementById('cost').value);
    const resultElement = document.getElementById('roiResult');

    // Validar entradas
    if (isNaN(gain) || gain <= 0 || isNaN(cost) || cost <= 0) {
        resultElement.innerHTML = '<p class="text-danger">Por favor, insira valores válidos para ganhos e custos.</p>';
        return;
    }

    // Calcular o ROI
    const roi = ((gain - cost) / cost) * 100;

    // Gerar o resultado
    resultElement.innerHTML = `
        <h4 class="text-light">Resultado</h4> <!-- Título do resultado em branco -->
        <p><strong>Ganhos:</strong> R$ ${gain.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>Custos:</strong> R$ ${cost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p><strong>ROI:</strong> ${roi.toFixed(2)}%</p>
    `;
});
