// --- DOM Element References ---
const passwordInput = document.getElementById('password-input');
const togglePasswordBtn = document.getElementById('toggle-password');
const eyeIcon = document.getElementById('eye-icon');
const eyeOffIcon = document.getElementById('eye-off-icon');
const rulesList = document.getElementById('rules-list');
const saveBtn = document.getElementById('save-btn');
const israelModal = document.getElementById('israel-modal');
const closeIsraelModalBtn = document.getElementById('close-israel-modal-btn');
const successModal = document.getElementById('success-modal');
const closeSuccessModalBtn = document.getElementById('close-success-modal-btn');
const timeWastedSpan = document.getElementById('time-wasted');
const errorMessage = document.getElementById('error-message');

// --- Dark Mode Logic ---
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;
const toggleBall = document.getElementById('toggleBall');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function setTheme(isDark) {
    if (isDark) {
        htmlElement.classList.add('dark');
        toggleBall.style.transform = 'translateX(24px)';
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        localStorage.setItem('theme', 'dark');
    } else {
        htmlElement.classList.remove('dark');
        toggleBall.style.transform = 'translateX(0)';
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        localStorage.setItem('theme', 'light');
    }
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
const initialThemeIsDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
setTheme(initialThemeIsDark);
darkModeToggle.checked = initialThemeIsDark;
darkModeToggle.addEventListener('change', () => setTheme(darkModeToggle.checked));

// --- Prank Logic ---
let startTime = null;
const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Botswana","Brazil","Brunei","Bulgaria","Burundi","Cambodia","Cameroon","Canada","Chad","Chile","China","Colombia","Comoros","Congo","Croatia","Cuba","Cyprus","Denmark","Djibouti","Dominica","Ecuador","Egypt","Eritrea","Estonia","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palau","Panama","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Samoa","Senegal","Serbia","Seychelles","Singapore","Slovakia","Slovenia","Somalia","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tonga","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];
const countryRegex = new RegExp(countries.join('|'), 'i');

const rules = [
    { text: "Must be at least 8 characters long", check: val => val.length >= 8 },
    { text: "Must contain an uppercase letter", check: val => /[A-Z]/.test(val) },
    { text: "Must contain a number", check: val => /[0-9]/.test(val) },
    { text: "Must contain a special character", check: val => /[!@#$%^&*(),.?":{}|<>]/.test(val) },
    { text: "Must include the current month", check: val => new RegExp(new Date().toLocaleString('default', { month: 'long' }), 'i').test(val) },
    { text: "Must include the current year", check: val => val.includes(new Date().getFullYear()) },
    { text: "Must include a country name", check: val => countryRegex.test(val) },
];

let revealedRules = [];

function addRule() {
    if (revealedRules.length < rules.length) {
        const nextRuleIndex = revealedRules.length;
        revealedRules.push({ ...rules[nextRuleIndex], isMet: false });
        renderRules();
    }
}

function renderRules() {
    rulesList.innerHTML = '';
    revealedRules.forEach(rule => {
        const li = document.createElement('li');
        li.className = `rule-item flex items-center rule-in ${rule.isMet ? 'valid' : ''}`;
        
        const iconContainer = document.createElement('div');
        iconContainer.className = 'w-4 h-4 mr-2 flex-shrink-0';

        if (rule.isMet) {
            iconContainer.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>`;
        } else {
            iconContainer.innerHTML = `<span class="text-lg leading-none">•</span>`;
        }

        const textContainer = document.createElement('span');
        textContainer.textContent = rule.text;

        li.appendChild(iconContainer);
        li.appendChild(textContainer);
        rulesList.appendChild(li);
    });
}

passwordInput.addEventListener('input', () => {
    if (!startTime) {
        startTime = new Date(); // Start timer on first input
    }
    errorMessage.classList.add('hidden');
    const currentValue = passwordInput.value;

    if (currentValue.toLowerCase().includes('israel')) {
        israelModal.classList.remove('hidden');
        return;
    }

    if (revealedRules.length === 0) {
        addRule();
    }
    
    let allRevealedMet = true;
    revealedRules.forEach(rule => {
        rule.isMet = rule.check(currentValue);
        if (!rule.isMet) {
            allRevealedMet = false;
        }
    });
    
    renderRules();

    if (allRevealedMet) {
        setTimeout(addRule, 500);
    }
});

saveBtn.addEventListener('click', () => {
    const allRulesMet = revealedRules.every(rule => rule.isMet);
    if (revealedRules.length < rules.length || !allRulesMet) {
        errorMessage.classList.remove('hidden');
    } else {
        const endTime = new Date();
        const timeDiff = Math.round((endTime - startTime) / 1000);
        timeWastedSpan.textContent = timeDiff;
        successModal.classList.remove('hidden');
    }
});

function closeIsraelModal() {
    israelModal.classList.add('hidden');
    passwordInput.value = '';
    passwordInput.focus();
}

function closeSuccessModal() {
    successModal.classList.add('hidden');
}

israelModal.addEventListener('click', closeIsraelModal);
closeIsraelModalBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeIsraelModal();
});

successModal.addEventListener('click', closeSuccessModal);
closeSuccessModalBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSuccessModal();
});

togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    eyeIcon.classList.toggle('hidden');
    eyeOffIcon.classList.toggle('hidden');
});
