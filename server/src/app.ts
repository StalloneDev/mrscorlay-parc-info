import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "./db/pool";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import employeeRoutes from "./routes/employees";
import equipmentRoutes from "./routes/equipment";
import ticketRoutes from "./routes/tickets";
import inventoryRoutes from "./routes/inventory";
import licenseRoutes from "./routes/licenses";
import maintenanceRoutes from "./routes/maintenance";
import { authenticateToken } from "./middleware/auth";
import { errorHandler } from "./middleware/error-handler";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173 || https://mrscorlay-parc-info-backend.vercel.app/",
  credentials: true
}));
app.use(express.json());

// Session configuration
const PostgresqlStore = pgSession(session);
const sessionStore = new PostgresqlStore({
  pool,
  tableName: "sessions"
});

app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateToken, userRoutes);
app.use("/api/employees", authenticateToken, employeeRoutes);
app.use("/api/equipment", authenticateToken, equipmentRoutes);
app.use("/api/tickets", authenticateToken, ticketRoutes);
app.use("/api/inventory", authenticateToken, inventoryRoutes);
app.use("/api/licenses", authenticateToken, licenseRoutes);
app.use("/api/maintenance", authenticateToken, maintenanceRoutes);

// Error Handler
app.use(errorHandler);

export default app; 