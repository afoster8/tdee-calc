function toggleUnits() {
  const unitSystem = document.getElementById('unit-system').value;
  const weightInput = document.getElementById('weight');
  const heightInput = document.getElementById('height');
  const goalWeightInput = document.getElementById('goal-weight');

  if (unitSystem === 'imperial') {
      weightInput.placeholder = 'Weight (lbs)';
      heightInput.placeholder = 'Height (inches)';
      goalWeightInput.placeholder = 'Goal Weight (lbs)';
  } else {
      weightInput.placeholder = 'Weight (kg)';
      heightInput.placeholder = 'Height (cm)';
      goalWeightInput.placeholder = 'Goal Weight (kg)';
  }
}

function calculateTDEE(weight, height, age, gender, activity) {
  let bmr;
  if (gender === 'male') {
      bmr = 5 + (10 * weight) + (6.25 * height) - (5 * age);
  } else {
      bmr = -10 + (10 * weight) + (6.25* height) - (5 * age);
  }
  return bmr * activity;
}

function convert_weight(value) {
  if (document.getElementById('unit-system').value === 'imperial') {
    return value * 0.453592
  }
  return value
}

function convert_height(value) {
  if (document.getElementById('unit-system').value === 'imperial') {
    return value * 2.54
  }
  return value
}

function unconvert_weight(value) {
  if (document.getElementById('unit-system').value === 'imperial') {
    return value * 2.20462
  }
  return value
}

function trackProgress() {
  let weight = convert_weight(parseFloat(document.getElementById('weight').value));
  let height = convert_height(parseFloat(document.getElementById('height').value));
  const age = parseFloat(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const activity = parseFloat(document.getElementById('activity').value);
  const goalIntake = parseFloat(document.getElementById('goal-intake').value);

  const progress = [];
  let week = 1;
  let currentWeight = weight;
  let currentDate = new Date() + 7;

  while (week < 208 && currentWeight > 0) {
      const tdee = calculateTDEE(currentWeight, height, age, gender, activity);
      const weightLoss = -((tdee - goalIntake) * 7 / 7700); 
      currentWeight += weightLoss;

      progress.push({
          week: week,
          date: new Date(currentDate),
          weight: unconvert_weight(currentWeight),
          loss: unconvert_weight(weightLoss),
          tdee: Math.round(tdee)
      });

      currentDate.setDate(currentDate.getDate() + 7);
      week++;
  }

  updateProgressTable(progress);
}

function updateProgressTable(progress) {
  const progressTableBody = document.getElementById('progress-table').getElementsByTagName('tbody')[0];
  progressTableBody.innerHTML = '';

  progress.forEach(entry => {
      const row = progressTableBody.insertRow();
      row.insertCell(0).textContent = entry.week;
      row.insertCell(1).textContent = entry.date.toLocaleDateString();
      row.insertCell(2).textContent = entry.weight.toFixed(2);
      row.insertCell(3).textContent = entry.loss.toFixed(2);
      row.insertCell(4).textContent = entry.tdee;
  });
}
