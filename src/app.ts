import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/questions', (req: Request, res: Response) => {
  const param = req.query.param;
  let questions: {}[] = [{question: 'Tuotteen merkki ja malli?', answer: ''}, {question: 'Tuotteen kunto', answer: ''}];

  res.send(questions);
})

app.post('/submit-description', (req: Request, res: Response) => {
  const itemDescription: string = req.body.itemDescription;

  /* Placeholder response to send itemDescription.
   Change to redirect when the estimation form is done. */
  res.send(itemDescription);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});