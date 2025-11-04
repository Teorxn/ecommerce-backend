import { Router } from "express";
import { UserController } from "../controller/userController";

const router = Router();

// Rutas de autenticación
router.post('/login', UserController.login);
router.post('/register', UserController.register);

// Rutas de gestión de usuarios
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserProfile);
router.put('/:id', UserController.updateUserProfile);

export { router };
export default router;