import express from 'express';
import cors from 'cors';
import { database } from './db.js'; 
import { engine } from 'express-handlebars';  
import bcrypt from 'bcryptjs'; // To hash

const app = express();
const port = 3000;

app.engine('hbs', engine({
  extname: 'hbs',  
  defaultLayout: 'main', 
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Middleware
app.use(cors());  // Enable CORS to allow requests from the frontend
app.use(express.json());  // Parse JSON request bodies

// Store the logged-in user in memory
let activeUser = null;

app.get('/', (req, res) => {
  res.render('index', { message: 'Welcome to the backend server!' });
});

//-----------------------user routes---------------------------------------

// Route for registration (sign-up)
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Register the new user
    await database.addUser(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route for login (authentication)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Authenticate the user
    const user = await database.authenticateUser(username, password);
    await database.setActiveUser(user);  // Set active user after successful authentication
    activeUser = user; // Set the activeUser to the one returned by database
    res.status(200).json({ message: 'Login successful', username: user.username });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).json({ message: error.message });
  }
});

// Route for logging out (clear active user)
app.post('/api/logout', (req, res) => {
  activeUser = null;  // Clear the active user
  res.status(200).json({ message: 'Logged out successfully' });
});

// Middleware to check if a user is logged in
function isAuthenticated(req, res, next) {
  if (!activeUser) {
    return res.status(401).json({ message: 'You must be logged in' });
  }
  next();
}

app.get('/api/current-user', isAuthenticated, (req, res) => {
  res.status(200).json({
    username: activeUser.username, // Displaying only username
  });
});

// Route to reset password
app.post('/api/reset-password/:username', async (req, res) => {
  const { username } = req.params;
  const { newPassword } = req.body; // Get the new password from the request body

  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required' });
  }

  try {
    // Call the resetPassword function from the database module
    await database.resetPassword(username, newPassword);

    // If no error was thrown, return a success response
    res.status(200).json({ message: `Password reset successfully for ${username}.` });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});



//----------------------------------------------------------------------------

//-----------------daily balances------------------------------------

// Endpoint to fetch balances for the active user
app.get('/api/balances', isAuthenticated, async (req, res) => {
  try {
    const balances = await database.getBalances();
    res.json(balances);  // Return balances as JSON for the logged-in user
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(500).json({ message: 'Error fetching balances' });
  }
});

// Route to display balances in the view (for the active user)
app.get('/balances', isAuthenticated, async (req, res) => {
  try {
    const balances = await database.getBalances();
    res.render('balances', { balances });
  } catch (error) {
    console.error('Error fetching balances:', error);
    res.status(500).json({ message: 'Error fetching balances' });
  }
});

// Endpoint to add to a specific balance for a day (for the active user)
app.post('/api/balances/:day', isAuthenticated, async (req, res) => {
  const { day } = req.params;
  const { amount } = req.body;

  try {
    await database.addBalance(day, amount); // Update the balance for the active user
    const balances = await database.getBalances(); // Fetch updated balances
    res.json(balances); // Return updated balances as JSON
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ message: 'Error updating balance' });
  }
});

app.get('/backend-balances', async (req, res) => {
  try {
    const users = await database.getUsers();  // Fetch all users
    const userBalances = users.map(user => ({
      username: user.username,
      balances: user.balances,
      bankBalance: user.bankBalance,
    }));

    res.render('balances', { users: userBalances });
  } catch (error) {
    console.error('Error fetching users or balances:', error);
    res.status(500).json({ message: 'Error fetching users or balances' });
  }
});

//-------------------------------------------------------------------------------

//-----------------bank balance routes--------------------------------------

// Endpoint to get the bank balance for the active user
app.get('/api/get-bank-balance', isAuthenticated, async (req, res) => {
  try {
    const bankBalance = await database.getBankBalance();
    res.status(200).json({ bankBalance });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bank balance' });
  }
});

// Endpoint to update the bank balance for the active user
app.post('/api/update-bank-balance', isAuthenticated, async (req, res) => {
  const { amount } = req.body;

  if (typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    await database.updateBankBalance(amount);
    res.status(200).json({ message: 'Bank balance updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bank balance' });
  }
});

//----------------------------------------------------------------------

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
