function getJobInfo() {
  return {
    title: document.title,
    url: window.location.href
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === "GET_JOB"){
    sendResponse(getJobInfo())
    }
});