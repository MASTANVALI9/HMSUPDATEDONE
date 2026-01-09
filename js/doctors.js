/* ============================================
   Hospital Management System - Doctors Page
   Doctor listing and filtering
   ============================================ */

// Demo doctors data (will be replaced with API data)
const demoDoctors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        department: "Cardiology",
        specialization: "Interventional Cardiologist",
        experience: 15,
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
        availability: "available",
        availabilityText: "Available Today",
        education: "MD, FACC",
        about: "Specialized in complex cardiac interventions with over 15 years of experience."
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        department: "Neurology",
        specialization: "Neurologist & Stroke Specialist",
        experience: 12,
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop",
        availability: "available",
        availabilityText: "Available Today",
        education: "MD, PhD Neuroscience",
        about: "Expert in stroke prevention and treatment with cutting-edge techniques."
    },
    {
        id: 3,
        name: "Dr. Emily Rodriguez",
        department: "Oncology",
        specialization: "Medical Oncologist",
        experience: 18,
        photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
        availability: "available",
        availabilityText: "Available Tomorrow",
        education: "MD, FASCO",
        about: "Leading cancer specialist with expertise in personalized treatment plans."
    },
    {
        id: 4,
        name: "Dr. James Wilson",
        department: "Orthopedics",
        specialization: "Orthopedic Surgeon",
        experience: 20,
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop",
        availability: "busy",
        availabilityText: "Next Available: Monday",
        education: "MD, MS Ortho",
        about: "Specializing in joint replacements and sports medicine."
    },
    {
        id: 5,
        name: "Dr. Amanda Foster",
        department: "Pulmonology",
        specialization: "Pulmonologist",
        experience: 10,
        photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop",
        availability: "available",
        availabilityText: "Available Today",
        education: "MD, FCCP",
        about: "Expert in respiratory diseases and critical care medicine."
    },
    {
        id: 6,
        name: "Dr. Robert Kumar",
        department: "Gastroenterology",
        specialization: "Gastroenterologist",
        experience: 14,
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop",
        availability: "available",
        availabilityText: "Available Today",
        education: "MD, DM Gastro",
        about: "Specialist in digestive disorders and advanced endoscopy."
    },
    {
        id: 7,
        name: "Dr. Lisa Thompson",
        department: "General Medicine",
        specialization: "Internal Medicine Specialist",
        experience: 8,
        photo: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=300&fit=crop",
        availability: "available",
        availabilityText: "Available Today",
        education: "MD, MRCP",
        about: "Comprehensive care for complex medical conditions."
    },
    {
        id: 8,
        name: "Dr. David Park",
        department: "Cardiology",
        specialization: "Cardiac Electrophysiologist",
        experience: 16,
        photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop",
        availability: "busy",
        availabilityText: "Next Available: Wednesday",
        education: "MD, FHRS",
        about: "Specializing in heart rhythm disorders and pacemaker implantation."
    }
];

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDoctors();
    initDepartmentFilter();
    initSearchFilter();
});

/* ---------- Load Doctors ---------- */
async function loadDoctors(department = 'all') {
    const container = document.getElementById('doctors-grid');
    if (!container) return;

    // Show loading state
    container.innerHTML = `
    <div class="loading-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
      <div class="spinner" style="margin: 0 auto 20px;"></div>
      <p>Loading doctors...</p>
    </div>
  `;

    // Filter demo doctors based on department
    let doctors = department === 'all'
        ? demoDoctors
        : demoDoctors.filter(d => d.department.toLowerCase() === department.toLowerCase());

    // Try to fetch from API, but always fall back to demo data
    try {
        const response = await fetch(`${API_BASE_URL}/doctors${department !== 'all' ? `?department=${department}` : ''}`);
        if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.length > 0) {
                doctors = result.data;
            }
        }
    } catch (error) {
        console.log('API not available, using demo data');
    }

    renderDoctors(doctors);
}

/* ---------- Render Doctors ---------- */
function renderDoctors(doctors) {
    const container = document.getElementById('doctors-grid');
    if (!container) return;

    if (doctors.length === 0) {
        container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
        <h3>No doctors found</h3>
        <p style="color: var(--text-secondary);">Try adjusting your filters or search criteria.</p>
      </div>
    `;
        return;
    }

    container.innerHTML = doctors.map((doctor, index) => `
    <div class="card card-elevated doctor-card" data-animate="fade-up" data-animate-delay="${index * 100}">
      <img 
        src="${doctor.photo}" 
        alt="${doctor.name}" 
        class="doctor-image"
        onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&size=140&background=00b0c7&color=fff'"
      >
      <h3 class="doctor-name">${doctor.name}</h3>
      <p class="doctor-specialty">${doctor.specialization}</p>
      <p class="doctor-experience">${doctor.experience} Years Experience</p>
      <span class="doctor-availability ${doctor.availability}">
        <span class="status-dot"></span>
        ${doctor.availabilityText}
      </span>
      <a href="appointment.html?doctor=${doctor.id}" class="btn btn-primary">
        Book Appointment
      </a>
    </div>
  `).join('');

    // Reinitialize animations for new elements
    initScrollAnimations();
}

/* ---------- Department Filter ---------- */
function initDepartmentFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Load filtered doctors
            const department = btn.dataset.department;
            loadDoctors(department);
        });
    });
}

/* ---------- Search Filter ---------- */
function initSearchFilter() {
    const searchInput = document.getElementById('doctor-search');
    if (!searchInput) return;

    const debouncedSearch = debounce((query) => {
        const doctors = demoDoctors.filter(doctor =>
            doctor.name.toLowerCase().includes(query.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(query.toLowerCase()) ||
            doctor.department.toLowerCase().includes(query.toLowerCase())
        );
        renderDoctors(doctors);
    }, 300);

    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });
}

/* ---------- Debounce (if not loaded from main.js) ---------- */
if (typeof debounce === 'undefined') {
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

/* ---------- Re-init scroll animations ---------- */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]:not(.animated)');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.animateDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}
