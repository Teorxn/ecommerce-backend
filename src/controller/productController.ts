import { ProductModel } from "../models/products";
import { Product } from "../models/entities/Product";
import { Request, Response } from "express";

export const ProductController = {
  getProduct: async (req: Request, res: Response) => {
    try {
      const productId = req.params.id;
      const product = await ProductModel.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product' });
    }
  },

  getAllProducts: async (req: Request, res: Response) => {
    try {
      // Extraer parámetros de query
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = req.query.sort as string;
      
      // Manejar categories[] (array) o categories (string)
      let categories: string[] | undefined;
      if (req.query['categories[]']) {
        // Si viene como categories[], puede ser array o string
        const categoriesParam = req.query['categories[]'];
        categories = Array.isArray(categoriesParam) ? categoriesParam as string[] : [categoriesParam as string];
      } else if (req.query.categories) {
        // Si viene como categories, convertir a array
        const categoriesParam = req.query.categories;
        categories = Array.isArray(categoriesParam) ? categoriesParam as string[] : [categoriesParam as string];
      }

      console.log('Query params:', { page, limit, sort, categories });

      // Calcular offset para paginación
      const offset = (page - 1) * limit;

      // Construir filtros
      const filters: any = {};
      if (categories && categories.length > 0) {
        filters.categories = categories;
      }

      console.log('Filters applied:', filters);

      // Obtener productos con paginación y filtros
      const result = await ProductModel.getProductsWithPagination({
        page,
        limit,
        offset,
        sort,
        filters
      });

      console.log('Result from model:', { productsCount: result.products.length, total: result.total });

      // Estructura de respuesta exacta que espera el frontend
      const response = {
        products: result.products,
        total: result.total,
        page,
        limit,
        ...(filters.categories && { filters: { categories: filters.categories } })
      };

      res.json(response);

    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  },

  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await ProductModel.getCategories();
      
      res.json({
        categories,
        total: categories.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching categories' });
    }
  },

  getRecommendations: async (req: Request, res: Response) => {
    try {
      console.log('getRecommendations called');
      
      // Obtener todos los productos
      const allProducts = await ProductModel.getAllProducts();
      
      if (allProducts.length === 0) {
        return res.json({
          recommendations: [],
          message: 'No products available for recommendations'
        });
      }

      // Seleccionar un producto aleatorio
      const randomIndex = Math.floor(Math.random() * allProducts.length);
      const randomProduct = allProducts[randomIndex];

      console.log('Returning random product:', randomProduct.id, '-', randomProduct.name);

      res.json({
        recommendations: [randomProduct],
        total: 1,
        message: 'Product recommendation based on your preferences'
      });

    } catch (error) {
      console.error('Error in getRecommendations:', error);
      res.status(500).json({ 
        error: 'Error generating recommendations',
        recommendations: [],
        total: 0
      });
    }
  }
};