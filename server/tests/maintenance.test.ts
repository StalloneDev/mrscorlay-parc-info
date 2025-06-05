import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { storage } from '../storage';
import { db } from '../db';
import { users, equipment } from '@shared/schema';
import type { MaintenanceSchedule, Equipment } from '@shared/schema';
import { eq } from 'drizzle-orm';

describe('Maintenance Schedule Management', () => {
  let testMaintenance: MaintenanceSchedule;
  let testEquipment: Equipment;
  
  const testUser = {
    id: '12345678-1234-1234-1234-123456789012',
    email: 'test-tech@example.com',
    password: 'password123',
    role: 'technicien',
    isActive: true,
  };

  const testEquipmentData = {
    type: 'ordinateur' as const,
    model: 'Test Model',
    serialNumber: 'TEST123',
    purchaseDate: new Date(),
    status: 'en service' as const,
  };

  beforeAll(async () => {
    // Créer un utilisateur de test
    await db.insert(users).values(testUser);
    
    // Créer un équipement de test
    const [newEquipment] = await db.insert(equipment).values(testEquipmentData).returning();
    testEquipment = newEquipment;
  });

  afterAll(async () => {
    // Nettoyer les données de test
    if (testMaintenance?.id) {
      await storage.deleteMaintenanceSchedule(testMaintenance.id);
    }
    if (testEquipment?.id) {
      await db.delete(equipment).where(eq(equipment.id, testEquipment.id));
    }
    await db.delete(users).where(eq(users.id, testUser.id));
  });

  it('should create a new maintenance schedule', async () => {
    const maintenanceData = {
      type: 'preventive' as const,
      title: 'Test Maintenance',
      description: 'This is a test maintenance schedule',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 jour
      status: 'planifie' as const,
      notes: 'Test notes',
      createdBy: testUser.id,
    };

    testMaintenance = await storage.createMaintenanceSchedule(maintenanceData);

    expect(testMaintenance).toBeDefined();
    expect(testMaintenance.id).toBeDefined();
    expect(testMaintenance.type).toBe(maintenanceData.type);
    expect(testMaintenance.title).toBe(maintenanceData.title);
    expect(testMaintenance.status).toBe(maintenanceData.status);
  });

  it('should retrieve a maintenance schedule by ID', async () => {
    const retrieved = await storage.getMaintenanceSchedule(testMaintenance.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(testMaintenance.id);
  });

  it('should update a maintenance schedule', async () => {
    const updateData = {
      status: 'en_cours' as const,
      notes: 'Updated notes',
    };

    const updated = await storage.updateMaintenanceSchedule(testMaintenance.id, updateData);
    expect(updated.status).toBe(updateData.status);
    expect(updated.notes).toBe(updateData.notes);
  });

  it('should assign a technician to maintenance', async () => {
    await storage.assignTechnicianToMaintenance(testMaintenance.id, testUser.id);
    // La vérification se fait implicitement car une erreur serait levée si l'opération échouait
  });

  it('should add equipment to maintenance', async () => {
    await storage.addEquipmentToMaintenance(testMaintenance.id, testEquipment.id);
    // La vérification se fait implicitement car une erreur serait levée si l'opération échouait
  });

  it('should get upcoming maintenances', async () => {
    const upcomingMaintenances = await storage.getUpcomingMaintenances(7); // 7 jours
    expect(upcomingMaintenances).toBeInstanceOf(Array);
    expect(upcomingMaintenances.some(m => m.id === testMaintenance.id)).toBe(true);
  });

  it('should remove equipment from maintenance', async () => {
    await storage.removeEquipmentFromMaintenance(testMaintenance.id, testEquipment.id);
    // La vérification se fait implicitement car une erreur serait levée si l'opération échouait
  });

  it('should remove technician from maintenance', async () => {
    await storage.removeTechnicianFromMaintenance(testMaintenance.id, testUser.id);
    // La vérification se fait implicitement car une erreur serait levée si l'opération échouait
  });

  it('should delete a maintenance schedule', async () => {
    await storage.deleteMaintenanceSchedule(testMaintenance.id);
    const deleted = await storage.getMaintenanceSchedule(testMaintenance.id);
    expect(deleted).toBeUndefined();
  });
}); 