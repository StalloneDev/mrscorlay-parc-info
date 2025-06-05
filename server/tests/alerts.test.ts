import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { storage } from '../storage';
import { db } from '../db';
import type { Alert } from '@shared/schema';

describe('Alerts Management', () => {
  let testAlert: Alert;
  const testUser = {
    id: '12345678-1234-1234-1234-123456789012',
    email: 'test@example.com',
    password: 'password123',
    role: 'admin',
    isActive: true,
  };

  beforeAll(async () => {
    // Créer un utilisateur de test si nécessaire
    await db.insert(users).values(testUser);
  });

  afterAll(async () => {
    // Nettoyer les données de test
    if (testAlert?.id) {
      await storage.deleteAlert(testAlert.id);
    }
    await db.delete(users).where(eq(users.id, testUser.id));
  });

  it('should create a new alert', async () => {
    const alertData = {
      type: 'maintenance' as const,
      title: 'Test Maintenance Alert',
      description: 'This is a test alert',
      priority: 'haute' as const,
      status: 'nouvelle' as const,
      createdBy: testUser.id,
    };

    testAlert = await storage.createAlert(alertData);

    expect(testAlert).toBeDefined();
    expect(testAlert.id).toBeDefined();
    expect(testAlert.type).toBe(alertData.type);
    expect(testAlert.title).toBe(alertData.title);
    expect(testAlert.description).toBe(alertData.description);
    expect(testAlert.priority).toBe(alertData.priority);
    expect(testAlert.status).toBe(alertData.status);
    expect(testAlert.createdBy).toBe(alertData.createdBy);
  });

  it('should retrieve an alert by ID', async () => {
    const retrievedAlert = await storage.getAlert(testAlert.id);
    expect(retrievedAlert).toBeDefined();
    expect(retrievedAlert?.id).toBe(testAlert.id);
  });

  it('should update an alert', async () => {
    const updateData = {
      status: 'en_cours' as const,
      description: 'Updated description',
    };

    const updatedAlert = await storage.updateAlert(testAlert.id, updateData);
    expect(updatedAlert.status).toBe(updateData.status);
    expect(updatedAlert.description).toBe(updateData.description);
  });

  it('should filter alerts by type', async () => {
    const alerts = await storage.getAlertsByType('maintenance');
    expect(alerts).toBeInstanceOf(Array);
    expect(alerts.some(alert => alert.id === testAlert.id)).toBe(true);
  });

  it('should filter alerts by status', async () => {
    const alerts = await storage.getAlertsByStatus('en_cours');
    expect(alerts).toBeInstanceOf(Array);
    expect(alerts.some(alert => alert.id === testAlert.id)).toBe(true);
  });

  it('should filter alerts by priority', async () => {
    const alerts = await storage.getAlertsByPriority('haute');
    expect(alerts).toBeInstanceOf(Array);
    expect(alerts.some(alert => alert.id === testAlert.id)).toBe(true);
  });

  it('should delete an alert', async () => {
    await storage.deleteAlert(testAlert.id);
    const deletedAlert = await storage.getAlert(testAlert.id);
    expect(deletedAlert).toBeUndefined();
  });
}); 