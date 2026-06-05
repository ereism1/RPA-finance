const express = require('express');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const { exec } = require('child_process');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.listen(3001, () => {
  console.log('Servidor rodando');
});

const pool = require('./database/connection');

app.get('/teste-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      sucesso: true,
      horaBanco: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucesso: false,
      erro: error.message
    });
  }
});

app.post('/movimentacoes', async (req, res) => {
  try {

    const {
      data_movimento,
      descricao,
      valor,
      tipo
    } = req.body;

    const query = `
  INSERT INTO movimentacoes
  (
    data_movimento,
    descricao,
    valor,
    tipo,
    status
  )
  VALUES
  ($1,$2,$3,$4,$5)
  RETURNING *
`;

    const result = await pool.query(
      query,
      [
        data_movimento,
        descricao,
        valor,
        tipo,
        'PENDENTE'
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: error.message
    });

  }
});

app.get('/movimentacoes', async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT *
      FROM movimentacoes
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: error.message
    });

  }
});

app.delete('/movimentacoes/:id', async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM movimentacoes
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      mensagem: 'Movimentação removida'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: error.message
    });

  }
});

app.get('/exportar', async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT *
      FROM movimentacoes
      ORDER BY id
    `);

    const arquivo = path.join(
      __dirname,
      'movimentacoes.csv'
    );

    const csvWriter = createCsvWriter({
      path: arquivo,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'data_movimento', title: 'DATA' },
        { id: 'descricao', title: 'DESCRICAO' },
        { id: 'valor', title: 'VALOR' },
        { id: 'tipo', title: 'TIPO' },
        { id: 'status', title: 'STATUS' }
      ]
    });

    await csvWriter.writeRecords(result.rows);

    res.download(arquivo);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: error.message
    });

  }

});

app.post('/conciliar', (req, res) => {

  exec(
    '../conciliacao/venv/bin/python ../conciliacao/conciliador.py',
    (error, stdout, stderr) => {

      console.log('STDOUT:', stdout);
      console.log('STDERR:', stderr);

      if (error) {

        console.log('ERROR:', error);

        return res.status(500).json({
          erro: error.message,
          stderr
        });

      }

      res.json({
        sucesso: true,
        stdout,
        stderr
      });

    }
  );

});