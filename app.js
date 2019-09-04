import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index.routes';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.log(err);
  return next(err);
});

export default app;

