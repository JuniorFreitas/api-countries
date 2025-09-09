#!/bin/bash

echo "🚀 Deploy no Vercel - API Países, Estados e Cidades"
echo "=================================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar pré-requisitos
echo "🔍 Verificando pré-requisitos..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js não encontrado. Instale: https://nodejs.org${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ NPM não encontrado. Instale o Node.js${NC}"
    exit 1
fi

if ! command_exists vercel; then
    echo -e "${YELLOW}⚠️  Vercel CLI não encontrado. Instalando...${NC}"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro ao instalar Vercel CLI${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Pré-requisitos OK${NC}"
echo ""

# Verificar se está logado no Vercel
echo "🔐 Verificando login no Vercel..."
if ! vercel whoami >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Não está logado no Vercel. Fazendo login...${NC}"
    vercel login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro no login do Vercel${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Login OK${NC}"
echo ""

# Verificar se o banco de dados existe
echo "🗄️  Verificando banco de dados..."
if [ ! -f "database.sqlite" ]; then
    echo -e "${YELLOW}⚠️  Banco de dados não encontrado. Construindo...${NC}"
    npm run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Erro ao construir banco de dados${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Banco de dados OK${NC}"
echo ""

# Testar API localmente
echo "🧪 Testando API localmente..."
npm start &
SERVER_PID=$!
sleep 5

# Teste básico
if curl -s http://localhost:3000/api/health >/dev/null; then
    echo -e "${GREEN}✅ API funcionando localmente${NC}"
else
    echo -e "${RED}❌ API não está funcionando localmente${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Parar servidor local
kill $SERVER_PID 2>/dev/null
echo ""

# Configurar variáveis de ambiente
echo "⚙️  Configurando variáveis de ambiente..."

# Perguntar sobre domínios permitidos
echo -e "${BLUE}Digite os domínios permitidos para CORS (separados por vírgula):${NC}"
echo "Exemplo: https://meusite.com,https://app.meusite.com"
read -p "Domínios: " ALLOWED_ORIGINS

if [ -z "$ALLOWED_ORIGINS" ]; then
    ALLOWED_ORIGINS="https://meusite.com,https://app.meusite.com"
    echo -e "${YELLOW}⚠️  Usando domínios padrão: $ALLOWED_ORIGINS${NC}"
fi

# Configurar variáveis no Vercel
echo "Configurando ALLOWED_ORIGINS..."
echo "$ALLOWED_ORIGINS" | vercel env add ALLOWED_ORIGINS

echo "Configurando NODE_ENV..."
echo "production" | vercel env add NODE_ENV

echo "Configurando PORT..."
echo "3000" | vercel env add PORT

echo -e "${GREEN}✅ Variáveis configuradas${NC}"
echo ""

# Fazer deploy
echo "🚀 Fazendo deploy..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deploy realizado com sucesso!${NC}"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Teste sua API: https://sua-api.vercel.app/api/health"
    echo "2. Teste CORS com seus domínios"
    echo "3. Configure domínio personalizado (opcional)"
    echo ""
    echo "🔗 URLs úteis:"
    echo "- API: https://sua-api.vercel.app"
    echo "- Documentação: https://sua-api.vercel.app/"
    echo "- Health Check: https://sua-api.vercel.app/api/health"
    echo ""
    echo "📚 Documentação completa: VERCEL-DEPLOY.md"
else
    echo -e "${RED}❌ Erro no deploy${NC}"
    exit 1
fi
