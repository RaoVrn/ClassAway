
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();
// Serve uploads folder for attachments (after app is initialized)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dotenv.config();
connectDB();



app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
const odRoutes = require('./routes/odRoutes');
const placementRoutes = require('./routes/placementRoutes');
app.use('/api/od', odRoutes);
app.use('/api/placement', placementRoutes);

app.get('/', (req, res) => {
  res.send('🚀 ClassAway API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
