import { DatabaseStorage } from '../storage';
import { db } from '../db';
import { workflowTemplates, workflowConfigs } from '@shared/schema';
import { eq } from 'drizzle-orm';

jest.mock('../db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

describe('DatabaseStorage', () => {
  let storage: DatabaseStorage;

  beforeEach(() => {
    storage = new DatabaseStorage();
    jest.clearAllMocks();
  });

  describe('getTemplates', () => {
    it('should return all templates', async () => {
      const mockTemplates = [
        { id: 1, name: 'Test Template', description: 'Test', category: 'CI', yaml: 'test' }
      ];
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockResolvedValue(mockTemplates)
      });

      const result = await storage.getTemplates();
      expect(result).toEqual(mockTemplates);
      expect(db.select).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await expect(storage.getTemplates()).rejects.toThrow('Database error');
    });
  });

  describe('getTemplateById', () => {
    it('should return template by id', async () => {
      const mockTemplate = { id: 1, name: 'Test', description: 'Test', category: 'CI', yaml: 'test' };
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockTemplate])
        })
      });

      const result = await storage.getTemplateById(1);
      expect(result).toEqual(mockTemplate);
    });
  });
});
