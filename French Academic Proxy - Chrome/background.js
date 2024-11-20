importScripts('domains.js');

// background.js
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    // Open the options page on first installation
    chrome.tabs.create({ url: 'options.html' });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    storeOriginalUrl(changeInfo.url);
    modifyURL(tabId, changeInfo.url);
  }
});

function storeOriginalUrl(url) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;

  // Check if the hostname contains the modification pattern
  const isModified = hostname.includes('.proxy.insermbiblio.inist.fr') || hostname.includes('.insb.bib.cnrs.fr');

  // If the URL is not modified, store it
  if (!isModified) {
    chrome.storage.sync.set({ originalUrl: url });
    console.log('Original URL stored:', url); // Debug log
  }
}

function modifyURL(tabId, url) {
  const urlObj = new URL(url);
  const domainParts = urlObj.hostname.split('.');

  // Use the selected modification type from storage
  const modificationType = 'modificationType'; // replace with your storage key
  const selectedType = 'INSERM'; // default to INSERM if not set

  chrome.storage.sync.get([modificationType], function (result) {
    const type = result[modificationType] || selectedType;
    const domainsToModify = domainsList[type];
    
      
    // Check if the current URL's hostname is in the exclusion list
    if (exclusionList.includes(urlObj.hostname)) {
      console.log(`Excluding URL: ${urlObj.hostname}`);
      return; // Skip URL modification if it's in the exclusion list
    }
      
    // Check if the current domain matches any in the list
    for (const domainToModify of domainsToModify) {
      if (domainParts.length > 2 && domainParts.slice(-2).join('.') === domainToModify) {
        const extension = (type === 'INSERM') ? '.proxy.insermbiblio.inist.fr' : '.insb.bib.cnrs.fr';
        const modifiedDomain = `${domainParts.slice(0, -2).join('-')}-${domainParts.slice(-2).join('-')}${extension}`;
        urlObj.hostname = modifiedDomain;
        const modifiedUrl = urlObj.href;

        // Update the tab to the modified URL
        //chrome.tabs.update(tabId, { url: modifiedUrl});
        // Avoid modifying the URL if it’s already modified
        if (url !== modifiedUrl) {
          chrome.tabs.update(tabId, { url: modifiedUrl });
        }
        return;
      }
    }

    // If no modification is needed, update the tab with the original URL
    //chrome.tabs.update(tabId, { url: url });
  });
}

chrome.action.onClicked.addListener(() => {
  chrome.storage.sync.get(['originalUrl'], (result) => {
    if (result.originalUrl) {
      // Inject script into the active tab to copy to clipboard
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: copyToClipboard,
            args: [result.originalUrl]
          });
        }
      });
    } else {
      console.error('No original URL found in storage.');
    }
  });
});

// Function to run in the tab context
function copyToClipboard(url) {
  navigator.clipboard.writeText(url).then(() => {
    console.log("Copied original URL to clipboard: ", url);
  }).catch(err => {
    console.error("Failed to copy original URL:", err);
  });
}
