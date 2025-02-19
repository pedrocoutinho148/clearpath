// Expanded sample data
const companies = [
    { name: 'Farfetch', rating: 4.2, logo: 'farfetch.com' },
    { name: 'Critical Software', rating: 4.5, logo: 'criticalsoftware.com' },
    { name: 'Talkdesk', rating: 4.3, logo: 'talkdesk.com' },
    { name: 'OutSystems', rating: 4.6, logo: 'outsystems.com' },
    { name: 'Feedzai', rating: 4.4, logo: 'feedzai.com' },
    { name: 'Mindera', rating: 4.7, logo: 'mindera.com' },
    { name: 'Bosch', rating: 4.5, logo: 'bosch.com' },
    { name: 'Siemens', rating: 4.3, logo: 'siemens.com' },
    { name: 'Microsoft', rating: 4.8, logo: 'microsoft.com' },
    { name: 'Nokia', rating: 4.1, logo: 'nokia.com' },
    { name: 'Vodafone', rating: 4.2, logo: 'vodafone.com' },
    { name: 'NOS', rating: 4.0, logo: 'nos.pt' },
    { name: 'Altice', rating: 3.9, logo: 'altice.pt' },
    { name: 'BLIP', rating: 4.6, logo: 'blip.pt' },
    { name: 'Unbabel', rating: 4.4, logo: 'unbabel.com' }
];

const locations = ['Porto', 'Lisboa', 'Braga', 'Coimbra', 'Aveiro', 'Faro', 'Leiria', 'Viseu', 'Setúbal', 'Madeira'];
const positions = [
    'Desenvolvedor de Software', 
    'Desenvolvedor Frontend', 
    'Desenvolvedor Backend',
    'Desenvolvedor Full Stack', 
    'Analista de Dados', 
    'Engenheiro DevOps',
    'Engenheiro QA', 
    'Desenvolvedor Mobile', 
    'Designer UI/UX',
    'Gestor de Produto', 
    'Scrum Master', 
    'Cientista de Dados',
    'Engenheiro Cloud', 
    'Analista de Sistemas', 
    'Engenheiro de Segurança'
];

const levels = [
    'Júnior',
    'Trainee',
    'Recém-Graduado',
    'Estagiário',
    'Entrada'
];

let allJobs = [];
let currentPage = 1;
const jobsPerPage = 12;

// Use a seeded random number generator for consistency
function seededRandom(seed) {
    return function() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
}

const random = seededRandom(123); // Fixed seed for consistency

function generateJobs(count = 500) {
    const jobs = [];
    for (let i = 0; i < count; i++) {
        const company = companies[Math.floor(random() * companies.length)];
        const location = locations[Math.floor(random() * locations.length)];
        const position = positions[Math.floor(random() * positions.length)];
        const level = levels[Math.floor(random() * levels.length)];
        const baseSalary = Math.floor((20000 + Math.floor(random() * 25000)) / 1000) * 1000;
        const maxSalary = baseSalary + 4000;
        const interested = Math.floor(random() * 100);

        jobs.push({
            company: company.name,
            rating: company.rating,
            logo: `https://logo.clearbit.com/${company.logo}`,
            title: `${level} ${position}`,
            location: `${location}, Portugal`,
            salary: baseSalary,
            salaryDisplay: `€${(baseSalary/1000)}k-${(maxSalary/1000)}k/ano`,
            interested: interested
        });
    }
    return jobs;
}

function displayJobs(jobs) {
    const jobList = document.querySelector('.job-list');
    jobList.innerHTML = '';

    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const pageJobs = jobs.slice(startIndex, endIndex);

    pageJobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="job-header">
                <div class="company-info">
                    <img src="${job.logo}" alt="${job.company}" class="company-logo">
                    <div class="company-details">
                        <div class="company-name-rating">
                            <h3>${job.company}</h3>
                            <span class="rating">${job.rating}<i class="fas fa-star"></i></span>
                        </div>
                        <h2>${job.title}</h2>
                        <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                    </div>
                </div>
            </div>
            <div class="job-details">
                <span class="salary">${job.salaryDisplay}</span>
                <span class="interested-count"><i class="fas fa-user"></i> ${job.interested} interessados</span>
                <button class="interest-btn">Interessa-me!</button>
            </div>
        `;
        jobList.appendChild(jobCard);
    });

    setupPagination(jobs.length);
    setupInterestButtons();
}

function setupPagination(totalJobs) {
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    const pagination = document.querySelector('.pagination');
    pagination.innerHTML = '';

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = '←';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            filterJobs();
        }
    });
    pagination.appendChild(prevButton);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.toggle('active', i === currentPage);
            pageButton.addEventListener('click', () => {
                currentPage = i;
                filterJobs();
            });
            pagination.appendChild(pageButton);
        } else if (
            i === currentPage - 3 || 
            i === currentPage + 3
        ) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }
    }

    // Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = '→';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            filterJobs();
        }
    });
    pagination.appendChild(nextButton);
}

function filterJobs() {
    const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
    const ratingFilter = parseFloat(document.getElementById('rating-filter').value) || 0;
    const salaryFilter = parseInt(document.getElementById('salary-filter').value) || 0;
    const locationFilter = document.getElementById('location-filter').value.toLowerCase();
    const experienceFilter = document.getElementById('experience-filter').value.toLowerCase();

    const filteredJobs = allJobs.filter(job => {
        const matchesSearch = 
            job.title.toLowerCase().includes(searchTerm) || 
            job.company.toLowerCase().includes(searchTerm);
        const matchesRating = job.rating >= ratingFilter;
        const matchesSalary = job.salary >= salaryFilter;
        const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter);
        const matchesExperience = !experienceFilter || job.title.toLowerCase().includes(experienceFilter);

        return matchesSearch && matchesRating && matchesSalary && 
               matchesLocation && matchesExperience;
    });

    displayJobs(filteredJobs);
}

function setupInterestButtons() {
    document.querySelectorAll('.interest-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('interested')) {
                // Update button state
                this.textContent = 'Interessado';
                this.classList.add('interested');
                
                // Get job data
                const jobCard = this.closest('.job-card');
                
                // Update interested count
                const interestedCountElement = jobCard.querySelector('.interested-count');
                const currentCount = parseInt(interestedCountElement.textContent.match(/\d+/)[0]);
                interestedCountElement.innerHTML = `<i class="fas fa-user"></i> ${currentCount + 1} interessados`;
                
                // Get all the job information
                const jobData = {
                    id: Date.now().toString(),
                    company: jobCard.querySelector('.company-name-rating h3').textContent,
                    rating: jobCard.querySelector('.rating').textContent,
                    logo: jobCard.querySelector('.company-logo').src,
                    title: jobCard.querySelector('h2').textContent,
                    location: jobCard.querySelector('.location').textContent,
                    salary: jobCard.querySelector('.salary').textContent,
                    interested: interestedCountElement.textContent, // Updated count
                    html: jobCard.outerHTML
                };

                // Save to localStorage with base path consideration
                let interestedJobs = JSON.parse(localStorage.getItem('interestedJobs') || '[]');
                
                // Update paths in the HTML before storing
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = jobData.html;
                
                // Update image paths
                const images = tempDiv.querySelectorAll('img');
                images.forEach(img => {
                    img.src = img.src.replace(window.location.origin, '');
                    if (window.location.hostname.includes('github.io')) {
                        img.src = img.src.replace('/clearpath/', '/');
                    }
                });
                
                jobData.html = tempDiv.innerHTML;
                interestedJobs.push(jobData);
                localStorage.setItem('interestedJobs', JSON.stringify(interestedJobs));
            }
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add pagination div
    const container = document.querySelector('.opportunities-container');
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    container.appendChild(paginationDiv);

    // Generate exactly 500 jobs every time
    allJobs = generateJobs(500);
    currentPage = 1;
    displayJobs(allJobs);
    
    // Setup event listeners
    document.querySelector('.search-bar input').addEventListener('input', () => {
        currentPage = 1;
        filterJobs();
    });
    
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', () => {
            currentPage = 1;
            filterJobs();
        });
    });
});