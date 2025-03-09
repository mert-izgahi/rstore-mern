import { z, TypeOf } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = signInSchema.extend({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(1, "Price is required"),
  quantity: z.number().min(1, "Quantity is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  weight: z.number().min(1, "Weight is required"),
  featured: z.boolean().default(false),
  dimensions: z.object({
    length: z.number().min(1, "Length is required"),
    width: z.number().min(1, "Width is required"),
    height: z.number().min(1, "Height is required"),
  }),
});

export const accountSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  isDefault: z.boolean().default(false),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().min(1, "Min quantity is 1"),
        title: z.string().min(1, "title is required"),
        price: z.number().min(1, "Min price is 1"),
        image: z.string().min(1, "image is required"),
      })
    )
    .min(1, "At least one item is required"),
  shippingAddress: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    zipCode: z.string().min(1, "Zip code is required"),
  }),
  total: z.number().min(1, "Total is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

export type SignInInput = TypeOf<typeof signInSchema>;
export type SignUpInput = TypeOf<typeof signUpSchema>;
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
export type ProductInput = TypeOf<typeof productSchema>;
export type AccountInput = TypeOf<typeof accountSchema>;
export type AddressInput = TypeOf<typeof addressSchema>;
export type OrderInput = TypeOf<typeof orderSchema>;