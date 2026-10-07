import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth/auth.config";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validations";
import { rateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials", 
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) return null;
        const ip = getClientIp(request.headers);
        const key = `login:${ip}:${validated.data.email}`;
        const limit = rateLimit(key, 5, 15 * 60_000);
        if (!limit.allowed) return null;

        await connectDB();
        const user = await User.findOne({ email: validated.data.email, active: true }).select("+password");
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(validated.data.password, user.password);
        if (!isValid) return null;
        resetRateLimit(key);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
