const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

console.log('🏗️  Iniciando construção do banco de dados...');

// Caminhos
const jsonPath = path.join(__dirname, '..', 'countries+states+cities.json');
const dbPath = path.join(__dirname, '..', 'database.sqlite');

// Verificar se o arquivo JSON existe
if (!fs.existsSync(jsonPath)) {
  console.error('❌ Arquivo countries+states+cities.json não encontrado!');
  process.exit(1);
}

// Remover banco existente se houver
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Banco anterior removido');
}

// Conectar ao banco
const db = new sqlite3.Database(dbPath);

// Ler e processar JSON
console.log('📖 Lendo arquivo JSON...');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`📊 Dados encontrados:`);
console.log(`   - Países: ${jsonData.length}`);

// Contar estados e cidades
let totalStates = 0;
let totalCities = 0;
jsonData.forEach(country => {
  totalStates += country.states ? country.states.length : 0;
  if (country.states) {
    country.states.forEach(state => {
      totalCities += state.cities ? state.cities.length : 0;
    });
  }
});

console.log(`   - Estados: ${totalStates}`);
console.log(`   - Cidades: ${totalCities}`);

// Criar tabelas
console.log('🔨 Criando tabelas...');
db.serialize(() => {
  // Tabela de países
  db.run(`
    CREATE TABLE countries (
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
    CREATE TABLE states (
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
    CREATE TABLE cities (
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
  db.run('CREATE INDEX idx_countries_name ON countries(name)');
  db.run('CREATE INDEX idx_countries_iso2 ON countries(iso2)');
  db.run('CREATE INDEX idx_states_country_id ON states(country_id)');
  db.run('CREATE INDEX idx_states_name ON states(name)');
  db.run('CREATE INDEX idx_cities_state_id ON cities(state_id)');
  db.run('CREATE INDEX idx_cities_name ON cities(name)');

  // Inserir dados
  console.log('💾 Inserindo dados...');
  
  const insertCountry = db.prepare(`
    INSERT INTO countries (
      id, name, iso3, iso2, numeric_code, phonecode, capital, currency, 
      currency_name, currency_symbol, tld, native, region, subregion, 
      nationality, emoji, emojiU
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertState = db.prepare(`
    INSERT INTO states (
      id, country_id, name, iso2, iso3166_2, latitude, longitude, type, timezone
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertCity = db.prepare(`
    INSERT INTO cities (id, state_id, name, latitude, longitude, timezone)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  let countriesInserted = 0;
  let statesInserted = 0;
  let citiesInserted = 0;

  // Processar países
  jsonData.forEach((country, countryIndex) => {
    if (countryIndex % 50 === 0) {
      console.log(`   Processando país ${countryIndex + 1}/${jsonData.length}...`);
    }

    // Inserir país
    insertCountry.run(
      country.id,
      country.name,
      country.iso3,
      country.iso2,
      country.numeric_code,
      country.phonecode,
      country.capital,
      country.currency,
      country.currency_name,
      country.currency_symbol,
      country.tld,
      country.native,
      country.region,
      country.subregion,
      country.nationality,
      country.emoji,
      country.emojiU
    );
    countriesInserted++;

    // Processar estados
    if (country.states) {
      country.states.forEach(state => {
        // Inserir estado
        insertState.run(
          state.id,
          country.id,
          state.name,
          state.iso2,
          state.iso3166_2,
          state.latitude,
          state.longitude,
          state.type,
          state.timezone
        );
        statesInserted++;

        // Processar cidades
        if (state.cities) {
          state.cities.forEach(city => {
            // Inserir cidade
            insertCity.run(
              city.id,
              state.id,
              city.name,
              city.latitude,
              city.longitude,
              city.timezone
            );
            citiesInserted++;
          });
        }
      });
    }
  });

  // Finalizar prepared statements
  insertCountry.finalize();
  insertState.finalize();
  insertCity.finalize();

  console.log('✅ Dados inseridos com sucesso!');
  console.log(`   - Países: ${countriesInserted}`);
  console.log(`   - Estados: ${statesInserted}`);
  console.log(`   - Cidades: ${citiesInserted}`);

  // Verificar tamanho do banco
  const stats = fs.statSync(dbPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`📦 Tamanho do banco: ${sizeInMB} MB`);

  console.log('🎉 Banco de dados construído com sucesso!');
  console.log(`📍 Localização: ${dbPath}`);
});

// Fechar banco
db.close((err) => {
  if (err) {
    console.error('❌ Erro ao fechar banco:', err.message);
    process.exit(1);
  } else {
    console.log('🔒 Banco fechado com sucesso');
    process.exit(0);
  }
});
