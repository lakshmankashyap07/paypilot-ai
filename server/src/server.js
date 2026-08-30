import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start Server and attempt DB connection
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 PayPilot AI Backend Server`);
    console.log(`📡 Server running on port: ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=================================`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`\n❌ PORT ${PORT} IS ALREADY IN USE!`);
      console.error(`Another Node.js server process is already running on port ${PORT}.`);
      console.error(`To fix this:`);
      console.error(`  - On Windows PowerShell: Stop the existing Node process or run: Get-Process node | Stop-Process -Force`);
      console.error(`  - Or kill the process using port 5000: npx kill-port 5000\n`);
      process.exit(1);
    } else {
      console.error('Server error:', error);
    }
  });
};

startServer();
