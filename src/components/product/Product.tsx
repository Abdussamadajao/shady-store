import React from "react";
import ProductOption from "./ProductOption";
import { useFilteredProducts } from "@/store/products";

const Product: React.FC = () => {
  const filteredProducts = useFilteredProducts();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {filteredProducts.map((product) => (
        <ProductOption
          key={product.id}
          id={product.id}
          images={product.images}
          name={product.name}
          price={product.price}
          count={product.count}
        />
      ))}
    </div>
  );
};

export default Product;
