export interface ServiceCategory {
  id: string; name: string; slug: string; icon: string; description: string;
  imageUrl: string; subcategories: string[]; serviceCount: number; popular: boolean;
}

export interface Professional {
  id: string; name: string; slug: string; avatar: string; category: string;
  subcategory: string; title: string; description: string; bio: string;
  rating: number; reviewCount: number; completedJobs: number; yearsExperience: number;
  hourlyRate: number; location: string; city: string; languages: string[];
  verified: boolean; featured: boolean; available: boolean;
  images: string[]; services: ServiceOffering[]; reviews: Review[];
  availability: AvailabilitySlot[];
}

export interface ServiceOffering {
  id: string; name: string; description: string; price: number;
  priceType: "fixed" | "hourly" | "estimate"; duration: number; includes: string[];
}

export interface Review {
  id: string; userId: string; userName: string; userAvatar: string;
  rating: number; comment: string; date: string; serviceBooked: string; helpful: number;
}

export interface AvailabilitySlot { day: string; slots: { start: string; end: string }[]; }

export interface Booking {
  id: string; customerId: string; professionalId: string; serviceId: string;
  serviceName: string; status: string; date: string; timeSlot: string;
  address: string; totalAmount: number; paymentStatus: string; paymentMethod: string;
  notes: string; createdAt: string; updatedAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "rescheduled";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed" | "partial";

export interface Customer {
  id: string; name: string; email: string; phone: string; avatar: string;
  addresses: Address[]; paymentMethods: PaymentMethod[]; bookings: string[];
  reviewCount: number; joinedDate: string;
}

export interface Address {
  id: string; label: string; street: string; city: string; state: string;
  pincode: string; isDefault: boolean; coordinates: { lat: number; lng: number };
}

export interface PaymentMethod {
  id: string; type: "card" | "upi" | "netbanking" | "wallet"; label: string;
  last4?: string; isDefault: boolean;
}

export interface NavItem { label: string; href: string; icon?: string; children?: NavItem[]; featured?: boolean; }
export interface FAQ { question: string; answer: string; }
export interface Testimonial {
  id: string; name: string; avatar: string; role: string; content: string;
  rating: number; location: string;
}