import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect('mongodb+srv://andtit4:Xtprk2Fnocd4YOIi@cluster0.0o66gyz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('L\'administrateur existe déjà');
      return;
    }

    // Créer l'administrateur
    const admin = new User({
      username: 'admin',
      email: 'admin@oddsx.com',
      password: 'admin123',
      isAdmin: true,
      ktapBalance: 1000
    });

    await admin.save();
    console.log('Administrateur créé avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
};

createAdmin(); 
 
 