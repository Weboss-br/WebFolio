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
document.getElementById('compoundInterestForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const principal = parseFloat(document.getElementById('compoundPrincipal').value);
    const rate = parseFloat(document.getElementById('compoundRate').value);
    const time = parseFloat(document.getElementById('compoundTime').value);
    const resultElement = document.getElementById('compoundInterestResult');
    
    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }
    
    const total = principal * Math.pow((1 + rate/100), time);
    const interest = total - principal;
    
    resultElement.textContent = `Juros: R$ ${interest.toFixed(2)} | Total: R$ ${total.toFixed(2)}`;
});

// Juros Mensais
document.getElementById('monthlyInterestForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const principal = parseFloat(document.getElementById('monthlyPrincipal').value);
    const rate = parseFloat(document.getElementById('monthlyRate').value);
    const resultElement = document.getElementById('monthlyInterestResult');
    
    if (isNaN(principal) || isNaN(rate)) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }
    
    const interest = (principal * rate) / 100;
    const total = principal + interest;
    
    resultElement.textContent = `Juros Mensais: R$ ${interest.toFixed(2)} | Total: R$ ${total.toFixed(2)}`;
});

// Juros Anuais
document.getElementById('yearlyInterestForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const principal = parseFloat(document.getElementById('yearlyPrincipal').value);
    const rate = parseFloat(document.getElementById('yearlyRate').value);
    const resultElement = document.getElementById('yearlyInterestResult');
    
    if (isNaN(principal) || isNaN(rate)) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }
    
    const interest = (principal * rate) / 100;
    const total = principal + interest;
    
    resultElement.textContent = `Juros Anuais: R$ ${interest.toFixed(2)} | Total: R$ ${total.toFixed(2)}`;
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

// Imposto
document.getElementById('taxForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const priceBeforeTax = parseFloat(document.getElementById('priceBeforeTax').value);
    const taxRate = parseFloat(document.getElementById('taxRate').value);
    const resultElement = document.getElementById('taxResult');
    
    if (isNaN(priceBeforeTax) || isNaN(taxRate)) {
        resultElement.textContent = 'Por favor, insira valores válidos.';
        return;
    }
    
    const taxAmount = (priceBeforeTax * taxRate) / 100;
    const totalPrice = priceBeforeTax + taxAmount;
    
    resultElement.textContent = `Imposto: R$ ${taxAmount.toFixed(2)} | Preço Total: R$ ${totalPrice.toFixed(2)}`;
});

// Função para calcular resultado de porcentagem
document.getElementById('percentageResultForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const valor1 = parseFloat(document.getElementById('valor1').value);
    const valor2 = parseFloat(document.getElementById('valor2').value);
    
    if (isNaN(valor1) || isNaN(valor2)) {
        document.getElementById('percentageResultCalc').innerHTML = 'Por favor, insira valores válidos.';
        return;
    }

    // Calcula a porcentagem que valor1 representa em relação a valor2
    const resultado = ((valor1 / valor2) * 100).toFixed(2);
    
    document.getElementById('percentageResultCalc').innerHTML = `
        ${valor1} representa ${resultado}% de ${valor2}
    `;
});
