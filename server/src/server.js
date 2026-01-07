const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config({ path: '../.env' }); // Reaches up to the root.env

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: "Node server online" }));
app.use('/api/auth', authRoutes);

app.get('/api/users/me', protect, (req, res) => {
  res.json(req.user);
});

const PORT = process.env.PORT |

5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));