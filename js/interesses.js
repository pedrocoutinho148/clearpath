document.addEventListener('DOMContentLoaded', () => {
    const interestedJobs = JSON.parse(localStorage.getItem('interestedJobs') || '[]');
    const emptyState = document.getElementById('emptyState');
    const jobList = document.getElementById('interestedJobs');

    // Debug logs to check what's happening
    console.log('Interested jobs:', interestedJobs);
    console.log('Empty state element:', emptyState);
    console.log('Job list element:', jobList);

    function showEmptyState() {
        emptyState.classList.remove('hidden');
        emptyState.classList.add('visible');
        jobList.classList.remove('visible');
        jobList.classList.add('hidden');
        console.log('Showing empty state');
    }

    function showJobList() {
        emptyState.classList.remove('visible');
        emptyState.classList.add('hidden');
        jobList.classList.remove('hidden');
        jobList.classList.add('visible');
        console.log('Showing job list');
    }

    function removeJob(jobId) {
        // Get current jobs from localStorage
        let interestedJobs = JSON.parse(localStorage.getItem('interestedJobs') || '[]');
        
        // Filter out the removed job
        interestedJobs = interestedJobs.filter(job => job.id !== jobId);
        
        // Update localStorage
        localStorage.setItem('interestedJobs', JSON.stringify(interestedJobs));

        return interestedJobs.length;
    }

    if (interestedJobs && interestedJobs.length > 0) {
        console.log('Found interested jobs:', interestedJobs.length);
        showJobList();
        
        // Clear existing jobs
        jobList.innerHTML = '';
        
        // Display the interested jobs
        interestedJobs.forEach(job => {
            if (job && job.html) {
                const jobElement = document.createElement('div');
                jobElement.innerHTML = job.html;
                const jobCard = jobElement.firstChild;
                
                // Update the button to show "Remover"
                const interestBtn = jobCard.querySelector('.interest-btn');
                interestBtn.textContent = 'Remover';
                interestBtn.classList.add('interested');
                
                // Add click handler for remove
                interestBtn.addEventListener('click', function() {
                    const remainingJobs = removeJob(job.id);
                    jobCard.remove();
                    
                    // If no jobs left, show empty state
                    if (remainingJobs === 0) {
                        console.log('No more jobs, showing empty state');
                        showEmptyState();
                    }
                });
                
                jobList.appendChild(jobCard);
            }
        });
    } else {
        console.log('No interested jobs found, showing empty state');
        showEmptyState();
    }
});