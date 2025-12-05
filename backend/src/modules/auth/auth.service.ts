import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { requireDb } from '../../config/db';
import { users } from '../../db/schema';
import { AppError } from '../../common/errors/AppError';
import { ErrorCodes } from '../../common/errors/error-codes';
import { env } from '../../config/env';
import { validateEmail } from '../../common/utils/validation';

/** Interface para dados de registro */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

/** Interface para dados de login */
export interface LoginData {
  email: string;
  password: string;
}

/** Interface para resposta de autenticação */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

/** Registra um novo usuário */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const database = requireDb();

  // Validações
  if (!validateEmail(data.email)) {
    throw new AppError('Email inválido', 400, ErrorCodes.VALIDATION_ERROR);
  }

  if (data.password.length < 6) {
    throw new AppError('Senha deve ter no mínimo 6 caracteres', 400, ErrorCodes.VALIDATION_ERROR);
  }

  if (!data.name || data.name.trim().length === 0) {
    throw new AppError('Nome é obrigatório', 400, ErrorCodes.VALIDATION_ERROR);
  }

  // Verifica se usuário já existe
  const existingUser = await database
    .select()
    .from(users)
    .where(eq(users.email, data.email.toLowerCase().trim()))
    .limit(1);

  if (existingUser.length > 0) {
    throw new AppError('Email já cadastrado', 409, ErrorCodes.ALREADY_EXISTS);
  }

  // Hash da senha
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  // Cria usuário
  const [newUser] = await database
    .insert(users)
    .values({
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      name: data.name.trim(),
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

  // Gera token JWT
  const secret: string = env.JWT_SECRET || 'default-secret';
  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email },
    secret as string,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return {
    user: newUser,
    token,
  };
}

/** Autentica um usuário */
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const database = requireDb();

  // Validações
  if (!validateEmail(data.email)) {
    throw new AppError('Email inválido', 400, ErrorCodes.VALIDATION_ERROR);
  }

  // Busca usuário
  const [user] = await database
    .select()
    .from(users)
    .where(eq(users.email, data.email.toLowerCase().trim()))
    .limit(1);

  if (!user) {
    throw new AppError('Email ou senha inválidos', 401, ErrorCodes.UNAUTHORIZED);
  }

  // Verifica senha
  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Email ou senha inválidos', 401, ErrorCodes.UNAUTHORIZED);
  }

  // Gera token JWT
  const secret: string = env.JWT_SECRET || 'default-secret';
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    secret as string,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
}

