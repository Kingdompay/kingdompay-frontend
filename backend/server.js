const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes
let users = [];
let transactions = [];
let communityGroups = [];
let savingsGoals = [];

// Helper functions for in-memory storage
const generateId = () => Math.random().toString(36).substr(2, 9);

const findUserByEmail = (email) => users.find(user => user.email === email);
const findUserById = (id) => users.find(user => user.id === id);
const findTransactionsByUserId = (userId) => transactions.filter(t => t.userId === userId);
const findGoalsByUserId = (userId) => savingsGoals.filter(g => g.userId === userId);
const findGroupsByUserId = (userId) => communityGroups.filter(g => g.members.includes(userId));

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: generateId(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      balance: 1234.56,
      savingsBalance: 16000.00,
      createdAt: new Date(),
    };

    users.push(user);

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance,
        savingsBalance: user.savingsBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance,
        savingsBalance: user.savingsBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// User routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    const userIndex = users.findIndex(user => user.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    users[userIndex] = { ...users[userIndex], firstName, lastName, phone, avatar };
    const { password, ...userWithoutPassword } = users[userIndex];
    
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Transaction routes
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const userTransactions = findTransactionsByUserId(req.user.userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
    res.json(userTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { type, amount, description, category, merchant } = req.body;
    const transaction = {
      id: generateId(),
      userId: req.user.userId,
      type,
      amount,
      description,
      category,
      merchant,
      date: new Date(),
    };

    transactions.push(transaction);

    // Update user balance
    const userIndex = users.findIndex(user => user.id === req.user.userId);
    if (userIndex !== -1) {
      if (type === 'credit') {
        users[userIndex].balance += amount;
      } else {
        users[userIndex].balance -= amount;
      }
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Savings routes
app.get('/api/savings/goals', authenticateToken, async (req, res) => {
  try {
    const goals = findGoalsByUserId(req.user.userId);
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/savings/goals', authenticateToken, async (req, res) => {
  try {
    const { name, targetAmount, icon } = req.body;
    const goal = {
      id: generateId(),
      userId: req.user.userId,
      name,
      targetAmount,
      currentAmount: 0,
      icon,
      createdAt: new Date(),
    };

    savingsGoals.push(goal);
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Community routes
app.get('/api/community/groups', authenticateToken, async (req, res) => {
  try {
    const groups = findGroupsByUserId(req.user.userId);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/community/groups', authenticateToken, async (req, res) => {
  try {
    const { name, type, description } = req.body;
    const group = {
      id: generateId(),
      name,
      type,
      description,
      balance: 0,
      members: [req.user.userId],
      createdBy: req.user.userId,
      createdAt: new Date(),
    };

    communityGroups.push(group);
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Seed data for demo
app.post('/api/seed', async (req, res) => {
  try {
    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = {
      id: generateId(),
      email: 'demo@kingdompay.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 234 567 890',
      balance: 1234.56,
      savingsBalance: 16000.00,
      createdAt: new Date(),
    };

    // Check if demo user already exists
    const existingUser = findUserByEmail('demo@kingdompay.com');
    if (!existingUser) {
      users.push(demoUser);
    }

    // Create demo transactions
    const demoTransactions = [
      {
        id: generateId(),
        userId: demoUser.id,
        type: 'debit',
        amount: 3.25,
        description: 'Starbucks',
        category: 'Food & Drink',
        merchant: 'Starbucks',
        date: new Date(),
      },
      {
        id: generateId(),
        userId: demoUser.id,
        type: 'credit',
        amount: 200.00,
        description: 'Bank Deposit',
        category: 'Transfer',
        merchant: 'Bank',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        id: generateId(),
        userId: demoUser.id,
        type: 'debit',
        amount: 49.99,
        description: 'Amazon.com',
        category: 'Shopping',
        merchant: 'Amazon',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    // Add transactions if they don't exist
    demoTransactions.forEach(transaction => {
      const exists = transactions.find(t => t.description === transaction.description);
      if (!exists) {
        transactions.push(transaction);
      }
    });

    // Create demo savings goals
    const demoGoals = [
      {
        id: generateId(),
        userId: demoUser.id,
        name: 'Home',
        targetAmount: 5000,
        currentAmount: 2000,
        icon: 'home',
        createdAt: new Date(),
      },
      {
        id: generateId(),
        userId: demoUser.id,
        name: 'Car',
        targetAmount: 5000,
        currentAmount: 4000,
        icon: 'directions_car',
        createdAt: new Date(),
      },
      {
        id: generateId(),
        userId: demoUser.id,
        name: 'Vacation',
        targetAmount: 5000,
        currentAmount: 3000,
        icon: 'flight',
        createdAt: new Date(),
      },
    ];

    // Add goals if they don't exist
    demoGoals.forEach(goal => {
      const exists = savingsGoals.find(g => g.name === goal.name && g.userId === demoUser.id);
      if (!exists) {
        savingsGoals.push(goal);
      }
    });

    // Create demo community groups
    const demoGroups = [
      {
        id: generateId(),
        name: 'The Faith Community',
        type: 'church',
        description: 'Church Group',
        balance: 15480.50,
        members: [demoUser.id],
        createdBy: demoUser.id,
        createdAt: new Date(),
      },
      {
        id: generateId(),
        name: 'The Family Fund',
        type: 'family',
        description: 'Family Group',
        balance: 2750.00,
        members: [demoUser.id],
        createdBy: demoUser.id,
        createdAt: new Date(),
      },
      {
        id: generateId(),
        name: 'Kingdom Entrepreneurs',
        type: 'sacco',
        description: 'SACCO',
        balance: 58230.75,
        members: [demoUser.id],
        createdBy: demoUser.id,
        createdAt: new Date(),
      },
    ];

    // Add groups if they don't exist
    demoGroups.forEach(group => {
      const exists = communityGroups.find(g => g.name === group.name);
      if (!exists) {
        communityGroups.push(group);
      }
    });

    res.json({ message: 'Demo data seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});