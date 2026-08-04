import mongoose from "mongoose";
import { User } from "../models/user.model";
import { Provider } from "../models/provider.model";
import { UserRole, AuthProvider } from "../types";
import { config } from "../config";

async function seed() {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log("Connected to MongoDB for seeding");
    await Promise.all([User.deleteMany({}), Provider.deleteMany({})]);
    console.log("Cleaned existing data");
    const admin = await User.create({ email: "admin@hearth.ai", password: "Admin@123456", firstName: "Admin", lastName: "User", role: UserRole.ADMIN, provider: AuthProvider.LOCAL, emailVerified: true });
    console.log("Admin created:", admin.email);
    const customers = await User.insertMany([
      { email: "amar@hearth.ai", password: "Customer@123", firstName: "Amardeep", lastName: "Singh", role: UserRole.CUSTOMER, provider: AuthProvider.LOCAL, emailVerified: true },
      { email: "priya@hearth.ai", password: "Customer@123", firstName: "Priya", lastName: "Sharma", role: UserRole.CUSTOMER, provider: AuthProvider.LOCAL, emailVerified: true },
    ]);
    console.log(`${customers.length} customers created`);
    await Provider.insertMany([
      { userId: new mongoose.Types.ObjectId(), businessName: "Rajesh Electrical Services", slug: "rajesh-electrical", category: "Electrician", isVerified: true, isFeatured: true, isActive: true, ratings: { average: 4.9, count: 324 }, services: [{ name: "Wiring", price: 500, priceType: "estimate", duration: 120 }], addresses: [{ label: "Workshop", street: "42 MG Road", city: "Mumbai", state: "Maharashtra", pincode: "400001", coordinates: { lat: 19.076, lng: 72.8777 }, isDefault: true }] },
      { userId: new mongoose.Types.ObjectId(), businessName: "Amit Plumbing Solutions", slug: "amit-plumbing", category: "Plumber", isVerified: true, isFeatured: true, isActive: true, ratings: { average: 4.8, count: 256 }, addresses: [{ label: "Shop", street: "15 Park Street", city: "Mumbai", state: "Maharashtra", pincode: "400002", coordinates: { lat: 19.058, lng: 72.8307 }, isDefault: true }] },
      { userId: new mongoose.Types.ObjectId(), businessName: "Priya Beauty & Spa", slug: "priya-beauty", category: "Salon & Spa", isVerified: true, isFeatured: true, isActive: true, ratings: { average: 4.8, count: 567 }, addresses: [{ label: "Studio", street: "88 Linking Road", city: "Mumbai", state: "Maharashtra", pincode: "400050", coordinates: { lat: 19.069, lng: 72.8347 }, isDefault: true }] },
    ]);
    console.log("3 providers created");
    console.log("✅ Seed complete! Admin: admin@hearth.ai / Admin@123456");
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) { console.error("Seed failed", e); await mongoose.disconnect(); process.exit(1); }
}
seed();