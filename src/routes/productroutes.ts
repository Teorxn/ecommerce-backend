import { Router } from "express";
import { ProductController } from "../controller/productController";

const router = Router();

// Importante: la ruta más específica debe ir primero
router.get('/recommendations', ProductController.getRecommendations);
router.get('/categories', ProductController.getCategories);
router.get('/:id', ProductController.getProduct);
router.get('/', ProductController.getAllProducts);

export { router };
export default router;