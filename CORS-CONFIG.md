# 🔒 Configuração de CORS

## 📋 O que é CORS?

CORS (Cross-Origin Resource Sharing) é um mecanismo de segurança que controla quais domínios podem acessar sua API. Por padrão, navegadores bloqueiam requisições entre domínios diferentes por segurança.

## ⚙️ Configuração Atual

A API está configurada com CORS restritivo que permite apenas domínios específicos. Por padrão, apenas domínios de desenvolvimento local são permitidos.

### Domínios Permitidos por Padrão:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:8080`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`
- `http://127.0.0.1:8080`

## 🚀 Como Configurar Domínios de Produção

### Método 1: Variável de Ambiente

```bash
# Definir domínios permitidos
export ALLOWED_ORIGINS="https://meusite.com,https://app.meusite.com,https://api.meusite.com"

# Iniciar servidor
npm start
```

### Método 2: Arquivo .env

1. Crie um arquivo `.env` na raiz do projeto:

```env
ALLOWED_ORIGINS=https://meusite.com,https://app.meusite.com,https://api.meusite.com
PORT=3000
NODE_ENV=production
```

2. Instale o pacote dotenv:

```bash
npm install dotenv
```

3. Modifique o `index.js` para carregar o .env:

```javascript
require('dotenv').config();
```

### Método 3: Configuração no Deploy

#### Vercel
```bash
# Via CLI
vercel env add ALLOWED_ORIGINS

# Via Dashboard
# Settings > Environment Variables
```

#### Netlify
```bash
# Via netlify.toml
[build.environment]
  ALLOWED_ORIGINS = "https://meusite.com,https://app.meusite.com"
```

#### Railway
```bash
# Via CLI
railway variables set ALLOWED_ORIGINS="https://meusite.com,https://app.meusite.com"

# Via Dashboard
# Variables tab
```

## 🧪 Testando CORS

### Teste Automático
```bash
# Iniciar servidor
npm start

# Em outro terminal, testar CORS
node test-cors.js
```

### Teste Manual com cURL
```bash
# Teste com domínio permitido
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:3000/api/health

# Teste com domínio bloqueado
curl -H "Origin: https://malicioso.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:3000/api/health
```

### Teste no Navegador
```javascript
// Console do navegador
fetch('http://localhost:3000/api/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('CORS Error:', error));
```

## 🔧 Configurações Avançadas

### Permitir Todos os Domínios (NÃO RECOMENDADO)
```javascript
// No index.js, substitua a configuração atual por:
app.use(cors({
  origin: true, // Permite todos os domínios
  credentials: true
}));
```

### Configuração por Ambiente
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000'
        ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true
};
```

### Configuração com Wildcards
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    const allowedPatterns = [
      /^https:\/\/.*\.meusite\.com$/,  // Qualquer subdomínio
      /^https:\/\/meusite\.com$/,       // Domínio principal
      /^http:\/\/localhost:\d+$/        // Localhost com qualquer porta
    ];

    if (!origin || allowedPatterns.some(pattern => pattern.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  }
};
```

## 🚨 Solução de Problemas

### Erro: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Causa:** Seu domínio não está na lista de domínios permitidos.

**Solução:**
1. Adicione seu domínio à variável `ALLOWED_ORIGINS`
2. Reinicie o servidor
3. Teste novamente

### Erro: "Response to preflight request doesn't pass access control check"

**Causa:** O navegador está fazendo uma requisição OPTIONS (preflight) que está sendo bloqueada.

**Solução:**
1. Verifique se os métodos HTTP estão configurados
2. Verifique se os headers estão permitidos
3. Teste com `credentials: true` se necessário

### Erro: "Credentials flag is true, but the 'Access-Control-Allow-Credentials' header is missing"

**Causa:** Você está enviando credenciais (cookies, headers de auth) mas o servidor não está configurado para aceitar.

**Solução:**
```javascript
const corsOptions = {
  origin: true, // ou sua lista de domínios
  credentials: true // Adicione esta linha
};
```

## 📝 Exemplos de Configuração

### Desenvolvimento Local
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
```

### Produção Simples
```env
ALLOWED_ORIGINS=https://meusite.com
```

### Produção com Múltiplos Domínios
```env
ALLOWED_ORIGINS=https://meusite.com,https://app.meusite.com,https://admin.meusite.com
```

### Desenvolvimento + Produção
```env
ALLOWED_ORIGINS=https://meusite.com,https://app.meusite.com,http://localhost:3000,http://localhost:3001
```

## 🔍 Monitoramento

### Logs de CORS
A API registra tentativas de acesso bloqueadas:
```
🚫 CORS bloqueado para: https://malicioso.com
```

### Headers de Resposta
```http
Access-Control-Allow-Origin: https://meusite.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization,X-Requested-With,Accept,Origin
```

## 🛡️ Segurança

### Boas Práticas:
1. ✅ **SEMPRE** especifique domínios exatos em produção
2. ✅ Use HTTPS em produção
3. ✅ Configure apenas os domínios necessários
4. ❌ **NUNCA** use `origin: true` em produção
5. ❌ **NUNCA** use wildcards amplos como `*.com`

### Configuração Segura:
```javascript
const corsOptions = {
  origin: [
    'https://meusite.com',
    'https://app.meusite.com'
  ],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

## 📞 Suporte

Se você encontrar problemas com CORS:

1. Verifique os logs do servidor
2. Execute o teste: `node test-cors.js`
3. Verifique se o domínio está correto na variável `ALLOWED_ORIGINS`
4. Teste com cURL para isolar o problema
5. Verifique se não há proxies ou CDNs interferindo
