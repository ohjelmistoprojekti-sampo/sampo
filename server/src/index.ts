import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import { connectToDatabase, findItems } from './dbAccess.js';

const app: Express = express();
const port = 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// route to index.html
app.use('/', express.static('client/public'))

app.get('/pictures/:item', async (req: Request, res: Response) => {
  console.log('Fetching images');
  try {
    const query = {
      title: {
        $regex: new RegExp(req.params.item, 'i'), // 'i' makes the regex case-insensitive
      },
    };

    const foundItems = await findItems(query);
    const images = foundItems.map((item) => {
      return item.image;
    });
    console.log('Images found sending to client....')
    res.send([
      { id: 1, url: images[0] },
      { id: 2, url: images[1] },
      { id: 3, url: images[2] }
    ]);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get('/pictures', (req: Request, res: Response) => {
  const pictures: Array<{ id: number, url: string }> = [
    { id: 1, url: 'path/to/image1.jpg' },
    { id: 2, url: 'path/to/image2.jpg' },
    { id: 3, url: 'path/to/image3.jpg' }
  ];
  res.send(pictures);
});

// submit item description
app.post('/submit-item-description', (req: Request, res: Response) => {
  const { description } = req.body;
  console.log(`Received Item Description: ${description}`);
  res.status(200).send({ message: 'Description received successfully' });
});

// get prices from price-estimation-service
app.post('/submit-selection', async (req: Request, res: Response) => {
  const { description, condition } = req.body;
  
  try {
    const priceEstimationServiceResponse = await fetch(`https://sampo-pe.rahtiapp.fi/estimate-price?item_description=${description}&condition=${condition}`);
    if (!priceEstimationServiceResponse.ok) throw new Error('Failed to fetch from price-estimation-service');

    const responseData = await priceEstimationServiceResponse.json();
    const prices = responseData.estimated_price;
    console.log(prices);

    res.send({prices});
  } catch (e) {
    console.error('Error fetching from price-estimation-service:', e);
    res.status(500).send('Error fetching from price-estimation-service');
  }
});

// path for uploaded image files
const upload = multer({ dest: 'server/uploads/' });

// handle file upload
app.post('/upload', upload.single('photo'), (req: Request, res: Response) => {

  if (req.file) {
    // use the file here
    console.log(req.file);

    // delete the file after done with it
    fs.unlink(req.file.path, (error) => {
      if (error) {
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
// database
(async () => {
  try {
    await connectToDatabase();
    console.log("Connected to the database.");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the application on database connection error
  }
})();