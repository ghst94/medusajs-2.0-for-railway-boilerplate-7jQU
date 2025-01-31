import { createStep, createHook, createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createProductStep } from "./steps/create-product";

export const myWorkflow = createWorkflow(
  "my-workflow",
  async function (input, container) {
    // Step 1: Create the product
    const product = await createProductStep(input, container);

    // Step 2: Create a hook to allow additional logic after product creation
    const productCreatedHook = createHook("productCreated", { productId: product.id });

    return new WorkflowResponse(product, { hooks: [productCreatedHook] });
  }
);

