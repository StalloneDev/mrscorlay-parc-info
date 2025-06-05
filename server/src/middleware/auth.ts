import { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Vérifier si l'utilisateur est authentifié via la session
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    // Récupérer les informations de l'utilisateur depuis la base de données
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, req.session.userId));

    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    // Ajouter les informations de l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error);
    res.status(500).json({ error: "Erreur serveur lors de l'authentification" });
  }
}; 