import React from "react";
import CategoryCard from "../components/ui/CategoryCard";
import { useAppSelector, useAppDispatch } from "../lib/hooks";

interface Props {
  filterProducts: any;
}

const Filter: React.FC<Props> = ({ filterProducts }) => {
  const data = useAppSelector((state) => state.storeSlice.store);
  const dispatch = useAppDispatch();

  return (
    <div>
      {data && (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 py-4 sm:py-6">
          {data.categories
            .slice(0, 5)
            .map((category: string, index: number) => (
              <CategoryCard
                key={index}
                onSelect={() => {
                  filterProducts(category);
                }}
                category={category}
                img={data.categories[index + 5]}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
