import express from 'express';
import logger from './config/logger.js';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

app.get('/', (req, res) => {
  logger.info('Received request to root endpoint');
  res.status(200).send('hello from acquisitions');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: `${process.uptime().toFixed(2)}s`,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisitions API is running' });
});

app.use('/api/auth', authRoutes);

export default app;
