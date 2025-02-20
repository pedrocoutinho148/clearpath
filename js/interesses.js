document.addEventListener('DOMContentLoaded', () => {
    const interestedJobs = JSON.parse(localStorage.getItem('interestedJobs') || '[]');
    const emptyState = document.getElementById('emptyState');
    const jobList = document.getElementById('interestedJobs');

    function showEmptyState() {
        emptyState.classList.remove('hidden');
        emptyState.classList.add('visible');
        jobList.classList.remove('visible');
        jobList.classList.add('hidden');
    }

    function showJobList() {
        emptyState.classList.remove('visible');
        emptyState.classList.add('hidden');
        jobList.classList.remove('hidden');
        jobList.classList.add('visible');
    }

    function removeJob(jobId) {
        let interestedJobs = JSON.parse(localStorage.getItem('interestedJobs') || '[]');
        interestedJobs = interestedJobs.filter(job => job.id !== jobId);
        localStorage.setItem('interestedJobs', JSON.stringify(interestedJobs));
        return interestedJobs.length;
    }

    if (interestedJobs && interestedJobs.length > 0) {
        showJobList();
        jobList.innerHTML = '';
        
        interestedJobs.forEach(job => {
            if (job && job.html) {
                const jobElement = document.createElement('div');
                
                // Update paths for GitHub Pages
                let htmlContent = job.html;
                if (window.location.hostname.includes('github.io')) {
                    htmlContent = htmlContent.replace(/src="\/(?!http)/g, 'src="/clearpath/');
                }
                
                jobElement.innerHTML = htmlContent;
                const jobCard = jobElement.firstChild;
                
                // Update the button to show "Remover"
                const interestBtn = jobCard.querySelector('.interest-btn');
                if (interestBtn) {
                    interestBtn.textContent = 'Remover';
                    interestBtn.classList.add('interested');
                    
                    interestBtn.addEventListener('click', function() {
                        const remainingJobs = removeJob(job.id);
                        jobCard.remove();
                        
                        if (remainingJobs === 0) {
                            showEmptyState();
                        }
                    });
                }
                
                jobList.appendChild(jobCard);
            }
        });
    } else {
        showEmptyState();
    }
});