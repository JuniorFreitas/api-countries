const http = require('http');

const BASE_URL = 'http://localhost:3000';

function testCORS(origin, description) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      headers: {
        'Origin': origin,
        'User-Agent': 'CORS-Test-Script'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const corsHeaders = {
          'Access-Control-Allow-Origin': res.headers['access-control-allow-origin'],
          'Access-Control-Allow-Credentials': res.headers['access-control-allow-credentials'],
          'Access-Control-Allow-Methods': res.headers['access-control-allow-methods'],
          'Access-Control-Allow-Headers': res.headers['access-control-allow-headers']
        };

        resolve({
          status: res.statusCode,
          origin: origin,
          description: description,
          corsHeaders: corsHeaders,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runCORSTests() {
  console.log('🧪 Testando configuração de CORS...\n');

  const tests = [
    {
      origin: 'http://localhost:3000',
      description: 'Desenvolvimento local (permitido)'
    },
    {
      origin: 'http://localhost:3001',
      description: 'Desenvolvimento local (permitido)'
    },
    {
      origin: 'https://meusite.com',
      description: 'Domínio de produção (não configurado)'
    },
    {
      origin: 'https://app.meusite.com',
      description: 'Subdomínio (não configurado)'
    },
    {
      origin: 'https://malicioso.com',
      description: 'Domínio malicioso (bloqueado)'
    },
    {
      origin: undefined,
      description: 'Sem origin (Postman/mobile - permitido)'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🔍 ${test.description}...`);
      const result = await testCORS(test.origin, test.description);
      
      if (result.success) {
        console.log(`   ✅ Permitido`);
        console.log(`   📋 CORS Headers:`, result.corsHeaders);
        passed++;
      } else {
        console.log(`   ❌ Bloqueado (Status: ${result.status})`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log(`📊 Resultados:`);
  console.log(`   ✅ Permitidos: ${passed}`);
  console.log(`   ❌ Bloqueados: ${failed}`);

  console.log(`\n💡 Para configurar domínios permitidos:`);
  console.log(`   1. Defina a variável ALLOWED_ORIGINS:`);
  console.log(`      export ALLOWED_ORIGINS="https://meusite.com,https://app.meusite.com"`);
  console.log(`   2. Ou crie um arquivo .env com:`);
  console.log(`      ALLOWED_ORIGINS=https://meusite.com,https://app.meusite.com`);
  console.log(`   3. Reinicie o servidor`);
}

// Executar testes
runCORSTests().catch(console.error);
