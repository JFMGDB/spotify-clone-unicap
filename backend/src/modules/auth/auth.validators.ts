import { body } from 'express-validator';

/** Validações para registro de usuário */
export const registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2 })
    .withMessage('Nome deve ter no mínimo 2 caracteres'),
];

/** Validações para login */
export const loginValidators = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
];

