// Script para probar el registro de usuarios
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

async function runRegisterTests() {
  console.log('🚀 Starting user registration tests...\n');

  // Test 1: Registro exitoso
  const timestamp = Date.now();
  const registerResult = await testEndpoint(
    `${BASE_URL}/register`, 
    'POST', 
    {
      name: "Usuario Nuevo",
      email: `nuevo.usuario.${timestamp}@test.com`,
      password: "123456",
      confirmPassword: "123456"
    },
    'Register New User - Success'
  );

  // Test 2: Registro con contraseñas que no coinciden
  await testEndpoint(
    `${BASE_URL}/register`, 
    'POST', 
    {
      name: "Usuario Test",
      email: `test.${timestamp}@test.com`,
      password: "123456",
      confirmPassword: "654321"
    },
    'Register - Passwords do not match'
  );

  // Test 3: Registro con email duplicado
  await testEndpoint(
    `${BASE_URL}/register`, 
    'POST', 
    {
      name: "Usuario Duplicado",
      email: "test@example.com", // Este ya existe
      password: "123456",
      confirmPassword: "123456"
    },
    'Register - Email already exists'
  );

  // Test 4: Registro con contraseña muy corta
  await testEndpoint(
    `${BASE_URL}/register`, 
    'POST', 
    {
      name: "Usuario Test",
      email: `short.password.${timestamp}@test.com`,
      password: "123",
      confirmPassword: "123"
    },
    'Register - Password too short'
  );

  // Test 5: Registro con email inválido
  await testEndpoint(
    `${BASE_URL}/register`, 
    'POST', 
    {
      name: "Usuario Test",
      email: "email-invalido",
      password: "123456",
      confirmPassword: "123456"
    },
    'Register - Invalid email format'
  );

  // Test 6: Registro con campos faltantes
  await testEndpoint(
    `${BASE_URL}/register`, 
    'POST', 
    {
      name: "Usuario Test",
      email: `incomplete.${timestamp}@test.com`,
      password: "123456"
      // confirmPassword faltante
    },
    'Register - Missing fields'
  );

  // Test 7: Si el registro fue exitoso, probar login
  if (registerResult.status === 201) {
    console.log('\n=== TESTING LOGIN WITH NEW USER ===');
    await testEndpoint(
      `${BASE_URL}/login`, 
      'POST', 
      {
        email: `nuevo.usuario.${timestamp}@test.com`,
        password: "123456"
      },
      'Login with newly registered user'
    );
  }

  console.log('\n✨ Registration tests completed!');
}

// Ejecutar si está disponible fetch (Node 18+) o si es browser
if (typeof fetch !== 'undefined') {
  runRegisterTests();
} else {
  console.log('Este script requiere Node.js 18+ o un browser con fetch API');
  console.log('Puedes probarlo en el browser copiando y pegando el código en DevTools');
}