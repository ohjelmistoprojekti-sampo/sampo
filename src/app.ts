import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/questions', (req: Request, res: Response) => {
  const itemDescription = req.query.param;
  console.log(itemDescription);
  let questions: {}[] = [
  { question: 'Missä kunnossa tuote on?', answer: '' }, 
  { question: 'Kuinka vanha tuote on?', answer: '' },
  { question: 'Minkä värinen tuote on?', answer: '' }
];

  res.send(questions);
})

app.post('/submit-form', (req: Request, res: Response) => {
  const formData = req.body;
  console.log(formData);
  
  const prices: number[] = [10, 20, 30]
  
  res.send(prices);
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});