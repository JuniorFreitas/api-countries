# ⚡ Comandos Vercel - Guia Rápido

## 🚀 Deploy Rápido

### Deploy Automático (Recomendado)
```bash
# Executar script automatizado
./deploy-vercel.sh
```

### Deploy Manual
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Deploy para produção
vercel --prod
```

## ⚙️ Configuração de Variáveis

```bash
# Configurar domínios permitidos
vercel env add ALLOWED_ORIGINS
# Digite: https://meusite.com,https://app.meusite.com

# Configurar ambiente
vercel env add NODE_ENV
# Digite: production

# Configurar porta
vercel env add PORT
# Digite: 3000
```

## 🔍 Comandos Úteis

```bash
# Ver status do projeto
vercel ls

# Ver logs
vercel logs

# Ver variáveis de ambiente
vercel env ls

# Remover variável
vercel env rm NOME_DA_VARIAVEL

# Ver informações do projeto
vercel inspect

# Abrir projeto no browser
vercel open

# Ver quem está logado
vercel whoami

# Logout
vercel logout
```

## 🧪 Testes Pós-Deploy

```bash
# Teste básico
curl https://sua-api.vercel.app/api/health

# Teste de CORS
curl -H "Origin: https://meusite.com" \
     https://sua-api.vercel.app/api/health

# Teste de países
curl https://sua-api.vercel.app/api/countries?limit=5

# Teste de busca
curl https://sua-api.vercel.app/api/search?q=Brasil
```

## 🔄 Atualizações

```bash
# Deploy de atualização
vercel --prod

# Deploy para preview
vercel

# Deploy com mensagem
vercel --prod --message "Adicionada nova funcionalidade"
```

## 🗑️ Remover Deploy

```bash
# Remover projeto
vercel remove

# Confirmar remoção
# Digite o nome do projeto para confirmar
```

## 📊 Monitoramento

```bash
# Ver logs em tempo real
vercel logs --follow

# Logs de uma função específica
vercel logs --function=index.js

# Ver métricas
vercel analytics
```

## 🆘 Solução de Problemas

```bash
# Verificar status
vercel status

# Ver logs de erro
vercel logs --error

# Redeploy forçado
vercel --force

# Ver configuração
vercel inspect
```

## 📱 Exemplo de Uso

```javascript
// Configuração da API
const API_URL = 'https://sua-api.vercel.app';

// Buscar países
fetch(`${API_URL}/api/countries?limit=10`)
  .then(response => response.json())
  .then(data => console.log(data));

// Buscar estados do Brasil
fetch(`${API_URL}/api/countries/BR/states`)
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🔗 URLs Importantes

- **Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)
- **Documentação**: [vercel.com/docs](https://vercel.com/docs)
- **Status**: [vercel-status.com](https://vercel-status.com)
- **Comunidade**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**Dica**: Use `./deploy-vercel.sh` para deploy automático! 🚀
