import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware para validação rigorosa de request body com Zod
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedData = schema.parse(req.body);
      req.body = parsedData; // Sobrescreve req.body com dados validados e tipados (whitelist)
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errosFormatados = error.issues.map((err) => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }));

        res.status(400).json({
          erro: 'Falha na validação dos dados enviados.',
          detalhes: errosFormatados
        });
        return;
      }

      res.status(400).json({ erro: 'Payload de requisição inválido.' });
    }
  };
};
