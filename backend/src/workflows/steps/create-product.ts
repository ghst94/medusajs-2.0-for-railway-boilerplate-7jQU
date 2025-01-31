import { ProductService } from "@medusajs/services";

export const createProductStep = async (input, container) => {
  const productService = container.resolve(ProductService);

  const product = await productService.create({
    title: input.title,
    description: input.description,
    price: input.price
  });

  return product;
};

