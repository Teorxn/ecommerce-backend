import { db } from '../config/firebase';
import { User } from './entities/User';
import bcrypt from 'bcrypt';

const collectionName = 'users';

export const UserModel = {
  getUserById: async (id: string): Promise<User | null> => {
    try {
      console.log('Getting user by ID:', id);
      const userDoc = await db.collection(collectionName).doc(id).get();
      if (!userDoc.exists) {
        console.log('User not found by ID:', id);
        return null;
      }
      return { id: userDoc.id, ...userDoc.data() } as User;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    try {
      console.log('Getting user by email:', email);
      const usersSnapshot = await db.collection(collectionName)
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (usersSnapshot.empty) {
        console.log('User not found by email:', email);
        return null;
      }
      
      const userDoc = usersSnapshot.docs[0];
      const user = { id: userDoc.id, ...userDoc.data() } as User;
      console.log('User found:', { id: user.id, email: user.email, role: user.role });
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  },

  validatePassword: async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
      console.log('Validating password...');
      const isValid = await bcrypt.compare(plainPassword, hashedPassword);
      console.log('Password validation result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  },

  hashPassword: async (plainPassword: string): Promise<string> => {
    try {
      console.log('Hashing password...');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      console.log('Password hashed successfully');
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> => {
    try {
      console.log('Creating new user:', userData.email);
      const now = new Date().toISOString();
      const newUser = {
        ...userData,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await db.collection(collectionName).add(newUser);
      console.log('User created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<boolean> => {
    try {
      console.log('Updating user:', id);
      const updateData = {
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      await db.collection(collectionName).doc(id).update(updateData);
      console.log('User updated successfully:', id);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      console.log('Getting all users...');
      const usersSnapshot = await db.collection(collectionName).get();
      const users = usersSnapshot.docs.map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      } as User));
      console.log('Found users:', users.length);
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
};