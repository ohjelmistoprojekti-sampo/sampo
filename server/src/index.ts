import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';

const app: Express = express();
const port = 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// route to index.html
app.use('/', express.static('client/public'))

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

// path for uploaded image files
const upload = multer({ dest: 'server/uploads/' });

//handle file upload
app.post('/upload', upload.single('photo'), (req: Request, res: Response) => {
  
  if(req.file) {
    // use the file here
    console.log(req.file);

    // delete the file after done with it
    fs.unlink(req.file.path, (error) => {
      if(error) {
        console.log(error);
      } else {
        console.log("File deleted.");
      }

      res.status(200).json({ message: 'File uploaded successfully' });
    });

  } else {
    return res.status(400).json({ error: 'File upload failed' });    
  }

});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});