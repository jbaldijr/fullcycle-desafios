FROM node:16-alpine

WORKDIR /usr/src/app

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Copia apenas os arquivos essenciais para instalar as dependências
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia os outros arquivos da aplicação
COPY . .

# Expõe a porta que o Node.js está escutando
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "app.js"]
