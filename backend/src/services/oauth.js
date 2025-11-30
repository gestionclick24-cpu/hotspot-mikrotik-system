const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple');
const { findByProvider, createUser } = require('../models/user');
const fs = require('fs');

function setupGoogleStrategy(passport){
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    let user = await findByProvider('google', profile.id);
    if(!user){
      const id = await createUser({ email, passwordHash: null, provider:'google', providerId: profile.id });
      user = { id, email };
    }
    return done(null, user);
  }));
}

function setupAppleStrategy(passport){
  let key = null;
  try { key = fs.readFileSync(process.env.APPLE_PRIVATE_KEY_PATH); } catch(e){ key = null; }
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKey: key,
    callbackURL: (process.env.GOOGLE_CALLBACK_URL || '').replace('google','apple')
  }, async (accessToken, refreshToken, idToken, profile, done) => {
    const email = (profile && profile.email) || (idToken && idToken.email) || null;
    const providerId = (profile && profile.id) || (idToken && idToken.sub) || null;
    let user = await findByProvider('apple', providerId);
    if(!user){
      const id = await createUser({ email, passwordHash: null, provider:'apple', providerId });
      user = { id, email };
    }
    return done(null, user);
  }));
}

module.exports = { setupGoogleStrategy, setupAppleStrategy };
