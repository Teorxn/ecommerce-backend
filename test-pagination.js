// Script para probar la paginación
const BASE_URL = 'http://localhost:4000';

async function testEndpoint(url, description) {
  try {
    console.log(`\n🔍 Testing: ${description}`);
    console.log(`📡 URL: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Result:`, {
      products: data.products?.length || 0,
      total: data.total,
      page: data.page,
      limit: data.limit,
      filters: data.filters
    });
    
    if (data.products?.length > 0) {
      console.log(`📦 First product:`, data.products[0]);
    }
    
    return data;
  } catch (error) {
    console.error(`❌ Error testing ${description}:`, error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting pagination tests...\n');

  // Test 1: Sin parámetros (default)
  await testEndpoint(`${BASE_URL}/products`, 'Default pagination');
  
  // Test 2: Con page y limit
  await testEndpoint(`${BASE_URL}/products?page=1&limit=5`, 'Page 1, Limit 5');
  
  // Test 3: Con sorting
  await testEndpoint(`${BASE_URL}/products?page=1&limit=5&sort=best_rating`, 'Sorted by best rating');
  
  // Test 4: Con categorías (array)
  await testEndpoint(`${BASE_URL}/products?page=1&limit=5&categories[]=Electronics`, 'Filter by Electronics category');
  
  // Test 5: Con múltiples categorías
  await testEndpoint(`${BASE_URL}/products?page=1&limit=5&categories[]=Electronics&categories[]=Clothing`, 'Filter by multiple categories');
  
  // Test 6: Combinación completa
  await testEndpoint(`${BASE_URL}/products?page=1&limit=3&sort=price_low_to_high&categories[]=Electronics`, 'Complete pagination with filters and sort');
  
  // Test 7: Página que no existe
  await testEndpoint(`${BASE_URL}/products?page=999&limit=10`, 'Non-existent page');
  
  console.log('\n✨ Tests completed!');
}

// Ejecutar si está disponible fetch (Node 18+) o si es browser
if (typeof fetch !== 'undefined') {
  runTests();
} else {
  console.log('Este script requiere Node.js 18+ o un browser con fetch API');
  console.log('Puedes probarlo en el browser copiando y pegando el código en DevTools');
}