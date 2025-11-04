// Script para probar el sistema de usuarios actualizado
const BASE_URL = 'http://localhost:4000';

async function testEndpoint(url, method = 'GET', body = null, description) {
  try {
    console.log(`\n🔍 Testing: ${description}`);
    console.log(`📡 ${method} ${url}`);
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
      console.log(`📤 Body:`, body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Response:`, data);
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`❌ Error testing ${description}:`, error.message);
    return { error: error.message };
  }
}

async function runUserTests() {
  console.log('🚀 Starting user system tests (compatible with frontend)...\n');

  // Test 1: Login usando la ruta /login (como espera tu frontend)
  console.log('=== TESTING FRONTEND COMPATIBLE LOGIN ===');
  
  const loginResult = await testEndpoint(
    `${BASE_URL}/login`, 
    'POST', 
    {
      email: "test@example.com",
      password: "123456"
    },
    'Frontend Login Test - Usuario Normal'
  );

  // Test 2: Login admin
  await testEndpoint(
    `${BASE_URL}/login`, 
    'POST', 
    {
      email: "admin@test.com",
      password: "admin123"
    },
    'Frontend Login Test - Usuario Admin'
  );

  // Test 3: Login fallido
  await testEndpoint(
    `${BASE_URL}/login`, 
    'POST', 
    {
      email: "test@example.com",
      password: "wrongpassword"
    },
    'Frontend Login Test - Contraseña incorrecta'
  );

  // Verificar estructura de respuesta
  if (loginResult.data && loginResult.data.token) {
    console.log('\n✅ ESTRUCTURA DE RESPUESTA CORRECTA:');
    console.log('🔑 Token:', loginResult.data.token ? 'Presente' : 'Ausente');
    console.log('👤 User.id:', loginResult.data.user?.id ? 'Presente' : 'Ausente');
    console.log('🔒 User.role:', loginResult.data.user?.role ? 'Presente' : 'Ausente');
    console.log('📋 ID en root:', loginResult.data.id ? 'Presente' : 'Ausente');
    console.log('🎭 Role en root:', loginResult.data.role ? 'Presente' : 'Ausente');
  }

  console.log('\n✨ Tests completed!');
  console.log('\n🎯 Para tu frontend, usa estas credenciales:');
  console.log('Usuario: test@example.com / 123456');
  console.log('Admin: admin@test.com / admin123');
}

// Ejecutar si está disponible fetch (Node 18+) o si es browser
if (typeof fetch !== 'undefined') {
  runUserTests();
} else {
  console.log('Este script requiere Node.js 18+ o un browser con fetch API');
  console.log('Puedes probarlo en el browser copiando y pegando el código en DevTools');
}