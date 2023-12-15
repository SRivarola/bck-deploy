import Stripe from "stripe";
import env from "../config/env.js";

export default async function (amount, currency) {
    
  const data = {
    amount: amount * 100,
    currency,
  };
  const stripe = new Stripe(env.STRIPE_KEY);
  const intent = await stripe.paymentIntents.create(data);

  return intent
}
