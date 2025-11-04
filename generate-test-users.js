// Script para crear un usuario de prueba con credenciales conocidas
const bcrypt = require('bcrypt');

async function createTestCredentials() {
  console.log('🔐 Generando credenciales de prueba...\n');
  
  // Credenciales de prueba simples
  const testUser = {
    email: "test@example.com",
    password: "123456",
    name: "Usuario de Prueba",
    role: "user"
  };
  
  const adminUser = {
    email: "admin@test.com", 
    password: "admin123",
    name: "Admin de Prueba",
    role: "admin"
  };
  
  try {
    // Generar hashes
    const testPasswordHash = await bcrypt.hash(testUser.password, 10);
    const adminPasswordHash = await bcrypt.hash(adminUser.password, 10);
    
    console.log('✅ Credenciales de USUARIO DE PRUEBA:');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Password:', testUser.password);
    console.log('🔒 Hash:', testPasswordHash);
    console.log('👤 Rol:', testUser.role);
    
    console.log('\n✅ Credenciales de ADMIN DE PRUEBA:');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password:', adminUser.password);
    console.log('🔒 Hash:', adminPasswordHash);
    console.log('👤 Rol:', adminUser.role);
    
    console.log('\n📋 DATOS PARA FIREBASE:');
    console.log('\n--- Usuario Normal ---');
    console.log(JSON.stringify({
      name: testUser.name,
      email: testUser.email,
      password_hash: testPasswordHash,
      role: testUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        budget: 1000,
        usage: "Gaming"
      }
    }, null, 2));
    
    console.log('\n--- Usuario Admin ---');
    console.log(JSON.stringify({
      name: adminUser.name,
      email: adminUser.email,
      password_hash: adminPasswordHash,
      role: adminUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        budget: 5000,
        usage: "Development"
      }
    }, null, 2));
    
    console.log('\n🎯 USAR EN EL FRONTEND:');
    console.log('// Usuario normal');
    console.log(`email: "${testUser.email}"`);
    console.log(`password: "${testUser.password}"`);
    console.log('\n// Usuario admin');
    console.log(`email: "${adminUser.email}"`);
    console.log(`password: "${adminUser.password}"`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createTestCredentials();