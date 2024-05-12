// options.js
document.addEventListener('DOMContentLoaded', function () {
  // Load the currently saved option
  loadCurrentOption();

  // Add event listener to save button
  document.getElementById('saveButton').addEventListener('click', function () {
    saveCurrentOption();
  });
});

function loadCurrentOption() {
  const modificationType = 'modificationType';

  // Retrieve the currently saved option from storage
  chrome.storage.sync.get([modificationType], function (result) {
    const currentOption = result[modificationType] || 'INSERM'; // Default to INSERM if not set

    // Set the select element to the currently saved option
    document.getElementById('urlModificationType').value = currentOption;

    // Display the currently selected option
    displayCurrentOption(currentOption);
  });
}

function saveCurrentOption() {
  const modificationType = 'modificationType';

  // Get the selected option from the select element
  const selectedOption = document.getElementById('urlModificationType').value;

  // Save the selected option to storage
  chrome.storage.sync.set({ [modificationType]: selectedOption }, function () {
    console.log('Option saved:', selectedOption);

    // Display the currently selected option
    displayCurrentOption(selectedOption);
  });
}

function displayCurrentOption(option) {
  // Display the currently selected option
  document.getElementById('currentOption').textContent = `Currently selected option is ${option}`;
}
