import helmet from "helmet";

export const securityMiddleware = () => {
  if (process.env.NODE_ENV === "development") {
    // Dev mode: allow localhost:5173 (Vite) + unsafe eval for hot reload
    return helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'", "http://localhost:5173"],
        scriptSrc: [
          "'self'",
          "'unsafe-eval'",
          "'unsafe-inline'",
          "http://localhost:5173",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "http://localhost:5173",
          "https://fonts.googleapis.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'", "http://localhost:5173"],
        frameSrc: ["'self'"],
      },
    });
  }

  // Prod mode: strict CSP
  return helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "https://api.yourdomain.com"], // replace with your API URL
      frameSrc: ["'self'", "https://accounts.google.com", "https://github.com"], // for OAuth
    },
  });
};
