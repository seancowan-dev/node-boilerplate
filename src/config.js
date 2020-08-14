module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || "development",
    CLIENT_ORIGIN: "http://localhost:3000",
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://dunder_mifflin:password@localhost/sct_solutions",
    // TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://dunder_mifflin:password@localhost/fsocket-test",
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
  }