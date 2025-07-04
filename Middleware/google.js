const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { config } = require("dotenv");
const db = require("../db");
config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3090/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      const googleId = profile.id;
      const name = profile.displayName;
      const email = profile.emails[0].value;
      const profileImage = profile.photos[0].value;

      db.query(
        "SELECT * FROM users WHERE google_id = ?",
        [googleId],
        (err, results) => {
          if (err) {
            return done(err);
          }
          if (results.length > 0) {
            return done(null, results[0]);
          } else {
            db.query(
              "INSERT INTO users (google_id, user_name, user_email, user_profile) VALUES (?, ?, ?, ?)",
              [googleId, name, email, profileImage],
              (err, results) => {
                if (err) {
                  return done(err);
                }
                db.query(
                  "SELECT * FROM users WHERE google_id = ?",
                  [googleId],
                  (err, results) => {
                    if (err) {
                      return done(err);
                    }
                    return done(null, results[0]);
                  }
                );
              }
            );
          }
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
