// User validation schemas (Zod)

import { z } from 'zod'

// User roles enum
export const UserRoleEnum = z.enum([
  'CLUB_MANAGER',
  'VALIDATOR',
  'PRODUCTION',
  'ADMIN',
])

// Login form validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email jest wymagany')
    .email('Nieprawidłowy adres email'),
  password: z
    .string()
    .min(1, 'Hasło jest wymagane'),
})

// Create user validation (admin)
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email jest wymagany')
    .email('Nieprawidłowy adres email')
    .transform((v) => v.toLowerCase()),
  name: z
    .string()
    .min(2, 'Imię musi mieć min. 2 znaki')
    .max(100, 'Imię może mieć max. 100 znaków'),
  password: z
    .string()
    .min(8, 'Hasło musi mieć min. 8 znaków')
    .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
    .regex(/[0-9]/, 'Hasło musi zawierać cyfrę'),
  role: UserRoleEnum,
  clubIds: z.array(z.string().cuid()).optional(),
})

// Update user validation (admin)
export const updateUserSchema = z.object({
  userId: z.string().cuid(),
  name: z.string().min(2).max(100).optional(),
  role: UserRoleEnum.optional(),
  clubIds: z.array(z.string().cuid()).optional(),
})

// Change password validation
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Aktualne hasło jest wymagane'),
    newPassword: z
      .string()
      .min(8, 'Nowe hasło musi mieć min. 8 znaków')
      .regex(/[A-Z]/, 'Hasło musi zawierać wielką literę')
      .regex(/[0-9]/, 'Hasło musi zawierać cyfrę'),
    confirmPassword: z.string().min(1, 'Potwierdzenie hasła jest wymagane'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword'],
  })

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
