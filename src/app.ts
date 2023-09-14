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
  const param = req.query.param;
  let questions: {}[] = [{ question: 'Question1', answer: '' }, { question: 'Question2', answer: '' }];

  res.send(questions);
})

app.post('/submit-description', (req: Request, res: Response) => {
  const itemDescription: string = req.body.itemDescription;

  /* Placeholder response to send itemDescription.
   Change to redirect when the estimation form is done. */
  res.send(itemDescription);
});

app.post('/submit-form', (req: Request, res: Response) => {
  const formData = req.body;
  console.log(req.body);
  const result = `
  <div><h3>Vaihtoehto 1: Halpa ja nopea</h3><p>10 euroa</p></div>
  <div><h3>Vaihtoehto 2: Keskihinta (suositeltu) </h3><p>30 euroa</p></div>  
  <div><h3>Vaihtoehto 3: Kallis ja hidas</h3><p>50 euroa</p></div>`;
  
  res.send(result);
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});