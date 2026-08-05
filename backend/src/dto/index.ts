import { z } from "zod";

export const signupDTO = z.object({ name: z.string().min(2).max(100), email: z.string().email(), phone: z.string().regex(/^\+?[1-9]\d{9,14}$/), password: z.string().min(8) });
export const loginDTO = z.object({ email: z.string().email(), password: z.string().min(1) });
export const forgotPasswordDTO = z.object({ email: z.string().email() });
export const resetPasswordDTO = z.object({ token: z.string().min(1), password: z.string().min(8) });
export const updateProfileDTO = z.object({ name: z.string().min(2).max(100).optional(), phone: z.string().optional() });
export const providerJoinDTO = z.object({ name: z.string().min(2).max(100), email: z.string().email(), phone: z.string(), profession: z.string().min(1), experience: z.number().min(0).max(50), skills: z.array(z.string()).min(1), city: z.string().min(1), serviceAreas: z.array(z.string()).min(1), travelRadius: z.number().min(1).max(50), bio: z.string().max(1000).optional() });
export const updateProviderDTO = z.object({ name: z.string().optional(), bio: z.string().max(1000).optional(), languages: z.array(z.string()).optional(), travelRadius: z.number().min(1).max(50).optional(), serviceAreas: z.array(z.string()).optional() });
export const createBookingDTO = z.object({ providerId: z.string(), serviceName: z.string(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), time: z.string(), address: z.string().min(10), city: z.string(), pincode: z.string().regex(/^\d{6}$/), notes: z.string().max(500).optional() });
export const createReviewDTO = z.object({ bookingId: z.string(), providerId: z.string(), rating: z.number().min(1).max(5), comment: z.string().min(10).max(2000) });
export const addMoneyDTO = z.object({ amount: z.number().min(100).max(50000) });
export const searchDTO = z.object({ q: z.string().min(1), category: z.string().optional(), city: z.string().optional(), minRating: z.number().min(1).max(5).optional(), page: z.number().min(1).default(1), limit: z.number().min(1).max(50).default(10) });
export const aiChatDTO = z.object({ message: z.string().min(1).max(2000), sessionId: z.string().optional(), context: z.enum(["booking","recommendation","support","general"]).default("general") });
export type SignupInput = z.infer<typeof signupDTO>;
