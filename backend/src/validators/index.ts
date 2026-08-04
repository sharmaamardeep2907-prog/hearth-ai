import { z } from "zod";

export const registerSchema = z.object({ email: z.string().email(), password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/), firstName: z.string().min(1).max(50), lastName: z.string().min(1).max(50), phone: z.string().regex(/^\+?[0-9]{10,15}$/).optional() });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });
export const refreshTokenSchema = z.object({ refreshToken: z.string().min(1) });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/) });
export const forgotPasswordSchema = z.object({ email: z.string().email() });
export const updateProfileSchema = z.object({ firstName: z.string().min(1).max(50).optional(), lastName: z.string().min(1).max(50).optional(), phone: z.string().regex(/^\+?[0-9]{10,15}$/).optional() });
export const createBookingSchema = z.object({ providerId: z.string().min(1), service: z.object({ name: z.string().min(1), category: z.string().min(1), subcategory: z.string().optional(), price: z.number().positive(), priceType: z.enum(["fixed","hourly","estimate"]).optional(), duration: z.number().positive().optional() }), scheduled: z.object({ date: z.string().min(1), startTime: z.string().min(1), endTime: z.string().optional() }), address: z.object({ street: z.string().min(1), city: z.string().min(1), state: z.string().min(1), pincode: z.string().min(1), coordinates: z.object({ lat: z.number(), lng: z.number() }).optional() }), pricing: z.object({ subtotal: z.number().positive(), discount: z.number().min(0).default(0), tax: z.number().min(0).default(0), total: z.number().positive() }), type: z.enum(["instant","scheduled","emergency","package","recurring","group"]).optional(), notes: z.string().max(1000).optional() });
export const createReviewSchema = z.object({ bookingId: z.string().min(1), rating: z.number().min(1).max(5), title: z.string().max(200).optional(), comment: z.string().min(10).max(5000), images: z.array(z.string()).max(5).optional() });
export const cancelBookingSchema = z.object({ reason: z.string().min(5).max(500) });
export const rescheduleSchema = z.object({ newDate: z.string().min(1), newTime: z.string().min(1), reason: z.string().min(5).max(500) });
export const aiChatSchema = z.object({ messages: z.array(z.object({ role: z.enum(["user","assistant","system"]), content: z.string().min(1) })).min(1), context: z.string().optional() });
export const walletWithdrawSchema = z.object({ amount: z.number().min(100) });