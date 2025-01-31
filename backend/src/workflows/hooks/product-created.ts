import { createWorkflow } from "@medusajs/workflows-sdk";

export const productCreatedWorkflow = createWorkflow({
  name: "productCreated", // Use 'name' instead of 'id'
  handler: async (input, container) => {
    console.log(`Product Created: ${input.productId}`);
    // Add additional logic if necessary
  },
});
