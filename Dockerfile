FROM node:18.12.0

WORKDIR /empreitaehfront

COPY package*.json /empreitaehfront/

RUN npm install

COPY . /empreitaehfront/

EXPOSE 3000

CMD [ "npm","start" ]