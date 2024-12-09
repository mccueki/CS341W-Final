import { JSONFilePreset } from "lowdb/node";
import bcrypt from 'bcryptjs'; // For password hashing (you can install bcryptjs using npm)

const initialData = {
  users: [], // List of users
};

// Initialize the lowdb database
let db = await JSONFilePreset("db.json", initialData);

//--------------user functions--------------------------------

// Function to get all users
async function getUsers() {
  await db.read();
  return db.data.users; // Returns list of users
}

// Add user
async function addUser(username, password) {
  await db.read();

  // Check if user already exists
  const existingUser = db.data.users.find(user => user.username === username);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add new user
  const newUser = { 
    username, 
    password: hashedPassword, 
    balances: [
      { day: 'mon', amount: 0 },
      { day: 'tue', amount: 0 },
      { day: 'wed', amount: 0 },
      { day: 'thu', amount: 0 },
      { day: 'fri', amount: 0 },
      { day: 'sat', amount: 0 },
      { day: 'sun', amount: 0 },
    ], 
    bankBalance: 0,
  };
  
  db.data.users.push(newUser);
  await db.write();
}

// Function to authenticate a user (login)
async function authenticateUser(username, password) {
  await db.read();
  
  // Find user by username
  const user = db.data.users.find(user => user.username === username);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Compare password with stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return user; // Return user object if authentication is successful
}

// Set active user (after login)
let activeUser = null;
async function setActiveUser(user) {
  activeUser = user;
}

// Function to reset a user's password
async function resetPassword(username, newPassword) {
  await db.read();
  
  // Find user by username
  const user = db.data.users.find(user => user.username === username);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Update the user's password in the database
  user.password = hashedPassword;

  await db.write();  // Persist the changes to the database
  
  return `Password for ${username} has been reset successfully.`;
}

//----------------------------------------------------------------------

//----------bank balance functions--------------------------------------

// Function to get the current user's bank balance
async function getBankBalance() {
  if (!activeUser) {
    throw new Error('No user is logged in');
  }
  return activeUser.bankBalance; // Return the logged-in user's bank balance
}

// Function to update the current user's bank balance
async function updateBankBalance(amount) {
  if (!activeUser) {
    throw new Error('No user is logged in');
  }

  activeUser.bankBalance = amount;  // Set the new bank balance
  await db.write();  // Persist the changes to the database
}

//--------------------------------------------------------------------------

//-----------------------daily balances functions---------------------------

// Function to get the current user's balances
async function getBalances() {
  if (!activeUser) {
    throw new Error('No user is logged in');
  }
  return activeUser.balances; // Return the logged-in user's balances
}
// Function to add a certain amount to the current user's daily balance
async function addBalance(day, amountToAdd) {
  if (!activeUser) {
    throw new Error('No user is logged in');
  }

  const balance = activeUser.balances.find((b) => b.day === day);
  if (balance) {
    balance.amount += amountToAdd;
    await db.write();  // Persist the changes to the database
  }
}

// Function to set a balance (daily or bank) for the current user
async function setBalance(day, amount) {
  if (!activeUser) {
    throw new Error('No user is logged in');
  }

  const existingBalance = activeUser.balances.find((b) => b.day === day);
  if (existingBalance) {
    existingBalance.amount = amount;
  } else {
    activeUser.balances.push({ day, amount });
  }

  await db.write();  // Persist the changes to the database
}

//--------------------------------------------------------------------

export const database = {
  getUsers,          // List users
  addUser,           // Add new user (registration)
  authenticateUser,  // Authenticate user (login)
  setActiveUser,     // Set the logged-in user
  getBalances,       // Get current user's balances
  addBalance,        // Add to a daily balance
  setBalance,        // Set a daily balance
  getBankBalance,    // Get current user's bank balance
  updateBankBalance, // Update current user's bank balance
  resetPassword      // Update user's password
};
