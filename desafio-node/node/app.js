const express = require('express');
const mysql = require('mysql');

// Configurações do banco de dados
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Função para conectar ao banco de dados com lógica de repetição
const connectWithRetry = (retries = 5, delay = 2000) => {
  console.log('Tentando conectar ao banco de dados MySQL...');
  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) {
      if (retries === 0) {
        console.error('Erro ao conectar ao MySQL após várias tentativas:', err.stack);
        process.exit(1); // Encerra o processo em caso de falha
      } else {
        console.warn(`Erro ao conectar ao MySQL. Tentando novamente em ${delay / 1000} segundos...`);
        setTimeout(() => connectWithRetry(retries - 1, delay), delay);
      }
    } else {
      console.log('Conectado ao MySQL com sucesso');
      startApp(connection); // Inicia a aplicação após a conexão
    }
  });
};

// Função principal da aplicação
const startApp = (connection) => {
  const app = express();

  // Rota principal
  app.get('/', (req, res) => {
    const name = `FullCycle-João${Date.now()}`; // Gera um nome único com timestamp
    const sqlInsert = `INSERT INTO people(name) VALUES(?)`; // Query SQL com placeholder

    // Executando a query de inserção
    connection.query(sqlInsert, [name], (err) => {
      if (err) {
        console.error('Erro ao inserir na tabela:', err.stack);
        res.status(500).send('Erro ao inserir no banco de dados');
        return;
      }

      // Query SQL para buscar todos os registros
      const sqlSelect = `SELECT * FROM people`;

      // Executando a query de consulta
      connection.query(sqlSelect, (err, results) => {
        if (err) {
          console.error('Erro ao consultar a tabela:', err.stack);
          res.status(500).send('Erro ao consultar o banco de dados');
          return;
        }

        // Criando a lista de nomes para exibição
        const namesList = results.map((row) => `<li>${row.name}</li>`).join('');
        res.send(`<h1>Full Cycle Rocks!</h1><ul>${namesList}</ul>`);
      });
    });
  });

  // Iniciando o servidor
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Aplicação Node rodando na porta ${PORT}`);
  });
};

// Função para criar a tabela no banco de dados
const createTable = () => {
  const connection = mysql.createConnection(dbConfig);
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS people (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Erro ao criar a tabela:', err.stack);
      process.exit(1); // Encerra o processo em caso de falha
    } else {
      console.log('Tabela `people` criada ou já existente');
      connection.end(); // Fecha a conexão para evitar vazamentos de recursos
      connectWithRetry(); // Inicia a conexão e a aplicação
    }
  });
};

// Inicia a criação da tabela e a conexão com o banco de dados
createTable();
