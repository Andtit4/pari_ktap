const admin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export default admin; 
 
 