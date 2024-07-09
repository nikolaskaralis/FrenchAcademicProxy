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
    modifyURL(tabId, changeInfo.url);
  }
});

function modifyURL(tabId, url) {
  const urlObj = new URL(url);
  const domainParts = urlObj.hostname.split('.');

  // Use the selected modification type from storage
  const modificationType = 'modificationType'; // replace with your storage key
  const selectedType = 'INSERM'; // default to INSERM if not set

  chrome.storage.sync.get([modificationType], function (result) {
    const type = result[modificationType] || selectedType;
    const domainsToModify = domainsList[type];

    // Check if the current domain matches any in the list
    for (const domainToModify of domainsToModify) {
      if (domainParts.length > 2 && domainParts.slice(-2).join('.') === domainToModify) {
        const extension = (type === 'INSERM') ? '.proxy.insermbiblio.inist.fr' : '.insb.bib.cnrs.fr';
        const modifiedDomain = `${domainParts.slice(0, -2).join('-')}-${domainParts.slice(-2).join('-')}${extension}`;
        urlObj.hostname = modifiedDomain;
        const modifiedUrl = urlObj.href;

        // Update the tab to the modified URL
        chrome.tabs.update(tabId, { url: modifiedUrl});
        return;
      }
    }

    // If no modification is needed, update the tab with the original URL
    //chrome.tabs.update(tabId, { url: url });
  });
}
