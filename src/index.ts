import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app: Express = express();

const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static('public'))

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