import ProductModuleService from "@medusajs/product";

export const createProductStep = async (input, container) => {
  const productService = container.resolve(ProductModuleService);

  const product = await productService.create({
    title: input.title,
    description: input.description,
    price: input.price
  });

  return product;
};
