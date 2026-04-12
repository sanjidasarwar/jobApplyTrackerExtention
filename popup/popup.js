document.getElementById("saveBtn").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab)

    chrome.tabs.sendMessage(tab.id, { action: "GET_JOB" }, (response) => {  
        if (!response) {
            alert("No job data found");
            return;
        }
        
        chrome.storage.local.get(["jobs"], (data) => {
            const jobs = data.jobs || [];
            console.log(jobs)
            const newJob ={
                ...response,
                status: "Applied",
                date: new Date().toISOString()
            }

            jobs.push(newJob);
            chrome.storage.local.set({ jobs }, () => {
                alert("Job saved!");
            })
        })
    })
})

