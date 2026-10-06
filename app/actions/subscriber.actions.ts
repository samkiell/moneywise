"use server";

import { subscriberService } from "@/lib/services/subscriber.service";
import { subscriberSchema } from "@/lib/validations";

export interface SubscribeActionState {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function subscribeToNewsletter(
  prevState: SubscribeActionState,
  formData: FormData
): Promise<SubscribeActionState> {
  const email = formData.get("email");
  const name = formData.get("name");

  const validation = subscriberSchema.safeParse({
    email,
    name: name ? String(name) : undefined,
  });

  if (!validation.success) {
    return {
      error: validation.error.errors[0]?.message || "Invalid email address.",
    };
  }

  try {
    const result = await subscriberService.subscribe(validation.data.email, validation.data.name);

    if (result.alreadySubscribed) {
      return {
        success: true,
        message: "You are already subscribed to the Money Wise newsletter!",
      };
    }

    return {
      success: true,
      message: "Thank you for subscribing! You'll receive our next edition.",
    };
  } catch (err) {
    console.error("Subscription failed:", err);
    return {
      error: "Unable to complete subscription at this time. Please try again later.",
    };
  }
}
