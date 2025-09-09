const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function testAPI() {
  console.log('🧪 Testando API...\n');
  
  const tests = [
    {
      name: 'Health Check',
      path: '/api/health',
      expected: 'OK'
    },
    {
      name: 'Listar países (primeiros 5)',
      path: '/api/countries?limit=5',
      expected: 'data'
    },
    {
      name: 'Buscar Brasil por código',
      path: '/api/countries/BR',
      expected: 'Brazil'
    },
    {
      name: 'Estados do Brasil',
      path: '/api/countries/BR/states?limit=5',
      expected: 'data'
    },
    {
      name: 'Buscar São Paulo',
      path: '/api/search?q=São Paulo&type=cities&limit=3',
      expected: 'cities'
    },
    {
      name: 'Documentação da API',
      path: '/',
      expected: 'endpoints'
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`🔍 ${test.name}...`);
      const result = await makeRequest(test.path);
      
      if (result.status === 200) {
        if (test.expected === 'OK' && result.data.status === 'OK') {
          console.log(`   ✅ Passou`);
          passed++;
        } else if (test.expected === 'data' && result.data.data) {
          console.log(`   ✅ Passou (${result.data.data.length} itens)`);
          passed++;
        } else if (test.expected === 'Brazil' && result.data.name === 'Brazil') {
          console.log(`   ✅ Passou (${result.data.name})`);
          passed++;
        } else if (test.expected === 'cities' && result.data.results.cities) {
          console.log(`   ✅ Passou (${result.data.results.cities.length} cidades)`);
          passed++;
        } else if (test.expected === 'endpoints' && result.data.endpoints) {
          console.log(`   ✅ Passou`);
          passed++;
        } else {
          console.log(`   ❌ Falhou - Resposta inesperada`);
          failed++;
        }
      } else {
        console.log(`   ❌ Falhou - Status ${result.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Resultados:`);
  console.log(`   ✅ Passou: ${passed}`);
  console.log(`   ❌ Falhou: ${failed}`);
  console.log(`   📈 Taxa de sucesso: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log(`\n🎉 Todos os testes passaram! API funcionando perfeitamente.`);
  } else {
    console.log(`\n⚠️  Alguns testes falharam. Verifique se o servidor está rodando.`);
  }
}

// Executar testes
testAPI().catch(console.error);
