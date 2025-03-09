import Stripe from "stripe";
import configs from "../configs";

export const stripeClient = new Stripe(configs.STRIPE_SECRET_KEY! as string);
