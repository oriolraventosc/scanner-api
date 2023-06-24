import type { ProductStructure } from "../../../types/types";

const pagination = (products: ProductStructure[], limit: number) =>
  products.slice(0, limit);

export default pagination;
