# Sampo

## What the project does?

Application gives estimated value of used product based on users description. The value is based on average pricedata found in internet.

## Why the project is useful?

Application helps users to evaluate price for products they are looking to sell.

## Technologies

- **Back-end** Express.js with TypeScript
- **Front-end** Static HTML, TypeScript, CSS
- **Other** Python for web scraping
- **AI** Coming soon...
- **Server** Cheapest server found on google search

## How to use

### Run express node-app

To run the application you need node version 18.

1. Clone the Git-repository to your local machine: 

`git clone https://github.com/ohjelmistoprojekti-sampo/sampo.git`

2. Navigate to your project directory

`cd ohjelmistoprojekti-sampo`

2. Install necessary dependencies with npm:

`npm install`

3. Start the application:

`npm run serve`

4. The app will start on port 3000 by default:

Navigate to localhost:3000 with your browser.

### Run webscraper
1. Clone the project

`git clone https://github.com/ohjelmistoprojekti-sampo/sampo.git`
  
2. Run the python script
  > $ python /scrape/Tuotehaku.py

  > $ python /scrape/Torihaku.py

3. Type in the product that you want to search.

4. Review the results
