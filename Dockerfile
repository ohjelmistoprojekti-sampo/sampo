FROM node:20-alpine

WORKDIR /app
 
COPY package*.json ./

# set npm cache directory to avoid problems in deployment
ENV NPM_CONFIG_CACHE=/app/.npm

RUN npm install

COPY . .

# set permissions for saving files in deployment
# Note: Not the most secure way currently, should be improved.
RUN chmod 777 server/uploads

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
