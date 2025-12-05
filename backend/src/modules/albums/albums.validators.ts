import { body } from 'express-validator';

/** Validações para criação de álbum */
export const createAlbumValidators = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ min: 1 })
    .withMessage('Título deve ter no mínimo 1 caractere'),
  body('artistId')
    .isUUID()
    .withMessage('ID do artista inválido'),
  body('coverUrl').optional().isURL().withMessage('URL da capa inválida'),
  body('releaseDate').optional().isISO8601().withMessage('Data de lançamento inválida'),
];

/** Validações para atualização de álbum */
export const updateAlbumValidators = [
  body('title').optional().trim().notEmpty().withMessage('Título não pode ser vazio'),
  body('artistId').optional().isUUID().withMessage('ID do artista inválido'),
  body('coverUrl').optional().isURL().withMessage('URL da capa inválida'),
  body('releaseDate').optional().isISO8601().withMessage('Data de lançamento inválida'),
];

