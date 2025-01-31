import { createHookHandler } from "@medusajs/framework/workflows-sdk";

export const productCreatedHandler = createHookHandler(
  "productCreated",
  async (input, container) => {
    console.log(`Product Created: ${input.productId}`);
    // You can add additional logic here (e.g., notifications, analytics, etc.)
  }
);
