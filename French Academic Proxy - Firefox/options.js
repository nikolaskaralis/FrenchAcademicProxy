// options.js
document.addEventListener("DOMContentLoaded", function () {
  // Attach event listeners
  const select = document.getElementById("modificationType");
  const saveButton = document.getElementById("saveButton");
  const statusMessage = document.getElementById("statusMessage");

  // Function to update the status message
  function updateStatusMessage() {
    const selectedValue = select.options[select.selectedIndex].value;
    statusMessage.textContent = "Currently selected option is " + selectedValue;
  }

  // Retrieve the currently stored modification type
  browser.storage.local.get("modificationType").then((result) => {
    const storedModificationType = result.modificationType || "CNRS"; // Default to CNRS if not set

    // Set the selected option in the dropdown
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].value === storedModificationType) {
        select.selectedIndex = i;
        break;
      }
    }

    // Update the status message initially
    updateStatusMessage();

    // Log the selected value for debugging
    console.log("Currently Selected Modification Type:", storedModificationType);
  });

  select.addEventListener("change", function () {
    // Update the status message when the selection changes
    //updateStatusMessage();
  });

  saveButton.addEventListener("click", function () {
    // Save options and update the status message only after saving
    saveOptions();
    updateStatusMessage();
  });
});

function saveOptions() {
  console.log("Save button clicked");
  const select = document.getElementById("modificationType");
  const selectedValue = select.options[select.selectedIndex].value;

  console.log("Selected Modification Type:", selectedValue);

  // Save options
  browser.storage.local.set({ modificationType: selectedValue })
    .then(() => {
      console.log("Modification Type saved successfully.");
    })
    .catch(error => {
      console.error("Error saving Modification Type:", error);
    });
}
