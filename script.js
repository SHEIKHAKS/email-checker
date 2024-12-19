<script>
// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// Disposable email domains list URL
const DISPOSABLE_DOMAINS_URL = "https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains_strict.txt";

// Fetch the list of disposable email domains
async function fetchDisposableDomains() {
    try {
        const response = await fetch(DISPOSABLE_DOMAINS_URL);
        const text = await response.text();
        return text.split('\n');
    } catch (error) {
        console.error("Error fetching disposable domains list.");
        return [];
    }
}

// Function to check if the domain has valid MX records (simplified version)
async function hasValidMX(domain) {
    const url = `https://dns.google/resolve?name=${domain}&type=MX`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.Answer && data.Answer.length > 0;  // Check if MX records are available
    } catch (error) {
        return false;  // No MX records found, return false
    }
}

// Function to check if the domain is from a disposable email provider
function isDisposableEmail(domain, disposableDomains) {
    return disposableDomains.includes(domain);
}

// Function to check if the domain is a catch-all (simplified version)
async function isCatchAll(domain) {
    const testEmail = `random1234test@${domain}`;
    return await hasValidMX(domain); // If MX records exist, assume it may be a catch-all
}

// Function to check the email onblur (or on form submit validation)
async function checkEmail() {
    const email = document.getElementById('Signup_email').value;
    const domain = email.split('@').pop();
    const disposableDomains = await fetchDisposableDomains();

    // Check syntax
    if (!EMAIL_REGEX.test(email)) {
        alert('Please provide a valid email address before submitting');
        document.getElementById('Signup_email').value = ''; // Clear the email value
        return false;
    }

    // Check if disposable
    if (isDisposableEmail(domain, disposableDomains)) {
        alert('Please provide a valid email address before submitting');
        document.getElementById('Signup_email').value = ''; // Clear the email value
        return false;
    }

    // Check MX record
    const isValidMX = await hasValidMX(domain);
    if (!isValidMX) {
        alert('Please provide a valid email address before submitting.');
        document.getElementById('Signup_email').value = ''; // Clear the email value
        return false;
    }


}

// Form validation before submission
async function validateForm() {
    const isValid = await checkEmail(); // Ensure email passes all checks before submitting the form
    
    if (!isValid) {
        alert('Please provide a valid email address before submitting.4');
        document.getElementById('Signup_email').value = ''; // Clear the email value
    }

    return isValid; // Return false to prevent form submission if the email is invalid
}
</script>
