import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stripe, PRICE_IDS } from "@/lib/stripe";
import { SITE_URL } from "@/lib/seo";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { tier } = await request.json();
  const priceId = PRICE_IDS[tier];
  if (!priceId) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${SITE_URL}/en/account?checkout=success`,
    cancel_url: `${SITE_URL}/en/membership?checkout=cancelled`,
    metadata: { userId: user.id, tier },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
