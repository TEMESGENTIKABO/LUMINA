import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PRICE_IDS: Record<string, string> = {
  supporter: process.env.STRIPE_PRICE_SUPPORTER!,
  patron: process.env.STRIPE_PRICE_PATRON!,
};
