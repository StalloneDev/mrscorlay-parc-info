import { Request, Response, NextFunction } from "express";

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Non authentifié" });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: "Accès non autorisé",
          message: "Vous n'avez pas les permissions nécessaires pour effectuer cette action"
        });
      }

      next();
    } catch (error) {
      console.error("Erreur de vérification des rôles:", error);
      res.status(500).json({ error: "Erreur serveur lors de la vérification des rôles" });
    }
  };
}; 