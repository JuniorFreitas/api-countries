# 🌍 API Países, Estados e Cidades

API REST para consulta de dados geográficos com países, estados e cidades do mundo todo.

## 🚀 Características

- **250 países** com informações completas
- **5.099 estados/províncias**
- **151.165 cidades**
- **SQLite** para performance e simplicidade
- **100% gratuito** para hospedagem
- **Compressão gzip** para otimização
- **CORS habilitado**
- **Busca por texto** em todos os dados
- **Paginação** em todas as consultas

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Construir banco de dados (converte JSON para SQLite)
npm run build

# Iniciar servidor
npm start

# Modo desenvolvimento
npm run dev
```

## 🔧 Endpoints

### Países
- `GET /api/countries` - Listar países
- `GET /api/countries/:id` - Buscar país por ID ou código (BR, BRA, 31)
- `GET /api/countries/:id/states` - Estados de um país
- `GET /api/countries/:id/cities` - Cidades de um país

### Estados
- `GET /api/states/:id/cities` - Cidades de um estado

### Busca
- `GET /api/search?q=termo` - Buscar em todos os dados
- `GET /api/search?q=termo&type=countries` - Buscar apenas países
- `GET /api/search?q=termo&type=states` - Buscar apenas estados
- `GET /api/search?q=termo&type=cities` - Buscar apenas cidades

### Utilitários
- `GET /api/health` - Status da API
- `GET /` - Documentação da API

## 📝 Exemplos de Uso

### Listar países
```bash
curl "http://localhost:3000/api/countries?search=Brasil&limit=10"
```

### Buscar país por código
```bash
curl "http://localhost:3000/api/countries/BR"
curl "http://localhost:3000/api/countries/BRA"
curl "http://localhost:3000/api/countries/31"
```

### Estados do Brasil
```bash
curl "http://localhost:3000/api/countries/BR/states"
```

### Cidades de São Paulo
```bash
curl "http://localhost:3000/api/states/3550308/cities"
```

### Buscar por texto
```bash
curl "http://localhost:3000/api/search?q=São Paulo"
curl "http://localhost:3000/api/search?q=New York&type=cities"
```

## 🌐 Hospedagem Gratuita

### Vercel (Recomendado)
1. Instale o Vercel CLI: `npm i -g vercel`
2. Execute: `vercel`
3. Configure as variáveis de ambiente se necessário

### Netlify
1. Conecte seu repositório GitHub
2. Configure build command: `npm run build`
3. Configure publish directory: `.`

### Railway
1. Conecte seu repositório
2. Configure start command: `npm start`
3. Deploy automático

## 💰 Custos

- **SQLite + Vercel/Netlify**: **100% GRATUITO** ✅
- **DynamoDB**: ~$1.31/mês
- **PostgreSQL (Supabase)**: Gratuito até 500MB
- **MySQL (PlanetScale)**: Gratuito até 1GB

## 🏗️ Estrutura do Projeto

```
api-pais-cidade-estado/
├── countries+states+cities.json  # Dados originais
├── database.sqlite               # Banco SQLite (gerado)
├── index.js                      # Servidor Express
├── scripts/
│   └── build-db.js              # Script para construir banco
├── package.json
└── README.md
```

## 🔍 Performance

- **Tempo de resposta**: < 50ms para consultas simples
- **Tamanho do banco**: ~15MB (otimizado)
- **Concorrência**: Suporta centenas de usuários simultâneos
- **Cache**: Headers de cache configurados

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Construir banco de dados
npm run build

# Iniciar em modo desenvolvimento
npm run dev

# Testar API
npm test

# Testar configuração de CORS
npm run test:cors

# Ver exemplo de configuração
./exemplo-cors.sh
```

## 📊 Dados Incluídos

- **Países**: Nome, códigos ISO, moeda, capital, região, etc.
- **Estados**: Nome, códigos, coordenadas, timezone
- **Cidades**: Nome, coordenadas, timezone
- **Relacionamentos**: Hierarquia país → estado → cidade

## 🔒 Segurança

- **CORS configurado** por domínio específico
- Validação de parâmetros
- Sanitização de queries
- Headers de segurança
- Rate limiting (recomendado para produção)

### Configuração de CORS

A API está configurada com CORS restritivo. Para permitir acesso de seus domínios:

```bash
# Configurar domínios permitidos
export ALLOWED_ORIGINS="https://meusite.com,https://app.meusite.com"

# Iniciar servidor
npm start
```

**Documentação completa:** [CORS-CONFIG.md](CORS-CONFIG.md)

## 📈 Monitoramento

- Endpoint `/api/health` para health checks
- Logs estruturados
- Métricas de performance
- Alertas de erro

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `git commit -m 'Adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 Email: seu-email@exemplo.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/api-pais-cidade-estado/issues)
- 📖 Documentação: [Wiki](https://github.com/seu-usuario/api-pais-cidade-estado/wiki)

---

**Desenvolvido com ❤️ para a comunidade**
