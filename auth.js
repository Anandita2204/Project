/* ============================================
   AUTH.JS - Authentication Logic with OTP
   ============================================ */

// State Management
const authState = {
    currentStep: 1,
    enrollmentNumber: '',
    mobileNumber: '',
    otp: '',
    profile: {
        name: '',
        course: '',
        semester: '',
        faculty: '',
        mobile: '',
        email: '',
        profilePic: null
    }
};

// DOM Elements
const step1Form = document.getElementById('step1-form');
const step2Form = document.getElementById('step2-form');
const step3Form = document.getElementById('step3-form');
const authSuccess = document.getElementById('auth-success');
const loadingOverlay = document.getElementById('loading-overlay');
const stepIndicators = document.querySelectorAll('.step-indicator');
const stepLines = document.querySelectorAll('.step-line');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    setupOTPInputs();
    setupProfileUpload();
    checkURLParams();
});

function initializeAuth() {
    // Step 1 Form Submit
    step1Form.addEventListener('submit', handleStep1Submit);
    
    // Step 2 Form Submit
    step2Form.addEventListener('submit', handleStep2Submit);
    
    // Step 3 Form Submit
    step3Form.addEventListener('submit', handleStep3Submit);
    
    // Back button
    document.getElementById('back-to-step1').addEventListener('click', () => {
        goToStep(1);
    });
    
    // Resend OTP
    document.getElementById('resend-btn').addEventListener('click', handleResendOTP);
}

function checkURLParams() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    
    // If coming from seller button, show appropriate messaging
    if (mode === 'seller') {
        document.querySelector('.form-header h2').textContent = 'Start Selling';
    }
}

// Step 1: Enrollment & Mobile Verification
async function handleStep1Submit(e) {
    e.preventDefault();
    
    const enrollment = document.getElementById('enrollment').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    
    // Validation
    if (!validateEnrollment(enrollment)) {
        showError('enrollment-error', 'Please enter a valid enrollment number');
        return;
    }
    
    if (!validateMobile(mobile)) {
        showError('mobile-error', 'Please enter a valid 10-digit mobile number');
        return;
    }
    
    // Store values
    authState.enrollmentNumber = enrollment;
    authState.mobileNumber = mobile;
    
    // Show loading
    showLoading();
    
    try {
        // Simulate API call to verify enrollment and send OTP
        await sendOTP(mobile);
        
        // Update mobile display
        document.getElementById('mobile-display').textContent = `+91 ${mobile.slice(0, 2)}****${mobile.slice(-2)}`;
        
        // Move to step 2
        hideLoading();
        goToStep(2);
        startResendTimer();
        
    } catch (error) {
        hideLoading();
        showError('enrollment-error', error.message || 'Verification failed. Please try again.');
    }
}

// Step 2: OTP Verification
async function handleStep2Submit(e) {
    e.preventDefault();
    
    const otpInputs = document.querySelectorAll('.otp-input');
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    
    if (otp.length !== 6) {
        showError('otp-error', 'Please enter the complete 6-digit OTP');
        otpInputs.forEach(input => input.classList.add('error'));
        return;
    }
    
    showLoading();
    
    try {
        // Verify OTP (simulate API call)
        await verifyOTP(authState.mobileNumber, otp);
        
        // Check if user exists or is new
        const userExists = await checkUserExists(authState.enrollmentNumber);
        
        hideLoading();
        
        if (userExists) {
            // Existing user - redirect to dashboard
            localStorage.setItem('campusly_user', JSON.stringify({
                enrollment: authState.enrollmentNumber,
                mobile: authState.mobileNumber,
                isLoggedIn: true
            }));
            window.location.href = 'browse.html';
        } else {
            // New user - go to profile creation
            goToStep(3);
        }
        
    } catch (error) {
        hideLoading();
        showError('otp-error', error.message || 'Invalid OTP. Please try again.');
        document.querySelectorAll('.otp-input').forEach(input => {
            input.classList.add('error');
            input.value = '';
        });
        document.querySelector('.otp-input').focus();
    }
}

// Step 3: Profile Creation
async function handleStep3Submit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('fullname').value.trim(),
        course: document.getElementById('course').value,
        semester: document.getElementById('semester').value,
        faculty: document.getElementById('faculty').value.trim(),
        mobile: authState.mobileNumber,
        email: document.getElementById('email').value.trim(),
        enrollment: authState.enrollmentNumber
    };
    
    // Validation
    if (!formData.name || !formData.course || !formData.semester || !formData.faculty) {
        alert('Please fill all required fields');
        return;
    }
    
    showLoading();
    
    try {
        // Create user profile (simulate API call)
        await createUserProfile(formData);
        
        // Handle profile picture upload if exists
        const profilePicInput = document.getElementById('profile-pic');
        if (profilePicInput.files[0]) {
            await uploadProfilePicture(profilePicInput.files[0]);
        }
        
        // Store user session
        localStorage.setItem('campusly_user', JSON.stringify({
            ...formData,
            isLoggedIn: true
        }));
        
        hideLoading();
        showSuccess();
        
    } catch (error) {
        hideLoading();
        alert(error.message || 'Failed to create profile. Please try again.');
    }
}

// OTP Input Handling
function setupOTPInputs() {
    const otpInputs = document.querySelectorAll('.otp-input');
    
    otpInputs.forEach((input, index) => {
        // Handle input
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            
            // Remove error state
            e.target.classList.remove('error');
            document.getElementById('otp-error').classList.remove('show');
            
            // Add filled state
            if (value) {
                e.target.classList.add('filled');
                // Move to next input
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            } else {
                e.target.classList.remove('filled');
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
        
        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasteData = e.clipboardData.getData('text').slice(0, 6);
            
            if (/^\d+$/.test(pasteData)) {
                pasteData.split('').forEach((digit, i) => {
                    if (otpInputs[i]) {
                        otpInputs[i].value = digit;
                        otpInputs[i].classList.add('filled');
                    }
                });
                
                const lastIndex = Math.min(pasteData.length, otpInputs.length) - 1;
                otpInputs[lastIndex].focus();
            }
        });
    });
}

// Profile Picture Upload
function setupProfileUpload() {
    const profilePicInput = document.getElementById('profile-pic');
    const profilePreview = document.getElementById('profile-preview');
    
    profilePicInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Preview image
            const reader = new FileReader();
            reader.onload = (event) => {
                profilePreview.innerHTML = `<img src="${event.target.result}" alt="Profile">`;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Navigation Functions
function goToStep(step) {
    authState.currentStep = step;
    
    // Hide all forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    authSuccess.classList.remove('active');
    
    // Show target form
    const targetForm = document.getElementById(`step${step}-form`);
    if (targetForm) {
        targetForm.classList.add('active');
    }
    
    // Update step indicators
    stepIndicators.forEach((indicator, index) => {
        const stepNum = index + 1;
        indicator.classList.remove('active', 'completed');
        
        if (stepNum === step) {
            indicator.classList.add('active');
        } else if (stepNum < step) {
            indicator.classList.add('completed');
        }
    });
    
    // Update step lines
    stepLines.forEach((line, index) => {
        if (index < step - 1) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

function showSuccess() {
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById('auth-steps').style.display = 'none';
    authSuccess.classList.add('active');
}

// Timer Functions
let resendTimer = null;

function startResendTimer() {
    let seconds = 30;
    const resendBtn = document.getElementById('resend-btn');
    const timerSpan = document.getElementById('resend-timer');
    
    resendBtn.disabled = true;
    
    resendTimer = setInterval(() => {
        seconds--;
        timerSpan.textContent = `(${seconds}s)`;
        
        if (seconds <= 0) {
            clearInterval(resendTimer);
            resendBtn.disabled = false;
            timerSpan.textContent = '';
        }
    }, 1000);
}

async function handleResendOTP() {
    showLoading();
    
    try {
        await sendOTP(authState.mobileNumber);
        hideLoading();
        startResendTimer();
        
        // Clear existing OTP inputs
        document.querySelectorAll('.otp-input').forEach(input => {
            input.value = '';
            input.classList.remove('filled', 'error');
        });
        document.querySelector('.otp-input').focus();
        
    } catch (error) {
        hideLoading();
        alert('Failed to resend OTP. Please try again.');
    }
}

// Validation Functions
function validateEnrollment(enrollment) {
    // Basic validation - adjust pattern based on your enrollment format
    return enrollment.length >= 6 && /^[A-Za-z0-9]+$/.test(enrollment);
}

function validateMobile(mobile) {
    return /^[6-9]\d{9}$/.test(mobile);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

// Loading Functions
function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

/* ============================================
   API SIMULATION FUNCTIONS
   Replace these with actual API calls
   ============================================ */

// Simulate sending OTP
async function sendOTP(mobile) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (in production, call your OTP API)
            console.log(`OTP sent to ${mobile}`);
            
            // For demo, we'll use a fixed OTP: 123456
            // In production, this would be handled by your backend
            resolve({ success: true, message: 'OTP sent successfully' });
            
        }, 1500);
    });
}

// Simulate OTP verification
async function verifyOTP(mobile, otp) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // For demo, accept OTP "123456"
            // In production, verify with your backend
            if (otp === '123456') {
                resolve({ success: true, message: 'OTP verified' });
            } else {
                reject(new Error('Invalid OTP. Please try again.'));
            }
        }, 1500);
    });
}

// Check if user exists
async function checkUserExists(enrollment) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Check localStorage for existing user
            const existingUsers = JSON.parse(localStorage.getItem('campusly_users') || '[]');
            const userExists = existingUsers.some(user => user.enrollment === enrollment);
            resolve(userExists);
        }, 500);
    });
}

// Create user profile
async function createUserProfile(profileData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Save to localStorage (in production, save to database)
            const existingUsers = JSON.parse(localStorage.getItem('campusly_users') || '[]');
            existingUsers.push(profileData);
            localStorage.setItem('campusly_users', JSON.stringify(existingUsers));
            resolve({ success: true });
        }, 1000);
    });
}

// Upload profile picture
async function uploadProfilePicture(file) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In production, upload to cloud storage
            console.log('Profile picture uploaded:', file.name);
            resolve({ success: true, url: URL.createObjectURL(file) });
        }, 1000);
    });
}

/* ============================================
   REAL OTP IMPLEMENTATION GUIDE
   ============================================ */

/*
To implement real OTP functionality, you'll need a backend service.
Here's how to integrate with popular OTP providers:

1. TWILIO (SMS OTP)
-------------------
Backend (Node.js):

const twilio = require('twilio');
const client = twilio(accountSid, authToken);

// Send OTP
app.post('/api/send-otp', async (req, res) => {
    const { mobile } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Store OTP in database with expiry
    await storeOTP(mobile, otp);
    
    // Send via Twilio
    await client.messages.create({
        body: `Your Campusly OTP is: ${otp}`,
        from: '+1234567890',
        to: `+91${mobile}`
    });
    
    res.json({ success: true });
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
    const { mobile, otp } = req.body;
    const isValid = await verifyStoredOTP(mobile, otp);
    res.json({ success: isValid });
});


2. MSG91 (Popular in India)
---------------------------
const axios = require('axios');

app.post('/api/send-otp', async (req, res) => {
    const { mobile } = req.body;
    
    const response = await axios.get(
        `[api.msg91.com](https://api.msg91.com/api/v5/otp)`,
        {
            params: {
                authkey: 'YOUR_AUTH_KEY',
                mobile: `91${mobile}`,
                otp_length: 6,
                template_id: 'YOUR_TEMPLATE_ID'
            }
        }
    );
    
    res.json({ success: true });
});


3. Firebase Phone Auth
----------------------
Frontend:

import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// Setup reCAPTCHA
const auth = getAuth();
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);

// Send OTP
const confirmationResult = await signInWithPhoneNumber(
    auth,
    `+91${mobile}`,
    window.recaptchaVerifier
);

// Verify OTP
const result = await confirmationResult.confirm(otp);


4. Backend Integration Example
------------------------------
// Update the sendOTP function to call your API:

async function sendOTP(mobile) {
    const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
    });
    
    if (!response.ok) {
        throw new Error('Failed to send OTP');
    }
    
    return response.json();
}

async function verifyOTP(mobile, otp) {
    const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp })
    });
    
    const data = await response.json();
    
    if (!data.success) {
        throw new Error('Invalid OTP');
    }
    
    return data;
}

*/
