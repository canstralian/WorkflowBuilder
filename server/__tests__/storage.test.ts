import { DatabaseStorage } from '../storage';
import { db } from '../db';
import { type Template, type Config } from '@shared/schema';
import { DrizzleError } from 'drizzle-orm';

// Mock the database module
jest.mock('../db', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

describe('DatabaseStorage', () => {
  let storage: DatabaseStorage;
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(() => {
    storage = new DatabaseStorage();
    jest.clearAllMocks();
  });

  describe('getTemplates', () => {
    it('should return all templates', async () => {
      const mockTemplates: Template[] = [
        { id: 1, name: 'Test Template', description: 'Test', category: 'CI', yaml: 'test' }
      ];
      mockDb.select.mockReturnValue({
        from: jest.fn().mockResolvedValue(mockTemplates)
      } as any);

      const result = await storage.getTemplates();
      expect(result).toEqual(mockTemplates);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      const dbError = new DrizzleError('Database error');
      mockDb.select.mockReturnValue({
        from: jest.fn().mockRejectedValue(dbError)
      } as any);

      await expect(storage.getTemplates()).rejects.toThrow('Database operation failed');
    });
  });

  describe('getTemplateById', () => {
    it('should return template by id', async () => {
      const mockTemplate: Template = {
        id: 1,
        name: 'Test',
        description: 'Test',
        category: 'CI',
        yaml: 'test'
      };
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([mockTemplate])
        })
      } as any);

      const result = await storage.getTemplateById(1);
      expect(result).toEqual(mockTemplate);
    });

    it('should return undefined for non-existent template', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([])
        })
      } as any);

      const result = await storage.getTemplateById(999);
      expect(result).toBeUndefined();
    });
  });

  describe('getConfigsByRepo', () => {
    it('should return configs for a repository', async () => {
      const mockConfigs: Config[] = [{
        id: 1,
        templateId: 1,
        repoOwner: 'test-owner',
        repoName: 'test-repo',
        yaml: 'test-yaml'
      }];
      mockDb.select.mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(mockConfigs)
        })
      } as any);

      const result = await storage.getConfigsByRepo('test-owner', 'test-repo');
      expect(result).toEqual(mockConfigs);
    });
  });
});