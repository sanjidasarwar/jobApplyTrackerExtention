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
                <button class="delete-btn" data-url="${job.url}" >Remove</button>
            `
            jobContainer.appendChild(jobDiv);
        })

        jobContainer.addEventListener('click', (e)=>{
            if(e.target.classList.contains('delete-btn')){
                const jobUrl = e.target.getAttribute('data-url')
                deleteSingleJob(jobUrl)
            }
        })
    })
}

function deleteSingleJob (jobUrl){   
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    chrome.storage.local.get(['jobs'], data =>{
        const jobs = data.jobs || []
        const newJobs = jobs.filter(job => job.url !== jobUrl) 
        chrome.storage.local.set({jobs: newJobs}, ()=> {
            loadJobs()
        })
    })
}

const deleteAllBtn = document.getElementById('deleteAll')
deleteAllBtn.addEventListener('click', ()=>{
     if (!data.jobs || data.jobs.length === 0) {
        alert("No jobs to delete");
        return;
    }
    const confirmDelete = confirm("Are you sure you want to delete all jobs?");
    if (!confirmDelete) return;
    chrome.storage.local.get(['jobs'], data =>{
            const jobs = data.jobs || []
            chrome.storage.local.remove("jobs", ()=>{
                loadJobs()
            })
                

        })
})