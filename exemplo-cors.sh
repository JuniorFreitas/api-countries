#!/bin/bash

echo "🔧 Exemplo de Configuração de CORS"
echo "=================================="
echo ""

echo "1️⃣ Configuração para Desenvolvimento Local:"
echo "   export ALLOWED_ORIGINS=\"http://localhost:3000,http://localhost:3001\""
echo "   npm start"
echo ""

echo "2️⃣ Configuração para Produção:"
echo "   export ALLOWED_ORIGINS=\"https://meusite.com,https://app.meusite.com\""
echo "   npm start"
echo ""

echo "3️⃣ Configuração com Múltiplos Domínios:"
echo "   export ALLOWED_ORIGINS=\"https://meusite.com,https://app.meusite.com,https://admin.meusite.com,http://localhost:3000\""
echo "   npm start"
echo ""

echo "4️⃣ Testando a Configuração:"
echo "   # Iniciar servidor"
echo "   npm start &"
echo ""
echo "   # Em outro terminal, testar CORS"
echo "   npm run test:cors"
echo ""

echo "5️⃣ Exemplo de Requisição do Frontend:"
echo "   fetch('http://localhost:3000/api/countries', {"
echo "     method: 'GET',"
echo "     headers: {"
echo "       'Content-Type': 'application/json'"
echo "     }"
echo "   })"
echo "   .then(response => response.json())"
echo "   .then(data => console.log(data));"
echo ""

echo "6️⃣ Para Deploy no Vercel:"
echo "   vercel env add ALLOWED_ORIGINS"
echo "   # Digite: https://meusite.com,https://app.meusite.com"
echo ""

echo "7️⃣ Para Deploy no Netlify:"
echo "   # Adicione no netlify.toml:"
echo "   [build.environment]"
echo "     ALLOWED_ORIGINS = \"https://meusite.com,https://app.meusite.com\""
echo ""

echo "8️⃣ Para Deploy no Railway:"
echo "   railway variables set ALLOWED_ORIGINS=\"https://meusite.com,https://app.meusite.com\""
echo ""

echo "✅ Configuração concluída! Sua API agora aceita apenas os domínios especificados."
