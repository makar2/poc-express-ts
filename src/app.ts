import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/favicon.ico', (req, res) => res.status(204));
app.get('/', (req, res) => {
  const response = {
    status: 'ok',
    message: 'Hello TypeScript',
  };
  res.json(response);
});

app.use((req, res) => res.sendStatus(404));

app.use((
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  res.status(err.status ?? 500);
  res.json({ err });
});

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
  console.info(`listening on port ${port}`);
});
