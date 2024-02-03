import React from "react";
import FoodItem from "./FoodItem/FoodItem";
import useProductsStore from "../../../stores/productsStore";
import "./foodDisplay.scss";
import { Skeleton } from "./Skeleton/Skeleton";

const FoodDisplay = () => {
  const { products, isLoading } = useProductsStore();

  return (
    <div className="foodDisplay">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} />)
        : products.map((product) => <FoodItem key={product.id} product={product} />)}
    </div>
  );
};

export default FoodDisplay;
