import { create } from "zustand";
import { ExtendedProduct } from "../types/productType";

interface CartStore {
  products: ExtendedProduct[];
  totalPrice: number;
  addProduct: (product: ExtendedProduct) => void;
  increaseProductCount: (product: ExtendedProduct) => void;
  decreaseProductCount: (product: ExtendedProduct) => void;
  deleteProduct: (product: ExtendedProduct) => void;
}

const useCartStore = create<CartStore>((set) => ({
  products: [],
  totalPrice: 0,
  addProduct: (product) =>
    set((state) => {
      const existingProductIndex = state.products.findIndex(
        (existingProduct) =>
          existingProduct.name === product.name && JSON.stringify(existingProduct.toppings) === JSON.stringify(product.toppings)
      );

      if (existingProductIndex !== -1) {
        const updatedProducts = [...state.products];
        updatedProducts[existingProductIndex] = {
          ...updatedProducts[existingProductIndex],
          count: updatedProducts[existingProductIndex].count + 1,
        };
        return { products: updatedProducts };
      }

      return { products: [...state.products, { ...product, count: 1 }] };
    }),
  increaseProductCount: (product) =>
    set((state) => {
      const updatedProducts = state.products.map((existingProduct) =>
        existingProduct.name === product.name && JSON.stringify(existingProduct.toppings) === JSON.stringify(product.toppings)
          ? { ...existingProduct, count: existingProduct.count + 1 }
          : existingProduct
      );
      return { products: updatedProducts };
    }),
  decreaseProductCount: (product) =>
    set((state) => {
      const updatedProducts = state.products.map((existingProduct) =>
        existingProduct.name === product.name &&
        product.count > 1 &&
        JSON.stringify(existingProduct.toppings) === JSON.stringify(product.toppings)
          ? { ...existingProduct, count: existingProduct.count - 1 }
          : existingProduct
      );
      return { products: updatedProducts };
    }),
  deleteProduct: (product) =>
    set((state) => {
      const updatedProducts = state.products.filter(
        (existingProduct) =>
          existingProduct.name !== product.name || JSON.stringify(existingProduct.toppings) !== JSON.stringify(product.toppings)
      );
      return { products: updatedProducts };
    }),
}));

useCartStore.subscribe((state) => {
  const products = state.products;
  const totalPrice = calculateTotalPrice(products);

  if (state.totalPrice !== totalPrice) {
    useCartStore.setState({ totalPrice });
  }
});

const calculateTotalPrice = (products: ExtendedProduct[]): number => {
  let totalPrice = 0;

  products.forEach((product) => {
    totalPrice += product.priceWithToppings * product.count;
  });

  return totalPrice;
};

export default useCartStore;
