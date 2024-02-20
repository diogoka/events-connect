import express from 'express';
import pool from './db/db';
import usersRouter from './routes/usersRoutes';
import coursesRouter from './routes/coursesRoutes';
import eventsRouter from './routes/eventsRoutes';
import tagsRouter from './routes/tagsRoutes';
import locationRouter from './routes/locationRoutes';
import cors from 'cors';
import 'dotenv/config';

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE',
};

type Express = express.Application;

const app: Express = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Headers', 'application/json');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});

pool
  .connect()
  .then(() => console.log('Connected to database'))
  .catch((err) => console.log('Error connecting to database', err));

app.use('/api/users', usersRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/events', eventsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/location', locationRouter);

export default app;
