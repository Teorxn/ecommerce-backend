import {db} from '../config/firebase';
import { Product } from './entities/Product';
import { Query } from 'firebase-admin/firestore';
const collectionName = 'products';

interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  sort?: string;
  filters?: {
    categories?: string[];
  };
}

export const ProductModel = {
  getProductById: async (id: string): Promise<Product | null> => {
    const productDoc = await db.collection(collectionName).doc(id).get();
    if (!productDoc.exists) {
      return null;
    }
    return { id: productDoc.id, ...productDoc.data() } as Product;
  },

  getAllProducts: async (): Promise<Product[]> => {
    const productsSnapshot = await db.collection(collectionName).get();
    return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
  },

  getProductsWithPagination: async (params: PaginationParams): Promise<{ products: Product[], total: number }> => {
    console.log('getProductsWithPagination called with params:', params);
    
    let query: Query = db.collection(collectionName);
    let countQuery: Query = db.collection(collectionName);

    // Aplicar filtros de categoría a ambas consultas
    if (params.filters?.categories && params.filters.categories.length > 0) {
      console.log('Applying category filter:', params.filters.categories);
      query = query.where('category', 'array-contains-any', params.filters.categories);
      countQuery = countQuery.where('category', 'array-contains-any', params.filters.categories);
    }

    // Aplicar ordenamiento solo a la consulta principal
    if (params.sort) {
      console.log('Applying sort:', params.sort);
      switch (params.sort) {
        case 'best_rating':
          query = query.orderBy('rating', 'desc');
          break;
        case 'newest':
          query = query.orderBy('createdAt', 'desc');
          break;
        case 'price_low_to_high':
          query = query.orderBy('price', 'asc');
          break;
        case 'price_high_to_low':
          query = query.orderBy('price', 'desc');
          break;
        default:
          // Sin ordenamiento específico, usar el orden natural de Firestore
          break;
      }
    }

    // Obtener el total de documentos que coinciden con los filtros
    const totalSnapshot = await countQuery.get();
    const total = totalSnapshot.size;
    console.log('Total documents found:', total);

    // Si no hay documentos, retornar array vacío
    if (total === 0) {
      return { products: [], total: 0 };
    }

    // Aplicar paginación
    const paginatedQuery = query.offset(params.offset).limit(params.limit);
    const productsSnapshot = await paginatedQuery.get();
    console.log('Documents after pagination:', productsSnapshot.size);
    
    const products = productsSnapshot.docs.map((doc) => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Product));

    console.log('Returning products:', products.length);
    return { products, total };
  },

  getCategories: async (): Promise<string[]> => {
    const productsSnapshot = await db.collection(collectionName).get();
    const categoriesSet = new Set<string>();
    
    productsSnapshot.docs.forEach((doc) => {
      const product = doc.data() as Product;
      if (product.category && Array.isArray(product.category)) {
        product.category.forEach(cat => categoriesSet.add(cat));
      }
    });

    return Array.from(categoriesSet).sort();
  }
};
