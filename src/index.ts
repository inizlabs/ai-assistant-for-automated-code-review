import express from 'express';
import analyzeRouter from './api/analyze';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/analyze', analyzeRouter);

app.get('/', (_req, res) => {
  res.send('AI Assistant for Automated Code Review - API is running');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
