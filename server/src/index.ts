import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios'
import { connectToDatabase } from './dbAccess.js';

const app: Express = express();
const port = 5000;
const apiKey = process.env.API_KEY;

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
app.post('/upload', upload.single('photo'), async (req: Request, res: Response) => {
  if (req.file) {
    // Use the file here
    const filePath = req.file.path;

    // Convert the file to base64
    const base64Image = convertToBase64(filePath);

    console.log('Base64 image:', base64Image);

    // Send base64 image to Vision API
    try {
      const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`; 
      const requestData = {
        requests: [
          {
            image: {
                content: base64Image, // Adding data URL prefix
            },
            features: [
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 1,
              },
            ],
          },
        ],
      };

      const response = await axios.post(visionApiUrl, requestData);
      const recognizedObject = response.data.responses[0]?.localizedObjectAnnotations[0];
      const name = recognizedObject?.name;
      console.log('Recognized Item:', name);

       // Translate the item name to Finnish
       const translationResponse = await axios.get(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${name}&target=fi`
      );
      const translatedName = translationResponse.data.data.translations[0].translatedText;

      console.log('Translated Item:', translatedName);

      // Delete the file after done with it
      fs.unlink(filePath, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log('File deleted.');
        }

        res.status(200).json({ message: 'File uploaded successfully', info: translatedName });
      });
    } catch (error: any) {
      console.error('Error making Vision API request:', error);
      console.error('Response data:', (error as any).response?.data);
      res.status(500).json({ error: 'Error making Vision API request' });
    }
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

// Function to convert a file to base64
function convertToBase64(filePath: string): string | null {
  try {
    const fileData = fs.readFileSync(filePath);
    const base64Image = Buffer.from(fileData).toString('base64');
    return base64Image;
  } catch (error) {
    console.error('Error converting file to base64:', error);
    return null;
  }
}