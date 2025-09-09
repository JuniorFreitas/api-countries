# 📚 Exemplos de Uso da API

## 🚀 Iniciando a API

```bash
# Instalar dependências
npm install

# Construir banco de dados
npm run build

# Iniciar servidor
npm start
```

## 🔍 Exemplos de Consultas

### 1. Listar Países

```bash
# Listar todos os países
curl "http://localhost:3000/api/countries"

# Buscar países com "Brasil"
curl "http://localhost:3000/api/countries?search=Brasil"

# Paginação
curl "http://localhost:3000/api/countries?limit=10&offset=20"
```

**Resposta:**
```json
{
  "data": [
    {
      "id": 31,
      "name": "Brazil",
      "iso2": "BR",
      "iso3": "BRA",
      "capital": "Brasilia",
      "currency": "BRL",
      "region": "Americas",
      "emoji": "🇧🇷"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### 2. Buscar País Específico

```bash
# Por código ISO2
curl "http://localhost:3000/api/countries/BR"

# Por código ISO3
curl "http://localhost:3000/api/countries/BRA"

# Por ID numérico
curl "http://localhost:3000/api/countries/31"
```

### 3. Estados de um País

```bash
# Estados do Brasil
curl "http://localhost:3000/api/countries/BR/states"

# Buscar estados com "São"
curl "http://localhost:3000/api/countries/BR/states?search=São"
```

**Resposta:**
```json
{
  "data": [
    {
      "id": 2012,
      "name": "Acre",
      "iso2": "AC",
      "iso3166_2": "BR-AC",
      "latitude": "-9.04786790",
      "longitude": "-70.52649760",
      "type": "state",
      "timezone": "America/Rio_Branco"
    }
  ],
  "total": 27,
  "limit": 100,
  "offset": 0
}
```

### 4. Cidades de um Estado

```bash
# Cidades de São Paulo (ID do estado)
curl "http://localhost:3000/api/states/3550308/cities"

# Buscar cidades com "São Paulo"
curl "http://localhost:3000/api/states/3550308/cities?search=São Paulo"
```

### 5. Cidades de um País

```bash
# Todas as cidades do Brasil
curl "http://localhost:3000/api/countries/BR/cities"

# Buscar cidades com "Rio"
curl "http://localhost:3000/api/countries/BR/cities?search=Rio"
```

### 6. Busca Global

```bash
# Buscar em todos os dados
curl "http://localhost:3000/api/search?q=São Paulo"

# Buscar apenas países
curl "http://localhost:3000/api/search?q=Brasil&type=countries"

# Buscar apenas estados
curl "http://localhost:3000/api/search?q=California&type=states"

# Buscar apenas cidades
curl "http://localhost:3000/api/search?q=New York&type=cities"
```

**Resposta:**
```json
{
  "query": "São Paulo",
  "results": {
    "countries": [],
    "states": [
      {
        "id": 3550308,
        "name": "São Paulo",
        "country_name": "Brazil",
        "country_iso2": "BR"
      }
    ],
    "cities": [
      {
        "id": 3448439,
        "name": "São Paulo",
        "state_name": "São Paulo",
        "country_name": "Brazil"
      }
    ]
  },
  "total": 2
}
```

## 🌐 Exemplos com JavaScript

### Fetch API

```javascript
// Listar países
async function getCountries() {
  const response = await fetch('http://localhost:3000/api/countries?limit=10');
  const data = await response.json();
  console.log(data.data);
}

// Buscar país
async function getCountry(code) {
  const response = await fetch(`http://localhost:3000/api/countries/${code}`);
  const data = await response.json();
  console.log(data);
}

// Estados do Brasil
async function getBrazilStates() {
  const response = await fetch('http://localhost:3000/api/countries/BR/states');
  const data = await response.json();
  console.log(data.data);
}

// Buscar cidades
async function searchCities(query) {
  const response = await fetch(`http://localhost:3000/api/search?q=${query}&type=cities`);
  const data = await response.json();
  console.log(data.results.cities);
}

// Usar as funções
getCountries();
getCountry('BR');
getBrazilStates();
searchCities('São Paulo');
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Listar países
const countries = await api.get('/countries?limit=10');

// Buscar país
const country = await api.get('/countries/BR');

// Estados de um país
const states = await api.get('/countries/BR/states');

// Busca global
const search = await api.get('/search?q=São Paulo');
```

## 🐍 Exemplos com Python

```python
import requests

# Listar países
response = requests.get('http://localhost:3000/api/countries?limit=10')
countries = response.json()

# Buscar país
response = requests.get('http://localhost:3000/api/countries/BR')
country = response.json()

# Estados do Brasil
response = requests.get('http://localhost:3000/api/countries/BR/states')
states = response.json()

# Busca global
response = requests.get('http://localhost:3000/api/search?q=São Paulo')
search_results = response.json()
```

## 🐘 Exemplos com PHP

```php
<?php
// Listar países
$response = file_get_contents('http://localhost:3000/api/countries?limit=10');
$countries = json_decode($response, true);

// Buscar país
$response = file_get_contents('http://localhost:3000/api/countries/BR');
$country = json_decode($response, true);

// Estados do Brasil
$response = file_get_contents('http://localhost:3000/api/countries/BR/states');
$states = json_decode($response, true);

// Busca global
$response = file_get_contents('http://localhost:3000/api/search?q=São Paulo');
$search_results = json_decode($response, true);
?>
```

## 🔧 Parâmetros de Query

### Paginação
- `limit`: Número de itens por página (padrão: 50)
- `offset`: Número de itens para pular (padrão: 0)

### Busca
- `search`: Termo para buscar (funciona em nomes)
- `q`: Termo para busca global
- `type`: Tipo de busca (`countries`, `states`, `cities`, `all`)

### Exemplos de URLs
```
/api/countries?search=Brasil&limit=5&offset=0
/api/countries/BR/states?search=São&limit=10
/api/search?q=New York&type=cities&limit=20
```

## 📊 Respostas da API

### Estrutura Padrão
```json
{
  "data": [...],           // Array de dados
  "total": 100,            // Total de itens retornados
  "limit": 50,             // Limite aplicado
  "offset": 0              // Offset aplicado
}
```

### Busca Global
```json
{
  "query": "termo",
  "results": {
    "countries": [...],
    "states": [...],
    "cities": [...]
  },
  "total": 50
}
```

### Erro
```json
{
  "error": "Mensagem de erro"
}
```

## 🚀 Deploy

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Acessar: https://seu-projeto.vercel.app
```

### Netlify
```bash
# Build
npm run build

# Deploy via drag & drop ou Git
# Acessar: https://seu-projeto.netlify.app
```

### Railway
```bash
# Conectar repositório
# Deploy automático
# Acessar: https://seu-projeto.railway.app
```

## 🔍 Monitoramento

### Health Check
```bash
curl "http://localhost:3000/api/health"
```

### Documentação
```bash
curl "http://localhost:3000/"
```

## 🎯 Casos de Uso

1. **Formulários de endereço**: Buscar países, estados e cidades
2. **Aplicações de viagem**: Listar destinos disponíveis
3. **Análise geográfica**: Dados para mapas e gráficos
4. **Validação de endereços**: Verificar se cidade pertence ao estado
5. **APIs de e-commerce**: Seleção de localização para entrega
6. **Dashboards**: Relatórios por região geográfica
