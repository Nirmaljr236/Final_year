const express = require('express');
const mysql = require('mysql');
const path = require('path');
const Web3 = require('web3');

// Initialize Express
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password', // Use the password you set during MySQL installation
    database: 'farmers_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Initialize Web3
const web3 = new Web3('https://sepolia.org'); // Sepolia Testnet RPC URL

// Replace with your deployed contract's address and ABI
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contractABI = [
    // Your contract's ABI here
];

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to generate Farmer ID
function generateFarmerID() {
    return Math.floor(10000000 + Math.random() * 90000000);
}

// Farmer Signup Route
app.post('/farmer-signup', (req, res) => {
    const { name, email, password, mobile, country, state } = req.body;

    // Check if email already exists
    let checkSql = 'SELECT * FROM farmers WHERE email = ?';
    db.query(checkSql, [email], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.status(400).send({ message: 'This email is already registered. Please log in instead.' });
        } else {
            const farmerID = generateFarmerID();
            const farmerData = { id: farmerID, name, email, password, mobile, country, state };

            let sql = 'INSERT INTO farmers SET ?';
            db.query(sql, farmerData, (err, result) => {
                if (err) throw err;
                res.send({ message: 'Farmer added successfully', farmerID });
            });
        }
    });
});

// Farmer Login Route
app.post('/farmer-login', (req, res) => {
    const { email, password } = req.body;

    let sql = 'SELECT * FROM farmers WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            res.send({ message: 'Login successful', farmerData: results[0] });
        } else {
            res.status(401).send({ message: 'Invalid email or password' });
        }
    });
});

// Government Login Route
app.post('/government-login', (req, res) => {
    const { email, password } = req.body;

    const governmentEmail = 'govt24@gmail.com';
    const governmentPassword = 'govt@2024';

    if (email === governmentEmail && password === governmentPassword) {
        res.send({ message: 'Login successful', governmentData: { email: governmentEmail } });
        // window.location.href = 'government-dashboard';
    } else {
        res.status(401).send({ message: 'Invalid email or password' });
    }
});

// Government Initiates a Loan Scheme
app.post('/initiate-scheme', async (req, res) => {
    const { schemeName, schemeAmount, expiryDate, description } = req.body;
    const fromAddress = 'YOUR_METAMASK_ADDRESS'; // Replace with your MetaMask address

    try {
        const tx = await contract.methods.initiateScheme(schemeName, web3.utils.toWei(schemeAmount, 'ether'), expiryDate, description)
            .send({ from: fromAddress, gas: 3000000 });
        res.send({ message: 'Scheme initiated successfully', transactionHash: tx.transactionHash });
    } catch (err) {
        res.status(500).send({ message: 'Error initiating scheme', error: err });
    }
});

// Farmer Applies for a Scheme
app.post('/apply-scheme', async (req, res) => {
    const { farmerID, schemeID } = req.body;
    const fromAddress = 'YOUR_METAMASK_ADDRESS';

    try {
        const tx = await contract.methods.applyForScheme(farmerID, schemeID)
            .send({ from: fromAddress, gas: 3000000 });
        res.send({ message: 'Scheme applied successfully', transactionHash: tx.transactionHash });
    } catch (err) {
        res.status(500).send({ message: 'Error applying for scheme', error: err });
    }
});

// Government Approves Loan Request
app.post('/approve-request', async (req, res) => {
    const { requestID } = req.body;
    const fromAddress = 'YOUR_METAMASK_ADDRESS';

    try {
        const tx = await contract.methods.approveRequest(requestID)
            .send({ from: fromAddress, gas: 3000000 });
        res.send({ message: 'Loan request approved', transactionHash: tx.transactionHash });
    } catch (err) {
        res.status(500).send({ message: 'Error approving request', error: err });
    }
});

// Government Denies Loan Request
app.post('/deny-request', async (req, res) => {
    const { requestID, reason } = req.body;
    const fromAddress = 'YOUR_METAMASK_ADDRESS';

    try {
        const tx = await contract.methods.denyRequest(requestID, reason)
            .send({ from: fromAddress, gas: 3000000 });
        res.send({ message: 'Loan request denied', transactionHash: tx.transactionHash });
    } catch (err) {
        res.status(500).send({ message: 'Error denying request', error: err });
    }
});

// Farmer Acknowledges Loan Receipt
app.post('/acknowledge-loan', async (req, res) => {
    const { farmerID, loanID } = req.body;
    const fromAddress = 'YOUR_METAMASK_ADDRESS';

    try {
        const tx = await contract.methods.acknowledgeLoan(farmerID, loanID)
            .send({ from: fromAddress, gas: 3000000 });
        res.send({ message: 'Loan acknowledged', transactionHash: tx.transactionHash });
    } catch (err) {
        res.status(500).send({ message: 'Error acknowledging loan', error: err });
    }
});

// Frontend Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/farmer-signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'farmer-signup.html'));
});

app.get('/farmer-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'farmer-login.html'));
});

app.get('/government-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'government-login.html'));
});

// Start server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
