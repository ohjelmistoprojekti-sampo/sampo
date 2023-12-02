import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import { connectToDatabase } from './dbAccess.js';

const app: Express = express();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Route to index.html
app.use('/', express.static('client/public'))

// Submit item description
app.post('/submit-item-description', (req: Request, res: Response) => {
  const { description } = req.body;
  console.log(`Received Item Description: ${description}`);
  res.status(200).send({ message: 'Description received successfully' });
});

// Get prices from price-estimation-service
app.post('/submit-selection', async (req: Request, res: Response) => {
  const { description, condition } = req.body;
  
  try {
    const priceEstimationServiceResponse = await fetch(`https://sampo-pe.rahtiapp.fi/estimate-price?item_description=${description}&condition=${condition}`);
    if (!priceEstimationServiceResponse.ok) throw new Error('Failed to fetch from price-estimation-service');

    const prices = await priceEstimationServiceResponse.json();
    // Data error check
    if (typeof prices.min_price !== 'number' || typeof prices.estimated_price !== 'number' || typeof prices.max_price !== 'number') {
      throw new Error('Invalid price data received');
    }

    // Send all price values
    res.send(prices);
  } catch (e) {
    console.error('Error fetching from price-estimation-service:', e);
    res.status(500).send('Error fetching from price-estimation-service');
  }
});

// Path for uploaded image files
const upload = multer({ dest: 'server/uploads/' });

// Handle file upload
app.post('/upload', upload.single('photo'), (req: Request, res: Response) => {

  if (req.file) {
    // Use the file here
    console.log(req.file);

    // Delete the file after done with it
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
// Database
(async () => {
  try {
    await connectToDatabase();
    console.log("Connected to the database.");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    // Exit the application on database connection error
    process.exit(1);
  }
})();