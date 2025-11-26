const { ipcRenderer } = require('electron');

// State
let userNumbers = [];
let maxCombinations = 0;
let generatedGames = [];
let gameSize = 6; // Default to 6 numbers per game

// DOM Elements
const numbersInput = document.getElementById('numbersInput');
const quantityInput = document.getElementById('quantityInput');
const generateBtn = document.getElementById('generateBtn');
const inputFeedback = document.getElementById('inputFeedback');
const maxCombinationsEl = document.getElementById('maxCombinations');
const resultsSection = document.getElementById('resultsSection');
const resultsInfo = document.getElementById('resultsInfo');
const resultsContainer = document.getElementById('resultsContainer');
const exportBtn = document.getElementById('exportBtn');
const printBtn = document.getElementById('printBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const gameSizeRadios = document.querySelectorAll('input[name="gameSize"]');

// Event Listeners
numbersInput.addEventListener('input', handleNumbersInput);
quantityInput.addEventListener('input', handleQuantityInput);
generateBtn.addEventListener('click', generateCombinations);
exportBtn.addEventListener('click', exportToCSV);
printBtn.addEventListener('click', printResults);
gameSizeRadios.forEach(radio => {
  radio.addEventListener('change', handleGameSizeChange);
});

// Validate and parse numbers input
function handleNumbersInput() {
  const input = numbersInput.value.trim();

  if (!input) {
    userNumbers = [];
    showFeedback('', '');
    updateGenerateButton();
    return;
  }

  // Parse numbers from input (comma or space separated)
  const numbers = input
    .split(/[\s,]+/)
    .map(n => n.trim())
    .filter(n => n !== '')
    .map(n => parseInt(n, 10));

  // Validate numbers
  const errors = [];
  const validNumbers = [];
  const seen = new Set();

  numbers.forEach(num => {
    if (isNaN(num)) {
      errors.push(`"${num}" não é um número válido`);
    } else if (num < 1 || num > 60) {
      errors.push(`${num} está fora do intervalo (1-60)`);
    } else if (seen.has(num)) {
      errors.push(`${num} está duplicado`);
    } else {
      validNumbers.push(num);
      seen.add(num);
    }
  });

  userNumbers = validNumbers.sort((a, b) => a - b);

  // Show feedback
  if (errors.length > 0) {
    showFeedback(errors.join(', '), 'error');
  } else if (validNumbers.length < 6) {
    showFeedback(`✓ ${validNumbers.length} números válidos. Mínimo necessário: 6 números`, 'warning');
  } else if (validNumbers.length > 20) {
    showFeedback(`⚠️ ${validNumbers.length} números (máximo recomendado: 20). Isso pode gerar muitas combinações!`, 'warning');
  } else {
    showFeedback(`✓ ${validNumbers.length} números válidos`, 'success');
  }

  // Calculate max combinations
  const minRequired = gameSize;
  if (validNumbers.length >= minRequired) {
    maxCombinations = calculateCombinations(validNumbers.length, gameSize);
    maxCombinationsEl.textContent = `Máximo de combinações possíveis (${gameSize} números): ${maxCombinations.toLocaleString('pt-BR')}`;

    // Update quantity input max
    quantityInput.max = maxCombinations;

    // Adjust quantity if it exceeds max
    if (parseInt(quantityInput.value) > maxCombinations) {
      quantityInput.value = maxCombinations;
    }
  } else {
    maxCombinationsEl.textContent = '';
  }

  updateGenerateButton();
}

function handleQuantityInput() {
  const quantity = parseInt(quantityInput.value);

  if (quantity > maxCombinations && maxCombinations > 0) {
    quantityInput.value = maxCombinations;
    showFeedback(`Quantidade ajustada para o máximo possível: ${maxCombinations.toLocaleString('pt-BR')}`, 'warning');
  }
}

function handleGameSizeChange(event) {
  gameSize = parseInt(event.target.value);
  // Recalculate combinations with new game size
  handleNumbersInput();
}

function showFeedback(message, type) {
  if (!message) {
    inputFeedback.className = 'input-feedback';
    inputFeedback.textContent = '';
    return;
  }

  inputFeedback.className = `input-feedback show ${type}`;
  inputFeedback.textContent = message;
}

function updateGenerateButton() {
  const isValid = userNumbers.length >= 6 && parseInt(quantityInput.value) > 0;
  generateBtn.disabled = !isValid;
}

// Calculate binomial coefficient C(n, k)
function calculateCombinations(n, k) {
  if (k > n) return 0;
  if (k === 0 || k === n) return 1;

  // Use the multiplicative formula to avoid overflow
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = result * (n - k + i) / i;
  }

  return Math.round(result);
}

// Generate all combinations of k elements from array
function* combinationsGenerator(array, k) {
  const n = array.length;

  if (k > n || k <= 0) return;
  if (k === n) {
    yield array.slice();
    return;
  }

  // Use indices for combination generation
  const indices = Array.from({ length: k }, (_, i) => i);

  yield indices.map(i => array[i]);

  while (true) {
    let i;
    for (i = k - 1; i >= 0; i--) {
      if (indices[i] !== i + n - k) {
        break;
      }
    }

    if (i < 0) return;

    indices[i]++;
    for (let j = i + 1; j < k; j++) {
      indices[j] = indices[j - 1] + 1;
    }

    yield indices.map(idx => array[idx]);
  }
}

// Generate combinations
async function generateCombinations() {
  const quantity = parseInt(quantityInput.value);

  if (userNumbers.length < 6) {
    showFeedback('É necessário pelo menos 6 números válidos', 'error');
    return;
  }

  // Show loading
  loadingOverlay.classList.remove('hidden');

  // Small delay to allow UI to update
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    generatedGames = [];

    if (quantity >= maxCombinations) {
      // Generate all combinations
      const generator = combinationsGenerator(userNumbers, gameSize);
      for (const combination of generator) {
        generatedGames.push(combination);
      }
    } else {
      // Generate random sample
      // First, generate all possible combinations
      const allCombinations = [];
      const generator = combinationsGenerator(userNumbers, gameSize);
      for (const combination of generator) {
        allCombinations.push(combination);
      }

      // Randomly select the requested quantity
      const selected = new Set();
      while (selected.size < quantity && selected.size < allCombinations.length) {
        const randomIndex = Math.floor(Math.random() * allCombinations.length);
        selected.add(randomIndex);
      }

      generatedGames = Array.from(selected).map(idx => allCombinations[idx]);
    }

    displayResults();
  } catch (error) {
    console.error('Error generating combinations:', error);
    showFeedback('Erro ao gerar combinações. Tente novamente.', 'error');
  } finally {
    loadingOverlay.classList.add('hidden');
  }
}

// Display results
function displayResults() {
  resultsSection.classList.remove('hidden');

  resultsInfo.innerHTML = `
        <strong>📊 Estatísticas:</strong><br>
        Números base: ${userNumbers.join(', ')}<br>
        Números por jogo: ${gameSize}<br>
        Total de jogos gerados: ${generatedGames.length.toLocaleString('pt-BR')}<br>
        Combinações possíveis: ${maxCombinations.toLocaleString('pt-BR')}
    `;

  resultsContainer.innerHTML = '';

  generatedGames.forEach((game, index) => {
    const gameCard = document.createElement('div');
    gameCard.className = 'game-card';

    const gameNumber = document.createElement('div');
    gameNumber.className = 'game-number';
    gameNumber.textContent = `Jogo ${index + 1}:`;

    const gameNumbers = document.createElement('div');
    gameNumbers.className = 'game-numbers';

    game.forEach(num => {
      const numberEl = document.createElement('div');
      numberEl.className = 'lottery-number';
      numberEl.textContent = num.toString().padStart(2, '0');
      gameNumbers.appendChild(numberEl);
    });

    gameCard.appendChild(gameNumber);
    gameCard.appendChild(gameNumbers);
    resultsContainer.appendChild(gameCard);
  });

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Export to CSV
async function exportToCSV() {
  if (generatedGames.length === 0) return;

  // Create CSV content - only the numbers, no "Jogo" column
  let csv = '';

  generatedGames.forEach((game) => {
    const formattedNumbers = game.map(n => n.toString().padStart(2, '0'));
    csv += `${formattedNumbers.join(',')}\n`;
  });

  // Use IPC to save file
  try {
    const result = await ipcRenderer.invoke('export-csv', csv);

    if (result.success) {
      showFeedback(`✓ Arquivo salvo com sucesso: ${result.path}`, 'success');
    } else if (!result.cancelled) {
      showFeedback('Erro ao salvar arquivo', 'error');
    }
  } catch (error) {
    console.error('Export error:', error);
    showFeedback('Erro ao exportar CSV', 'error');
  }
}

// Print results
function printResults() {
  if (generatedGames.length === 0) return;
  window.print();
}

// Initialize
updateGenerateButton();
