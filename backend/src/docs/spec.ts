import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "HEARTH AI API", version: "1.0.0", description: "Enterprise-grade AI-powered service marketplace API" },
    servers: [{ url: "http://localhost:5000/api/v1", description: "Dev" }, { url: "https://api.hearth.ai/api/v1", description: "Prod" }],
    components: {
      securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
    },
    tags: [
      { name: "Auth" }, { name: "AI" }, { name: "Bookings" }, { name: "Reviews" }, { name: "Wallet" }, { name: "Notifications" }, { name: "Health" },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);