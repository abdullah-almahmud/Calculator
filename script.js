const keys = document.querySelector('.keys');
const display = document.querySelector('.current');

let currentNum = '';
let previousNum = '';
let operation = null;


function displayCalculation() {
  const parts = [];

  if (previousNum !== '') parts.push(previousNum);
  if (operation !== null) parts.push(operation);
  if (currentNum !== '') parts.push(currentNum);

  display.textContent = parts.length > 0 ? parts.join(' ') : '0';
}


function handleInputNumber(digit) {
  //Corner Case: If the last calculation errored, start fresh first.
  if (currentNum === 'Error') {
    clear();
  }

  //Corner Case: Multiple dot(.) not allowed
  if (digit === '.' && currentNum.includes('.')) {
    return;
  }

  //Corner Case: Zero only before dot(.), not before other numbers.
  if (currentNum === '0' && digit !== '.') {
    currentNum = digit;
  } else {
    currentNum += digit;
  }

  displayCalculation();
}

function handleOperator(op) {
  // Nothing has been typed at all yet — ignore.
  //Corner Case: No operator before numbers are typed. 
  if (currentNum === '' && previousNum === '') {
    return;
  }

  // Can't operate on an error state.
  if (currentNum === 'Error') {
    return;
  }

  //Corner Case: No multiple operator in sequence. Replace previous typed operator with current.
  if (currentNum === '') {
    operation = op;
    displayCalculation();
    return;
  }

  //Corner Case: If operator before calculation then calculate
  if (previousNum !== '') {
    compute();
    if (currentNum === 'Error') return;
  }

  operation = op;
  previousNum = currentNum;
  currentNum = '';
  displayCalculation();
}


function compute() {
  const prev = parseFloat(previousNum);
  const current = parseFloat(currentNum);

  // Corner Case: If input is not a number then return nothing.
  if (isNaN(prev) || isNaN(current)) {
    return;
  }

  let result;

  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        showError();
        return;
      }
    case '%':
      if (current === 0) {
        showError();
        return;
      }  
      result = prev % current;
      break;
    default:
      return; 
  }

  result = parseFloat(result.toFixed(10));

  currentNum = result.toString();
  previousNum = '';
  operation = null;
  displayCalculation();
}

function showError() {
  currentNum = 'Error';
  previousNum = '';
  operation = null;
  displayCalculation();
}

function clear() {
  currentNum = '';
  previousNum = '';
  operation = null;
  displayCalculation();
}

function backspace() {
  if (currentNum === 'Error') {
    clear();
    return;
  }
  currentNum = currentNum.slice(0, -1);
  displayCalculation();
}



// Handles buttons.
keys.addEventListener('click', (e) => {
  const button = e.target;
  if (!button.matches('button')) return;

  const value = button.dataset.op || button.dataset.num || button.textContent.trim();

  if (button.classList.contains('clear')) {
    clear();
  } else if (button.classList.contains('backspace')) {
    backspace();
  } else if (button.classList.contains('op')) {
    handleOperator(value);
  } else if (button.classList.contains('equals')) {
    compute();
  } else {
    handleInputNumber(value);
  }
});

// Handles keyboard input 
document.addEventListener('keydown', (e) => {
  const isDigitOrDot = (e.key >= '0' && e.key <= '9') || e.key === '.';
  const isOperator = ['+', '-', '*', '/', '%'].includes(e.key);

  if (isDigitOrDot) {
    handleInputNumber(e.key);
  } else if (isOperator) {
    handleOperator(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    e.preventDefault();
    compute();
  } else if (e.key === 'Backspace') {
    backspace();
  } else if (e.key === 'Escape') {
    clear();
  }
});

displayCalculation();
