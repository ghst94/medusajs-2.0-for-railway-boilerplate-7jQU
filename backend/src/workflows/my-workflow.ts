import {
  createStep,
  createHook,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { createProductStep } from "./steps/create-product"

export const myWorkflow = createWorkflow(
  "my-workflow",
  function (input) {
    // Step 1: Create the product
    const product = createProductStep(input)

    // Step 2: Create a hook to allow additional logic after product creation
    const productCreatedHook = createHook(
      "productCreated",
      { productId: product.id }
    )

    // Step 3: Return the response with the hook
    return new WorkflowResponse(product, {
      hooks: [productCreatedHook],
    })
  }
)

