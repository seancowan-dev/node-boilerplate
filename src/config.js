module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || "development",
    // CLIENT_AUTH_SECRET: process.env.API_CLIENT_SECRET,
    // API_CLIENT_KEY: process.env.API_CLIENT_KEY,
    // API_CLIENT_HASH: process.env.API_CLIENT_HASH,
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://dunder_mifflin:password@localhost/findthatmovie",
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://dunder_mifflin:password@localhost/findthatmovie-test",
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
  }