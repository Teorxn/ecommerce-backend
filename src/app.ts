import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productroutes';
import userRoutes from './routes/userRoutes';
import { UserController } from './controller/userController';
import { ProductController } from './controller/productController';

const app = express();

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ruta directa de login para compatibilidad con frontend
app.post('/login', UserController.login);

// Ruta directa de registro para compatibilidad con frontend
app.post('/register', UserController.register);

// Ruta directa de recomendaciones
app.get('/recommendations', ProductController.getRecommendations);

app.use('/products', productRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the E-commerce Backend!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});