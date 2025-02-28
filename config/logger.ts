import pino from 'pino';
import fs from 'fs';
import path from 'path';

// Define the log file path
const logFilePath = path.join(process.cwd(), 'logs', 'app.log');

// Ensure the logs directory exists
const logDirectory = path.dirname(logFilePath);
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Create the log file if it doesn't exist
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, ''); // Create an empty file
}

// Create a logger with a custom timestamp format
const logger = pino(
    {
        timestamp: () => `,"time":"${new Date().toISOString()}"`, // Custom timestamp
    },
    pino.destination(logFilePath) // Write to the file
);

export default logger;