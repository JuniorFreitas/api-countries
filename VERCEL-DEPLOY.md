# 🚀 Deploy no Vercel - Guia Completo

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Node.js instalado
- Git configurado
- Projeto funcionando localmente

## 🔧 Configuração Inicial

### 1. Instalar Vercel CLI

```bash
# Instalar globalmente
npm install -g vercel

# Verificar instalação
vercel --version
```

### 2. Login no Vercel

```bash
# Fazer login
vercel login

# Verificar conta
vercel whoami
```

## 🚀 Deploy da API

### Método 1: Deploy via CLI (Recomendado)

```bash
# Na pasta do projeto
cd /Users/juniorfreitas/Desktop/WEB/2025/api-pais-cidade-estado

# Deploy inicial
vercel

# Seguir as instruções:
# ? Set up and deploy "~/api-pais-cidade-estado"? [Y/n] y
# ? Which scope do you want to deploy to? [Seu usuário]
# ? Link to existing project? [N/y] n
# ? What's your project's name? api-pais-cidade-estado
# ? In which directory is your code located? ./
```

### Método 2: Deploy via GitHub

1. **Criar repositório no GitHub:**
```bash
# Inicializar git
git init
git add .
git commit -m "Initial commit"

# Conectar ao GitHub
git remote add origin https://github.com/seu-usuario/api-pais-cidade-estado.git
git push -u origin main
```

2. **Conectar no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe do GitHub
   - Configure as variáveis de ambiente

## ⚙️ Configuração de Variáveis de Ambiente

### Via CLI:
```bash
# Configurar domínios permitidos
vercel env add ALLOWED_ORIGINS

# Digite os domínios (exemplo):
# https://meusite.com,https://app.meusite.com,https://api.meusite.com

# Configurar porta (opcional)
vercel env add PORT
# Digite: 3000

# Configurar ambiente
vercel env add NODE_ENV
# Digite: production
```

### Via Dashboard:
1. Acesse seu projeto no Vercel
2. Vá em "Settings" > "Environment Variables"
3. Adicione as variáveis:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `ALLOWED_ORIGINS` | `https://meusite.com,https://app.meusite.com` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |
| `PORT` | `3000` | Production, Preview, Development |

## 🔄 Atualizações e Redeploy

### Deploy automático (GitHub):
```bash
# Fazer alterações
git add .
git commit -m "Update API"
git push origin main

# Vercel faz deploy automático
```

### Deploy manual:
```bash
# Deploy para produção
vercel --prod

# Deploy para preview
vercel
```

## 📁 Estrutura do Projeto no Vercel

```
api-pais-cidade-estado/
├── index.js              # Ponto de entrada
├── vercel.json           # Configuração do Vercel
├── database.sqlite       # Banco de dados
├── package.json          # Dependências
└── scripts/
    └── build-db.js       # Script de build
```

## 🔧 Configuração do vercel.json

O arquivo `vercel.json` já está configurado:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "index.js": {
      "maxDuration": 30
    }
  }
}
```

## 🌐 URLs e Domínios

### URL padrão:
```
https://api-pais-cidade-estado.vercel.app
```

### Domínio personalizado:
1. Vá em "Settings" > "Domains"
2. Adicione seu domínio
3. Configure DNS conforme instruções

## 🧪 Testando o Deploy

### 1. Teste básico:
```bash
curl https://sua-api.vercel.app/api/health
```

### 2. Teste de CORS:
```bash
curl -H "Origin: https://meusite.com" \
     https://sua-api.vercel.app/api/health
```

### 3. Teste completo:
```bash
# Listar países
curl https://sua-api.vercel.app/api/countries?limit=5

# Buscar Brasil
curl https://sua-api.vercel.app/api/countries/BR

# Buscar estados do Brasil
curl https://sua-api.vercel.app/api/countries/BR/states
```

## 📊 Monitoramento

### Logs em tempo real:
```bash
# Ver logs
vercel logs

# Logs de uma função específica
vercel logs --function=index.js
```

### Dashboard do Vercel:
- Acesse seu projeto
- Vá em "Functions" para ver métricas
- "Analytics" para estatísticas de uso

## 🔒 Configuração de CORS para Produção

### 1. Configurar domínios permitidos:
```bash
vercel env add ALLOWED_ORIGINS
# Digite: https://meusite.com,https://app.meusite.com
```

### 2. Verificar configuração:
```bash
# Ver variáveis de ambiente
vercel env ls
```

### 3. Testar CORS:
```bash
# Teste com domínio permitido
curl -H "Origin: https://meusite.com" \
     https://sua-api.vercel.app/api/health

# Teste com domínio bloqueado
curl -H "Origin: https://malicioso.com" \
     https://sua-api.vercel.app/api/health
```

## 🚨 Solução de Problemas

### Erro: "Function timeout"
```json
// Aumentar timeout no vercel.json
{
  "functions": {
    "index.js": {
      "maxDuration": 60
    }
  }
}
```

### Erro: "Module not found"
```bash
# Verificar se todas as dependências estão no package.json
npm install --save sqlite3 express cors compression
```

### Erro: "Database not found"
```bash
# Verificar se o banco foi construído
npm run build

# Verificar se o arquivo existe
ls -la database.sqlite
```

### Erro: "CORS blocked"
```bash
# Verificar variáveis de ambiente
vercel env ls

# Reconfigurar CORS
vercel env add ALLOWED_ORIGINS
```

## 📈 Otimizações

### 1. Cache de headers:
```javascript
// Adicionar no index.js
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

### 2. Compressão:
```javascript
// Já configurado
app.use(compression());
```

### 3. Rate limiting:
```bash
# Instalar rate limiter
npm install express-rate-limit
```

```javascript
// Adicionar no index.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use(limiter);
```

## 🔄 CI/CD com GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📱 Exemplo de Uso no Frontend

```javascript
// Configuração da API
const API_BASE_URL = 'https://sua-api.vercel.app';

// Buscar países
async function getCountries() {
  const response = await fetch(`${API_BASE_URL}/api/countries?limit=10`);
  return response.json();
}

// Buscar estados do Brasil
async function getBrazilStates() {
  const response = await fetch(`${API_BASE_URL}/api/countries/BR/states`);
  return response.json();
}

// Buscar cidades
async function searchCities(query) {
  const response = await fetch(`${API_BASE_URL}/api/search?q=${query}&type=cities`);
  return response.json();
}
```

## ✅ Checklist de Deploy

- [ ] Vercel CLI instalado
- [ ] Login realizado
- [ ] Projeto testado localmente
- [ ] Banco de dados construído
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado
- [ ] Deploy realizado
- [ ] Testes de produção executados
- [ ] Domínio personalizado configurado (opcional)
- [ ] Monitoramento configurado

## 🆘 Suporte

- **Documentação Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Status**: [vercel-status.com](https://vercel-status.com)
- **Comunidade**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**Sua API estará online em minutos! 🚀**
