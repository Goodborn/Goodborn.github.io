const workerList = document.getElementById('workerList');
const addWorkerBtn = document.getElementById('addWorker');
const addBonusBtn = document.getElementById('addBonus');
const bonusAmountInput = document.getElementById('bonusAmount');
const workerSelect = document.getElementById('workerSelect');
const resetAllSalariesBtn = document.getElementById('resetAllSalaries');

// Initialize the workers array with the predefined agents
const workers = [
  { name: 'Krenare', abchlussaCount: 0, salary: 600 },
  { name: 'Arta', abchlussaCount: 0, salary: 600 },
  { name: 'Imrani', abchlussaCount: 0, salary: 600 },
  { name: 'Nehati', abchlussaCount: 0, salary: 600 },
  { name: 'Beka', abchlussaCount: 0, salary: 600 }
];

// Update the worker list and select options
updateWorkerList();
updateWorkerSelect();

addWorkerBtn.addEventListener('click', () => {
  const workerName = prompt('Enter worker name:');
  if (workerName) {
    const worker = {
      name: workerName,
      abchlussaCount: 0,
      salary: 600
    };

    workers.push(worker);
    updateWorkerList();
    updateWorkerSelect();
  }
});

addBonusBtn.addEventListener('click', () => {
  const bonusCount = parseInt(bonusAmountInput.value);
  const selectedWorkerName = workerSelect.value;

  if (!isNaN(bonusCount) && selectedWorkerName) {
    const selectedWorker = workers.find(worker => worker.name === selectedWorkerName);

    if (selectedWorker) {
      const newAbchlussaCount = selectedWorker.abchlussaCount + bonusCount;
      if (newAbchlussaCount >= 0) {
        selectedWorker.abchlussaCount = newAbchlussaCount > MAX_BONUSES ? MAX_BONUSES : newAbchlussaCount;
        updateWorkerList();
      }
    } else {
      alert('Worker not found. Please try again.');
    }

    bonusAmountInput.value = '';
  }
});

resetAllSalariesBtn.addEventListener('click', () => {
  const confirmReset = confirm('Are you sure you want to reset salaries for all workers?');
  if (confirmReset) {
    workers.forEach(worker => {
      worker.abchlussaCount = 0;
      worker.salary = 600;
    });
    updateWorkerList();
  }
});

function updateWorkerList() {
  workers.sort((a, b) => calculateNetoEarnings(b) - calculateNetoEarnings(a));

  workerList.innerHTML = '';
  workers.forEach((worker, index) => {
    const li = document.createElement('li');
    const brutoEarnings = calculateBrutoEarnings(worker);
    const netoEarnings = calculateNetoEarnings(worker);

    li.innerHTML = `${index + 1}. ${worker.name} (${worker.abchlussaCount} Abchlussa): Bruto - <span class="bruto">${brutoEarnings.toFixed(2)} EUR</span> (Neto - <span class="neto">${netoEarnings.toFixed(2)} EUR</span>)`;

    workerList.appendChild(li);
  });
}

function updateWorkerSelect() {
  workerSelect.innerHTML = '';
  workers.forEach(worker => {
    const option = document.createElement('option');
    option.value = worker.name;
    option.textContent = worker.name;
    workerSelect.appendChild(option);
  });
}

function calculateBrutoEarnings(worker) {
  const increasedFixedSalary = worker.abchlussaCount >= 13 ? 1000 : worker.abchlussaCount >= 6 ? 800 : 600;
  const brutoEarnings = increasedFixedSalary + worker.abchlussaCount * 30;
  return brutoEarnings;
}

function calculateNetoEarnings(worker) {
  const brutoEarnings = calculateBrutoEarnings(worker);

  // Calculate pension fund tax
  const pensionFundTaxRate = 0.05;
  const pensionFundTax = brutoEarnings * pensionFundTaxRate;

  // Calculate remaining bruto after pension fund tax
  const brutoAfterPension = brutoEarnings - pensionFundTax;

  // Calculate state tax based on remaining bruto
  let stateTax = 0;

  if (brutoAfterPension <= 80) {
    stateTax = 0;
  } else if (brutoAfterPension <= 250) {
    stateTax = (brutoAfterPension - 80) * 0.04;
  } else if (brutoAfterPension <= 450) {
    stateTax = 170 * 0.04 + (brutoAfterPension - 250) * 0.08;
  } else {
    stateTax = 170 * 0.04 + 200 * 0.08 + (brutoAfterPension - 450) * 0.10;
  }

  // Calculate neto earnings after deducting pension fund and state tax
  const netoEarnings = brutoEarnings - pensionFundTax - stateTax;
  return netoEarnings;
}

const MAX_BONUSES = 50; // Maximum number of bonuses allowed