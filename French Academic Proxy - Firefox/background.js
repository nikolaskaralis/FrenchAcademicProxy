// background.js
function modifyURL(details) {
  const url = new URL(details.url);

  // Get user-selected modification type from storage
  return browser.storage.local.get("modificationType").then((result) => {
    const modificationType = result.modificationType || "INSERM"; // Default to CNRS

    console.log("Modification Type:", modificationType);

    // Get the appropriate set of domains based on the modification type
    const domainsToModify = getDomainsToModify(modificationType);

    for (const domainToModify of domainsToModify) {
      if (url.hostname.endsWith(domainToModify)) {
        let modifiedDomain = "";

        // Check modification type and update the domain accordingly
        if (modificationType === "INSERM") {
          modifiedDomain = `${url.hostname.split('.').join('-')}.proxy.insermbiblio.inist.fr`;
        } else if (modificationType === "CNRS") {
          modifiedDomain = `${url.hostname.split('.').join('-')}.insb.bib.cnrs.fr`;
        }

        url.hostname = modifiedDomain;
        console.log(`Modified URL: ${url.href}`);
        return { redirectUrl: url.href };
      }
    }

    // If no modification is needed, return an empty object
    return {};
  });
}

function getDomainsToModify(modificationType) {
  // Define and return the appropriate set of domains based on the modification type
  if (modificationType === "INSERM") {
    return ["aacrjournals.org",
"academic.oup.com",
"acs.org",
"acw.elsevier.com",
"ajp.psychiatryonline.org",
"algebraicgeometry.nl",
"annualreviews.org",
"ar.iiarjournals.org",
"arabidopsis.org",
"asbmb.org",
"ascelibrary.org",
"ascopubs.org",
"ashpublications.org",
"asm.org",
"aspetjournals.org",
"bdsp.ehesp.fr",
"biochemsoctrans.org",
"biomedcentral.com",
"bioone.org",
"bioscientifica.com",
"bivi.afnor.org",
"books.ersjournals.com",
"brepolsonline.net",
"brillonline.com",
"cambridge.org",
"ccdc.cam.ac.uk",
"cell.com",
"cellpress.com",
"chadwyck.co.uk",
"chadwyck.com",
"classiques-garnier.com",
"clinical.diabetesjournals.org",
"cochranelibrary.com",
"cognet.mit.edu",
"content.iospress.com",
"crossref.org",
"degruyter.com",
"doi.org",
"els.net",
"ems-ph.org",
"experiments.springernature.com",
"facetsjournal.com",
"faseb.org",
"firstsearch.org",
"futuremedicine.com",
"genetics.org",
"hstalks.com",
"icsd.fiz-karlsruhe.de",
"incites.thomsonreuters.com",
"ingentaconnect.com",
"insight.jci.org",
"intmedpress.com",
"iopscience.iop.org",
"jamanetwork.com",
"jasn.asnjournals.org",
"jbc.org",
"jneurosci.org",
"jnm.snmjournals.org",
"journals.aai.org",
"journals.biologists.com",
"journals.bmj.com",
"journals.elsevier.com",
"journals.elsevierhealth.com",
"journals.physiology.org",
"journals.sagepub.com",
"journals.uchicago.edu",
"jove.com",
"jwatch.org",
"karger.com",
"liebertpub.com",
"link.springer.com",
"mic.microbiologyresearch.org",
"misha.fr",
"mitpressjournals.org",
"molbiolcell.org",
"myendnoteweb.com",
"nature.com",
"nejm.org",
"numeriquepremium.com",
"nutrition.org",
"onlinelibrary.wiley.com",
"openedition.org",
"ovidsp.ovid.com",
"oxfordjournals.org",
"plant.pathwaystudio.com",
"plantphysiol.org",
"plos.org",
"pnas.org",
"press.endocrine.org",
"projecteuclid.org",
"publications.edpsciences.org",
"pubmed.ncbi.nlm.nih.gov",
"pubs.acs.org",
"pubs.rsc.org",
"pubs.rsna.org",
"rechercheisidore.fr",
"reproduction-abstracts.org",
"researcherid.com",
"rnajournal.cshlp.org",
"rockefeller.edu",
"royalsociety.org",
"sandfonline.com",
"scahq.org",
"scielo.org",
"science.org",
"sciencedirect.com",
"sciencemag.org",
"sciencesconf.org",
"scifinder.cas.org",
"scopus.com",
"search.ebscohost.com",
"search.proquest.com",
"spandidos-publications.com",
"springer.com",
"springernature.com",
"tandfonline.com",
"taylorandfrancis.com",
"taylorfrancis.com",
"themeta.news",
"thieme-connect.com",
"webofknowledge.com"];
  } 
    
else if (modificationType === "CNRS") {
    return ["access.clarivate.com",
"apps.webofknowledge.com",
"biocyc.org",
"books.openedition.org",
"cognet.mit.edu",
"eebo.chadwyck.com",
"esi.clarivate.com",
"f1000.com",
"inis-cea.inist.fr",
"jcr.clarivate.com",
"jstor.org",
"link.springer.com",
"nature.com",
"onlinelibrary.wiley.com",
"publications.edpsciences.org",
"pubmed.ncbi.nlm.nih.gov",
"pubs.acs.org",
"repo.scoap3.org",
"search.ebscohost.com",
"themeta.news",
"arabidopsis.org",
"emeraldinsight.com",
"girinst.org",
"rsc.org",
"sciencedirect.com"];
  }

  // Default to an empty array if modificationType is neither INSERM nor CNRS
  return [];
}

browser.webRequest.onBeforeRequest.addListener(
  modifyURL,
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
);

// Open options page in a new tab when the extension is installed
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.tabs.create({ url: browser.extension.getURL("options.html") });
  }
});
