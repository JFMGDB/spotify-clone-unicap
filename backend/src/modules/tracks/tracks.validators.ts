import { body } from 'express-validator';

/** Validações para criação de track */
export const createTrackValidators = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ min: 1 })
    .withMessage('Título deve ter no mínimo 1 caractere'),
  body('artistId')
    .isUUID()
    .withMessage('ID do artista inválido'),
  body('albumId').optional().isUUID().withMessage('ID do álbum inválido'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duração deve ser um número inteiro maior que zero'),
  body('audioUrl')
    .trim()
    .notEmpty()
    .withMessage('URL do áudio é obrigatória')
    .isURL()
    .withMessage('URL do áudio inválida'),
  body('trackNumber').optional().isInt({ min: 1 }).withMessage('Número da faixa inválido'),
];

/** Validações para atualização de track */
export const updateTrackValidators = [
  body('title').optional().trim().notEmpty().withMessage('Título não pode ser vazio'),
  body('artistId').optional().isUUID().withMessage('ID do artista inválido'),
  body('albumId').optional().isUUID().withMessage('ID do álbum inválido'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duração deve ser maior que zero'),
  body('audioUrl').optional().trim().isURL().withMessage('URL do áudio inválida'),
  body('trackNumber').optional().isInt({ min: 1 }).withMessage('Número da faixa inválido'),
];

