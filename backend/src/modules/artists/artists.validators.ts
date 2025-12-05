import { body } from 'express-validator';

/** Validações para criação de artista */
export const createArtistValidators = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 1 })
    .withMessage('Nome deve ter no mínimo 1 caractere'),
  body('imageUrl').optional().isURL().withMessage('URL da imagem inválida'),
  body('bio').optional().isString(),
];

/** Validações para atualização de artista */
export const updateArtistValidators = [
  body('name').optional().trim().notEmpty().withMessage('Nome não pode ser vazio'),
  body('imageUrl').optional().isURL().withMessage('URL da imagem inválida'),
  body('bio').optional().isString(),
];

