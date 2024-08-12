const { eth } = require("web3");

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Web3
    let web3;
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        window.ethereum.request({ method: 'eth_requestAccounts' }).catch((err) => {
            console.error('User denied account access', err);
            console.log(window.ethereum.request('eth_requestAccounts'));
        });
    } else {
        alert('Please install MetaMask to use this application.');
        return;
    }

    // Farmer Signup Form Submission
    document.getElementById('farmerSignupForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const mobile = document.getElementById('mobile').value;
        const country = document.getElementById('country').value;
        const state = document.getElementById('state').value;

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, mobile, country, state })
            });
            const result = await response.json();
            alert(result.message);
        } catch (err) {
            console.error('Error during signup', err);
            alert('Error during signup');
        }
    });

    // Farmer Login Form Submission
    document.getElementById('farmerLoginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/farmer-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (result.message === 'Login successful') {
                // Save user data to session storage or handle login success
                sessionStorage.setItem('farmerData', JSON.stringify(result.farmerData));
                alert('Login successful');
                window.location.href = '/farmer-dashboard.html'; // Redirect to the farmer dashboard
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error('Error during login', err);
            alert('Error during login');
        }
    });

    // Government Login Form Submission
    document.getElementById('governmentLoginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/government-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (result.message === 'Login successful') {
                // Handle login success
                sessionStorage.setItem('governmentData', JSON.stringify(result.governmentData));
                alert('Login successful');
                window.location.href = '/government-dashboard.html'; // Redirect to the government dashboard
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error('Error during login', err);
            alert('Error during login');
        }
    });

    // Apply for Scheme Form Submission
    document.getElementById('applySchemeForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const farmerID = document.getElementById('farmerID').value;
        const schemeID = document.getElementById('schemeID').value;

        try {
            const response = await fetch('/apply-scheme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ farmerID, schemeID })
            });
            const result = await response.json();
            alert(result.message);
        } catch (err) {
            console.error('Error applying for scheme', err);
            alert('Error applying for scheme');
        }
    });

    // Initiate Scheme Form Submission (for government)
    document.getElementById('initiateSchemeForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const schemeName = document.getElementById('schemeName').value;
        const schemeAmount = document.getElementById('schemeAmount').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const description = document.getElementById('description').value;

        try {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            const response = await fetch('/initiate-scheme', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schemeName, schemeAmount, expiryDate, description })
            });
            const result = await response.json();

            // Interact with smart contract here if needed

            alert(result.message);
        } catch (err) {
            console.error('Error initiating scheme', err);
            alert('Error initiating scheme');
        }
    });

    // Approve Request Form Submission (for government)
    document.getElementById('approveRequestForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const requestID = document.getElementById('requestID').value;

        try {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            const response = await fetch('/approve-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestID })
            });
            const result = await response.json();

            // Interact with smart contract here if needed

            alert(result.message);
        } catch (err) {
            console.error('Error approving request', err);
            alert('Error approving request');
        }
    });

    // Deny Request Form Submission (for government)
    document.getElementById('denyRequestForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const requestID = document.getElementById('requestID').value;
        const reason = document.getElementById('reason').value;

        try {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            const response = await fetch('/deny-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestID, reason })
            });
            const result = await response.json();

            // Interact with smart contract here if needed

            alert(result.message);
        } catch (err) {
            console.error('Error denying request', err);
            alert('Error denying request');
        }
    });

    // Acknowledge Loan Form Submission (for farmers)
    document.getElementById('acknowledgeLoanForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const farmerID = document.getElementById('farmerID').value;
        const loanID = document.getElementById('loanID').value;

        try {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            const response = await fetch('/acknowledge-loan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ farmerID, loanID })
            });
            const result = await response.json();

            // Interact with smart contract here if needed

            alert(result.message);
        } catch (err) {
            console.error('Error acknowledging loan', err);
            alert('Error acknowledging loan');
        }
    });
});
