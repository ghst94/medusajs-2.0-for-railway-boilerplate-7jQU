import { createTransactionWorkflow } from "@medusajs/workflows-sdk";

export const productCreatedWorkflow = createTransactionWorkflow({
  name: "productCreated",
  handler: async (input, container) => {
    console.log(`Product Created: ${input.productId}`);
  },
});
