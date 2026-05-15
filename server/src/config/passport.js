import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/user.model.js";

const googleClientId =
  process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || process.env.CLIENTID;
const googleClientSecret =
  process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET || process.env.CLIENTSECRET;
const serverPort = process.env.PORT || "5000";
const isProduction = process.env.NODE_ENV === "production";
const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL || 
  (isProduction 
    ? "https://smashutme.onrender.com/api/auth/google/callback"
    : `http://localhost:${serverPort}/api/auth/google/callback`);

// Debug logging
console.log("[Passport Config] Google OAuth Settings:");
console.log(`  - Client ID: ${googleClientId ? googleClientId.substring(0, 20) + "..." : "NOT SET"}`);
console.log(`  - Client Secret: ${googleClientSecret ? "SET" : "NOT SET"}`);
console.log(`  - Callback URL: ${googleCallbackUrl}`);
console.log(`  - Port: ${serverPort}`);

if (googleClientId && googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackUrl,
        proxy:true
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          let isNewUser = false;

          if (!email) {
            return done(new Error("Google account email is unavailable."));
          }

          const fullName =
            profile.displayName ||
            [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(" ") ||
            "SmashUTME User";

          let user = await User.findOne({ email });

          if (!user) {
            isNewUser = true;
            user = await User.create({
              fullName,
              email,
              authProvider: "google",
              authProviderId: profile.id,
              avatarUrl: profile.photos?.[0]?.value || null,
              acceptedTermsAt: new Date(),
              lastLoginAt: new Date(),
            });
          } else {
            user.authProviderId = user.authProviderId || profile.id;
            user.avatarUrl = user.avatarUrl || profile.photos?.[0]?.value || null;
            user.lastLoginAt = new Date();
            await user.save();
          }

          return done(null, user, { isNewUser });
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
} else {
  console.error("[Passport Config] ERROR: Google OAuth credentials are missing!");
  console.error(`  - GOOGLE_CLIENT_ID/CLIENT_ID: ${!googleClientId}`);
  console.error(`  - GOOGLE_CLIENT_SECRET/CLIENT_SECRET: ${!googleClientSecret}`);
}

export default passport;