const express = require('express');
const cors = require('cors');
const compression = require('compression');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de domínios permitidos
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:8080',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001',
          'http://127.0.0.1:8080'
        ];

    // Permitir requisições sem origin (ex: Postman, mobile apps)
    if (!origin) return callback(null, true);

    // Verificar se o origin está na lista de permitidos
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS bloqueado para: ${origin}`);
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true, // Permitir cookies e headers de autenticação
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

// Middleware
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json());

// Conectar ao banco SQLite
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Verificar se o banco existe, se não, criar
db.serialize(() => {
  // Tabela de países
  db.run(`
    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      iso3 TEXT,
      iso2 TEXT,
      numeric_code TEXT,
      phonecode TEXT,
      capital TEXT,
      currency TEXT,
      currency_name TEXT,
      currency_symbol TEXT,
      tld TEXT,
      native TEXT,
      region TEXT,
      subregion TEXT,
      nationality TEXT,
      emoji TEXT,
      emojiU TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de estados
  db.run(`
    CREATE TABLE IF NOT EXISTS states (
      id INTEGER PRIMARY KEY,
      country_id INTEGER,
      name TEXT NOT NULL,
      iso2 TEXT,
      iso3166_2 TEXT,
      latitude TEXT,
      longitude TEXT,
      type TEXT,
      timezone TEXT,
      FOREIGN KEY (country_id) REFERENCES countries (id)
    )
  `);

  // Tabela de cidades
  db.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY,
      state_id INTEGER,
      name TEXT NOT NULL,
      latitude TEXT,
      longitude TEXT,
      timezone TEXT,
      FOREIGN KEY (state_id) REFERENCES states (id)
    )
  `);

  // Índices para performance
  db.run('CREATE INDEX IF NOT EXISTS idx_countries_name ON countries(name)');
  db.run('CREATE INDEX IF NOT EXISTS idx_countries_iso2 ON countries(iso2)');
  db.run('CREATE INDEX IF NOT EXISTS idx_states_country_id ON states(country_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_states_name ON states(name)');
  db.run('CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id)');
  db.run('CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name)');
});

// Rotas da API

// Listar todos os países
app.get('/api/countries', (req, res) => {
  const { search, limit = 50, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM countries';
  let params = [];
  
  if (search) {
    query += ' WHERE name LIKE ? OR native LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }
  
  query += ' ORDER BY name LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      data: rows,
      total: rows.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  });
});

// Buscar país por ID ou código
app.get('/api/countries/:id', (req, res) => {
  const { id } = req.params;
  const isNumeric = /^\d+$/.test(id);
  
  const query = isNumeric 
    ? 'SELECT * FROM countries WHERE id = ?'
    : 'SELECT * FROM countries WHERE iso2 = ? OR iso3 = ?';
  
  const params = isNumeric ? [id] : [id.toUpperCase(), id.toUpperCase()];
  
  db.get(query, params, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'País não encontrado' });
    }
    res.json(row);
  });
});

// Listar estados de um país
app.get('/api/countries/:id/states', (req, res) => {
  const { id } = req.params;
  const { search, limit = 100, offset = 0 } = req.query;
  
  let query = `
    SELECT s.* FROM states s 
    JOIN countries c ON s.country_id = c.id 
    WHERE c.id = ? OR c.iso2 = ? OR c.iso3 = ?
  `;
  let params = [id, id.toUpperCase(), id.toUpperCase()];
  
  if (search) {
    query += ' AND s.name LIKE ?';
    params.push(`%${search}%`);
  }
  
  query += ' ORDER BY s.name LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      data: rows,
      total: rows.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  });
});

// Listar cidades de um estado
app.get('/api/states/:id/cities', (req, res) => {
  const { id } = req.params;
  const { search, limit = 100, offset = 0 } = req.query;
  
  let query = `
    SELECT ci.* FROM cities ci 
    JOIN states s ON ci.state_id = s.id 
    WHERE s.id = ?
  `;
  let params = [id];
  
  if (search) {
    query += ' AND ci.name LIKE ?';
    params.push(`%${search}%`);
  }
  
  query += ' ORDER BY ci.name LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      data: rows,
      total: rows.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  });
});

// Buscar cidades por país (todas as cidades de um país)
app.get('/api/countries/:id/cities', (req, res) => {
  const { id } = req.params;
  const { search, limit = 100, offset = 0 } = req.query;
  
  let query = `
    SELECT ci.*, s.name as state_name, s.iso2 as state_iso2 
    FROM cities ci 
    JOIN states s ON ci.state_id = s.id 
    JOIN countries c ON s.country_id = c.id 
    WHERE c.id = ? OR c.iso2 = ? OR c.iso3 = ?
  `;
  let params = [id, id.toUpperCase(), id.toUpperCase()];
  
  if (search) {
    query += ' AND ci.name LIKE ?';
    params.push(`%${search}%`);
  }
  
  query += ' ORDER BY ci.name LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      data: rows,
      total: rows.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  });
});

// Buscar por texto (países, estados e cidades)
app.get('/api/search', (req, res) => {
  const { q, type = 'all', limit = 20 } = req.query;
  
  if (!q || q.length < 2) {
    return res.status(400).json({ error: 'Query deve ter pelo menos 2 caracteres' });
  }
  
  const results = {
    countries: [],
    states: [],
    cities: []
  };
  
  let completed = 0;
  const total = type === 'all' ? 3 : 1;
  
  const checkComplete = () => {
    completed++;
    if (completed === total) {
      res.json({
        query: q,
        results: results,
        total: results.countries.length + results.states.length + results.cities.length
      });
    }
  };
  
  if (type === 'all' || type === 'countries') {
    db.all(
      'SELECT * FROM countries WHERE name LIKE ? OR native LIKE ? LIMIT ?',
      [`%${q}%`, `%${q}%`, parseInt(limit)],
      (err, rows) => {
        if (!err) results.countries = rows;
        checkComplete();
      }
    );
  } else {
    checkComplete();
  }
  
  if (type === 'all' || type === 'states') {
    db.all(
      'SELECT s.*, c.name as country_name, c.iso2 as country_iso2 FROM states s JOIN countries c ON s.country_id = c.id WHERE s.name LIKE ? LIMIT ?',
      [`%${q}%`, parseInt(limit)],
      (err, rows) => {
        if (!err) results.states = rows;
        checkComplete();
      }
    );
  } else {
    checkComplete();
  }
  
  if (type === 'all' || type === 'cities') {
    db.all(
      'SELECT ci.*, s.name as state_name, c.name as country_name FROM cities ci JOIN states s ON ci.state_id = s.id JOIN countries c ON s.country_id = c.id WHERE ci.name LIKE ? LIMIT ?',
      [`%${q}%`, parseInt(limit)],
      (err, rows) => {
        if (!err) results.cities = rows;
        checkComplete();
      }
    );
  } else {
    checkComplete();
  }
});

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rota raiz com documentação
app.get('/', (req, res) => {
  res.json({
    name: 'API Países, Estados e Cidades',
    version: '1.0.0',
    description: 'API para consulta de dados geográficos',
    endpoints: {
      'GET /api/countries': 'Listar países',
      'GET /api/countries/:id': 'Buscar país por ID ou código',
      'GET /api/countries/:id/states': 'Listar estados de um país',
      'GET /api/countries/:id/cities': 'Listar cidades de um país',
      'GET /api/states/:id/cities': 'Listar cidades de um estado',
      'GET /api/search?q=termo': 'Buscar por texto',
      'GET /api/health': 'Status da API'
    },
    examples: {
      'Listar países': '/api/countries?search=Brasil&limit=10',
      'Buscar país': '/api/countries/BR ou /api/countries/31',
      'Estados do Brasil': '/api/countries/BR/states',
      'Cidades de SP': '/api/states/3550308/cities',
      'Buscar São Paulo': '/api/search?q=São Paulo&type=cities'
    }
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Erro específico de CORS
  if (err.message === 'Não permitido pelo CORS') {
    return res.status(403).json({ 
      error: 'Acesso negado pelo CORS',
      message: 'Seu domínio não está autorizado a acessar esta API',
      allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'Configurado via variável ALLOWED_ORIGINS'
    });
  }
  
  res.status(500).json({ error: 'Algo deu errado!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  console.log(`📊 Banco de dados: ${dbPath}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Encerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco:', err.message);
    } else {
      console.log('✅ Banco fechado com sucesso');
    }
    process.exit(0);
  });
});
