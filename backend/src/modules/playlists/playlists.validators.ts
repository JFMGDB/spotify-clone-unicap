import { body } from 'express-validator';

/** Validações para criação de playlist */
export const createPlaylistValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 1 })
    .withMessage('Nome deve ter no mínimo 1 caractere'),
  body('description').optional().isString(),
  body('coverUrl').optional().isURL().withMessage('URL da capa inválida'),
  body('isPublic').optional().isBoolean().withMessage('isPublic deve ser um booleano'),
];

/** Validações para atualização de playlist */
export const updatePlaylistValidators = [
  body('name').optional().trim().notEmpty().withMessage('Nome não pode ser vazio'),
  body('description').optional().isString(),
  body('coverUrl').optional().isURL().withMessage('URL da capa inválida'),
  body('isPublic').optional().isBoolean().withMessage('isPublic deve ser um booleano'),
];

/** Validações para adicionar track à playlist */
export const addTrackValidators = [
  body('trackId')
    .isUUID()
    .withMessage('ID da música inválido'),
];

