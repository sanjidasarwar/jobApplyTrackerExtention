// save job data when user clicks "Save Job" button in popup
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
                status: "Saved",
                date: new Date().toISOString()
            }
            
            // check for duplicates
            const isAlreadySaved = jobs.some(job => job.url === newJob.url);
            if (isAlreadySaved) {
                alert("This job is already saved!");
                return;
            }

            jobs.push(newJob);
            chrome.storage.local.set({ jobs }, () => {
                alert("Job saved!");
            })
        })
    })
})

// load saved jobs when popup opens

document.addEventListener("DOMContentLoaded", loadJobs);

function loadJobs() {
    chrome.storage.local.get(["jobs"], (data) => {
        const jobs = data.jobs || [];
        const jobContainer = document.getElementById("jobs");
        jobContainer.innerHTML = "";

        jobs.forEach((job, index) => {
            const jobDiv = document.createElement("div");
            jobDiv.className = "job-card";
            jobDiv.innerHTML =`
                <h3>${job.title}</h3>
                <a href="${job.url}" target="_blank">View Job</a>
                <p>Status: ${job.status}</p>
                <p>Applied on: ${new Date(job.date).toLocaleDateString()}</p>
            `
            jobContainer.appendChild(jobDiv);
        })

    })
}