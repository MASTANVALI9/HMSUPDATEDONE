/* ============================================
   Hospital Management System - Appointment Page
   Appointment booking functionality
   ============================================ */

// Demo departments and time slots
const departments = [
    { id: 1, name: "Cardiology" },
    { id: 2, name: "Neurology" },
    { id: 3, name: "Oncology" },
    { id: 4, name: "Orthopedics" },
    { id: 5, name: "Pulmonology" },
    { id: 6, name: "Gastroenterology" },
    { id: 7, name: "General Medicine" }
];

const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

// Demo doctors (same as doctors.js)
const demoDoctors = [
    { id: 1, name: "Dr. Sarah Johnson", department: "Cardiology" },
    { id: 2, name: "Dr. Michael Chen", department: "Neurology" },
    { id: 3, name: "Dr. Emily Rodriguez", department: "Oncology" },
    { id: 4, name: "Dr. James Wilson", department: "Orthopedics" },
    { id: 5, name: "Dr. Amanda Foster", department: "Pulmonology" },
    { id: 6, name: "Dr. Robert Kumar", department: "Gastroenterology" },
    { id: 7, name: "Dr. Lisa Thompson", department: "General Medicine" },
    { id: 8, name: "Dr. David Park", department: "Cardiology" }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    populateDepartments();
    populateTimeSlots();
    setMinDate();
    initFormHandlers();
    checkUrlParams();
});

/* ---------- Populate Dropdowns ---------- */
function populateDepartments() {
    const select = document.getElementById('department');
    if (!select) return;

    departments.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.id;
        option.textContent = dept.name;
        select.appendChild(option);
    });

    // Add change handler to update doctors
    select.addEventListener('change', (e) => {
        const deptId = parseInt(e.target.value);
        const dept = departments.find(d => d.id === deptId);
        if (dept) {
            populateDoctors(dept.name);
        } else {
            clearDoctors();
        }
    });
}

function populateDoctors(departmentName) {
    const select = document.getElementById('doctor');
    if (!select) return;

    // Clear existing options
    select.innerHTML = '<option value="">Select Doctor</option>';

    // Filter doctors by department
    const filteredDoctors = demoDoctors.filter(d => d.department === departmentName);

    filteredDoctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        select.appendChild(option);
    });

    select.disabled = false;
}

function clearDoctors() {
    const select = document.getElementById('doctor');
    if (!select) return;

    select.innerHTML = '<option value="">Select Department First</option>';
    select.disabled = true;
}

function populateTimeSlots() {
    const select = document.getElementById('time');
    if (!select) return;

    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = formatTime(slot);
        select.appendChild(option);
    });
}

/* ---------- Date Handling ---------- */
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (!dateInput) return;

    // Set min date to today
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);

    // Set max date to 30 days from now
    const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
}

/* ---------- Form Handling ---------- */
function initFormHandlers() {
    const form = document.getElementById('appointment-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateAppointmentForm(form)) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        setLoading(submitBtn, true);

        try {
            const formData = {
                patientName: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                departmentId: document.getElementById('department').value,
                doctorId: document.getElementById('doctor').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                notes: document.getElementById('notes')?.value || ''
            };

            // Try to submit to API
            try {
                await apiRequest('/appointments', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            } catch {
                // API not available, simulate success for demo
                await new Promise(resolve => setTimeout(resolve, 1500));
            }

            // Show success
            showAppointmentSuccess(formData);
            form.reset();
            clearDoctors();

        } catch (error) {
            showToast('Failed to book appointment. Please try again.', 'error');
        } finally {
            setLoading(submitBtn, false);
        }
    });
}

function validateAppointmentForm(form) {
    let isValid = true;
    const fields = ['name', 'email', 'phone', 'department', 'doctor', 'date', 'time'];

    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;

        removeError(input);

        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (fieldId === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email');
            isValid = false;
        } else if (fieldId === 'phone' && !isValidPhone(input.value)) {
            showError(input, 'Please enter a valid phone number');
            isValid = false;
        }
    });

    return isValid;
}

function showAppointmentSuccess(formData) {
    const doctor = demoDoctors.find(d => d.id === parseInt(formData.doctorId));
    const dept = departments.find(d => d.id === parseInt(formData.departmentId));

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
    <div class="modal-content success-modal">
      <div class="success-icon">✓</div>
      <h2>Appointment Booked!</h2>
      <p>Your appointment has been successfully scheduled.</p>
      <div class="appointment-details">
        <div class="detail-row">
          <span class="label">Doctor:</span>
          <span class="value">${doctor?.name || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="label">Department:</span>
          <span class="value">${dept?.name || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date:</span>
          <span class="value">${formatDate(formData.date)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Time:</span>
          <span class="value">${formatTime(formData.time)}</span>
        </div>
      </div>
      <p class="note">A confirmation email has been sent to ${formData.email}</p>
      <button class="btn btn-primary" onclick="closeModal(this)">Done</button>
    </div>
  `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add modal styles if not exists
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      }
      .modal-content {
        background: white;
        padding: 40px;
        border-radius: 24px;
        max-width: 450px;
        width: 90%;
        text-align: center;
        animation: scaleIn 0.3s ease;
      }
      .success-icon {
        width: 80px;
        height: 80px;
        background: var(--accent-500, #4caf50);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        margin: 0 auto 24px;
      }
      .success-modal h2 {
        margin-bottom: 8px;
        color: var(--text-primary, #1e293b);
      }
      .success-modal > p {
        color: var(--text-secondary, #64748b);
        margin-bottom: 24px;
      }
      .appointment-details {
        background: var(--gray-50, #fafafa);
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        text-align: left;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid var(--gray-200, #eee);
      }
      .detail-row:last-child {
        border-bottom: none;
      }
      .detail-row .label {
        color: var(--text-secondary, #64748b);
        font-size: 14px;
      }
      .detail-row .value {
        font-weight: 600;
        color: var(--text-primary, #1e293b);
      }
      .note {
        font-size: 14px;
        color: var(--text-muted, #94a3b8);
        margin-bottom: 24px;
      }
    `;
        document.head.appendChild(style);
    }
}

function closeModal(btn) {
    const modal = btn.closest('.modal-overlay');
    modal.style.animation = 'fadeIn 0.3s ease reverse';
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
    }, 300);
}

/* ---------- URL Parameters ---------- */
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get('doctor');

    if (doctorId) {
        const doctor = demoDoctors.find(d => d.id === parseInt(doctorId));
        if (doctor) {
            // Set department
            const dept = departments.find(d => d.name === doctor.department);
            if (dept) {
                const deptSelect = document.getElementById('department');
                deptSelect.value = dept.id;
                populateDoctors(doctor.department);

                // Set doctor after a brief delay
                setTimeout(() => {
                    const doctorSelect = document.getElementById('doctor');
                    doctorSelect.value = doctorId;
                }, 100);
            }
        }
    }
}

/* ---------- Helper Functions (if not from main.js) ---------- */
if (typeof formatDate === 'undefined') {
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }
}

if (typeof formatTime === 'undefined') {
    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }
}

if (typeof showToast === 'undefined') {
    function showToast(message, type = 'info') {
        alert(message);
    }
}

if (typeof setLoading === 'undefined') {
    function setLoading(element, isLoading) {
        element.disabled = isLoading;
    }
}

if (typeof showError === 'undefined') {
    function showError(input, message) {
        input.classList.add('error');
        const error = document.createElement('span');
        error.className = 'form-error';
        error.textContent = message;
        input.parentElement.appendChild(error);
    }
}

if (typeof removeError === 'undefined') {
    function removeError(input) {
        input.classList.remove('error');
        const error = input.parentElement.querySelector('.form-error');
        if (error) error.remove();
    }
}

if (typeof isValidEmail === 'undefined') {
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

if (typeof isValidPhone === 'undefined') {
    function isValidPhone(phone) {
        return /^[\d\s\-+()]{10,}$/.test(phone);
    }
}

if (typeof apiRequest === 'undefined') {
    async function apiRequest(endpoint, options) {
        const response = await fetch(`http://localhost:3000/api${endpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        if (!response.ok) throw new Error('Request failed');
        return response.json();
    }
}
