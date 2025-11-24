const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In‑memory storage
let users = [];
let transactions = [];
let communityGroups = [];
let savingsGoals = [];

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);
const findUserByEmail = (email) => users.find(u => u.email === email);
const findUserById = (id) => users.find(u => u.id === id);
const findTransactionsByUserId = (userId) => transactions.filter(t => t.userId === userId);
const findGoalsByUserId = (userId) => savingsGoals.filter(g => g.userId === userId);
const findGroupsByUserId = (userId) => communityGroups.filter(g => g.members.includes(userId));

// Demo user ID (consistent across restarts)
const DEMO_USER_ID = 'demo-user-id';

// Auth middleware – bypassed for demo purposes
const authenticateToken = (req, res, next) => {
  const demoUser = users.find(u => u.email === 'demo@kingdompay.com');
  req.user = { userId: demoUser?.id || DEMO_USER_ID, email: 'demo@kingdompay.com' };
  next();
};

// ---------- Auth routes ----------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (findUserByEmail(email)) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: generateId(), email, password: hashedPassword, firstName, lastName, phone, balance: 1234.56, savingsBalance: 16000.00, createdAt: new Date() };
    users.push(user);
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    res.status(201).json({ message: 'User created successfully', token, user: { id: user.id, email: user.email, firstName, lastName, balance: user.balance, savingsBalance: user.savingsBalance } });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, balance: user.balance, savingsBalance: user.savingsBalance } });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// ---------- User routes ----------
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = findUserById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password, ...rest } = user;
    res.json(rest);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    const idx = users.findIndex(u => u.id === req.user.userId);
    if (idx === -1) return res.status(404).json({ message: 'User not found' });
    users[idx] = { ...users[idx], firstName, lastName, phone, avatar };
    const { password, ...rest } = users[idx];
    res.json(rest);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// ---------- Transaction routes ----------
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const list = findTransactionsByUserId(req.user.userId).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

app.post('/api/transactions/add-money', authenticateToken, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    const idx = users.findIndex(u => u.id === req.user.userId);
    if (idx === -1) return res.status(404).json({ message: 'User not found' });
    users[idx].balance += parseFloat(amount);
    const transaction = { id: generateId(), userId: req.user.userId, type: 'credit', amount: parseFloat(amount), description: `Added money via ${paymentMethod || 'Bank Transfer'}`, category: 'Deposit', merchant: paymentMethod || 'Bank', date: new Date() };
    transactions.push(transaction);
    res.status(201).json({ message: 'Money added successfully', transaction, newBalance: users[idx].balance });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

app.post('/api/transactions/send-money', authenticateToken, async (req, res) => {
  try {
    const { recipientEmail, amount, note } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    const senderIdx = users.findIndex(u => u.id === req.user.userId);
    if (senderIdx === -1) return res.status(404).json({ message: 'Sender not found' });
    if (users[senderIdx].balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    users[senderIdx].balance -= parseFloat(amount);
    const transaction = { id: generateId(), userId: req.user.userId, type: 'debit', amount: parseFloat(amount), description: note || `Sent to ${recipientEmail}`, category: 'Transfer', merchant: 'KingdomPay', date: new Date() };
    transactions.push(transaction);
    res.status(201).json({ message: 'Money sent successfully', transaction, newBalance: users[senderIdx].balance });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// ---------- Savings routes ----------
app.get('/api/savings/goals', authenticateToken, async (req, res) => {
  try {
    const goals = findGoalsByUserId(req.user.userId);
    res.json(goals);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

app.post('/api/savings/goals', authenticateToken, async (req, res) => {
  try {
    const { name, targetAmount, icon } = req.body;
    const goal = { id: generateId(), userId: req.user.userId, name, targetAmount, currentAmount: 0, icon, createdAt: new Date() };
    savingsGoals.push(goal);
    res.status(201).json(goal);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// ---------- Community routes ----------
app.get('/api/community/groups', authenticateToken, async (req, res) => {
  try {
    const groups = findGroupsByUserId(req.user.userId);
    res.json(groups);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

app.post('/api/community/groups/:id/contribute', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const contribution = parseFloat(amount);
    if (!contribution || contribution <= 0) return res.status(400).json({ message: 'Invalid amount' });
    const group = communityGroups.find(g => g.id === id && g.members.includes(req.user.userId));
    if (!group) return res.status(404).json({ message: 'Group not found' });
    const userIdx = users.findIndex(u => u.id === req.user.userId);
    if (userIdx === -1) return res.status(404).json({ message: 'User not found' });
    if (users[userIdx].balance < contribution) return res.status(400).json({ message: 'Insufficient balance' });
    // Deduct from user and add to group
    users[userIdx].balance -= contribution;
    group.balance += contribution;
    // Record transaction (optional)
    const transaction = { id: generateId(), userId: req.user.userId, type: 'debit', amount: contribution, description: `Contribution to ${group.name}`, category: 'Community', merchant: group.name, date: new Date() };
    transactions.push(transaction);
    res.json({ message: 'Contribution successful', groupBalance: group.balance, userBalance: users[userIdx].balance, transaction });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// ---------- Demo data seeding ----------
const seedDemoData = async () => {
  // Ensure demo user exists
  if (!findUserByEmail('demo@kingdompay.com')) {
    const hashed = await bcrypt.hash('password123', 10);
    users.push({ id: DEMO_USER_ID, email: 'demo@kingdompay.com', password: hashed, firstName: 'Demo', lastName: 'User', phone: '123-456-7890', balance: 1234.56, savingsBalance: 16000.00, createdAt: new Date() });
  }
  // Seed transactions
  if (transactions.length === 0) {
    transactions.push(
      { id: generateId(), userId: DEMO_USER_ID, type: 'debit', amount: 3.25, description: 'Starbucks', category: 'Food & Drink', merchant: 'Starbucks', date: new Date() },
      { id: generateId(), userId: DEMO_USER_ID, type: 'credit', amount: 200.00, description: 'Bank Deposit', category: 'Transfer', merchant: 'Bank', date: new Date(Date.now() - 86400000) },
      { id: generateId(), userId: DEMO_USER_ID, type: 'debit', amount: 49.99, description: 'Amazon.com', category: 'Shopping', merchant: 'Amazon', date: new Date(Date.now() - 172800000) }
    );
  }
  // Seed savings goals
  if (savingsGoals.length === 0) {
    savingsGoals.push(
      { id: generateId(), userId: DEMO_USER_ID, name: 'Home', targetAmount: 5000, currentAmount: 2000, icon: 'home', createdAt: new Date() },
      { id: generateId(), userId: DEMO_USER_ID, name: 'Car', targetAmount: 5000, currentAmount: 4000, icon: 'directions_car', createdAt: new Date() },
      { id: generateId(), userId: DEMO_USER_ID, name: 'Vacation', targetAmount: 5000, currentAmount: 3000, icon: 'flight', createdAt: new Date() }
    );
  }
  // Seed community groups
  if (communityGroups.length === 0) {
    communityGroups.push(
      { id: generateId(), name: 'The Faith Community', type: 'church', description: 'Church Group', balance: 15480.50, members: [DEMO_USER_ID], createdBy: DEMO_USER_ID, createdAt: new Date() },
      { id: generateId(), name: 'The Family Fund', type: 'family', description: 'Family Group', balance: 2750.00, members: [DEMO_USER_ID], createdBy: DEMO_USER_ID, createdAt: new Date() },
      { id: generateId(), name: 'Kingdom Entrepreneurs', type: 'sacco', description: 'SACCO', balance: 58230.75, members: [DEMO_USER_ID], createdBy: DEMO_USER_ID, createdAt: new Date() }
    );
  }
  console.log('Demo data seeded successfully');
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedDemoData();
});