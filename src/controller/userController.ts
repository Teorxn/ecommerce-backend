import { Request, Response } from 'express';
import { UserModel } from '../models/users';
import { LoginRequest, LoginResponse, UserProfileResponse, UpdateUserRequest } from '../models/entities/User';

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class UserController {
  static async login(req: Request, res: Response) {
    try {
      console.log('Login attempt for:', req.body.email);
      
      const { email, password }: LoginRequest = req.body;
      
      // Validar campos requeridos
      if (!email || !password) {
        console.log('Missing email or password');
        return res.status(400).json({
          message: 'Email and password are required'
        });
      }

      // Buscar usuario por email
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      // Validar contraseña
      const isValidPassword = await UserModel.validatePassword(password, user.password_hash);
      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      // Login exitoso - generar token simple (en producción usar JWT)
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
      
      // Estructura que coincide con tu frontend
      const response = {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          preferences: user.preferences || { budget: 0, usage: "" }
        },
        // También agregar id y role en el nivel superior para compatibilidad
        id: user.id,
        role: user.role
      };

      console.log('Login successful for user:', email, 'Role:', user.role);
      res.status(200).json(response);

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      console.log('Registration attempt for:', req.body.email);
      
      const { name, email, password, confirmPassword }: RegisterRequest = req.body;
      
      // Validar campos requeridos
      if (!name || !email || !password || !confirmPassword) {
        console.log('Missing required fields');
        return res.status(400).json({
          message: 'All fields are required'
        });
      }

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        console.log('Passwords do not match');
        return res.status(400).json({
          message: 'Passwords do not match'
        });
      }

      // Validar longitud de contraseña
      if (password.length < 6) {
        console.log('Password too short');
        return res.status(400).json({
          message: 'Password must be at least 6 characters long'
        });
      }

      // Validar formato de email (básico)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log('Invalid email format');
        return res.status(400).json({
          message: 'Invalid email format'
        });
      }

      // Verificar si el usuario ya existe
      const existingUser = await UserModel.getUserByEmail(email);
      if (existingUser) {
        console.log('User already exists:', email);
        return res.status(409).json({
          message: 'User with this email already exists'
        });
      }

      // Crear el usuario
      const userId = await UserModel.createUser({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: await UserModel.hashPassword(password),
        role: 'user', // Por defecto los nuevos usuarios son 'user'
        preferences: {
          budget: 0,
          usage: ""
        }
      });

      if (!userId) {
        console.log('Failed to create user');
        return res.status(500).json({
          message: 'Failed to create user'
        });
      }

      // Obtener el usuario creado para la respuesta
      const newUser = await UserModel.getUserById(userId);
      if (!newUser) {
        console.log('User created but could not retrieve');
        return res.status(500).json({
          message: 'User created but could not retrieve user data'
        });
      }

      // Estructura de respuesta que coincide con tu frontend
      const response = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        preferences: newUser.preferences || { budget: 0, usage: "" },
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
        id: newUser.id
      };

      console.log('User registered successfully:', email, 'ID:', userId);
      res.status(201).json(response);

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  static async getUserProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log('Getting profile for user:', id);
      
      const user = await UserModel.getUserById(id);
      if (!user) {
        console.log('User not found for profile:', id);
        return res.status(404).json({
          message: 'User not found'
        });
      }

      // Remover password_hash de la respuesta
      const { password_hash, ...userWithoutPassword } = user;
      
      const response: UserProfileResponse = {
        user: userWithoutPassword
      };

      console.log('Profile retrieved for user:', id);
      res.status(200).json(response);

    } catch (error) {
      console.error('Get user profile error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  static async updateUserProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData: UpdateUserRequest = req.body;

      console.log('Updating profile for user:', id, 'Data:', updateData);

      // No permitir actualizar ciertos campos sensibles
      const sanitizedData = { ...updateData };
      delete (sanitizedData as any).id;
      delete (sanitizedData as any).password_hash;
      delete (sanitizedData as any).createdAt;
      delete (sanitizedData as any).role; // Solo admin debería poder cambiar roles

      const success = await UserModel.updateUser(id, sanitizedData);
      if (!success) {
        console.log('User update failed for:', id);
        return res.status(404).json({
          message: 'User not found or update failed'
        });
      }

      console.log('Profile updated successfully for user:', id);
      res.status(200).json({
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('Update user profile error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  static async getAllUsers(req: Request, res: Response) {
    try {
      console.log('Getting all users...');
      
      const users = await UserModel.getAllUsers();
      
      // Remover password_hash de todos los usuarios
      const usersWithoutPasswords = users.map(user => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      console.log('Retrieved all users:', usersWithoutPasswords.length);
      res.status(200).json({
        users: usersWithoutPasswords,
        total: usersWithoutPasswords.length
      });

    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
}