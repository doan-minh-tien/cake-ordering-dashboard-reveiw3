import { ReactNode } from "react";

const IngredientsLayout = ({ children }: { children: ReactNode }) => {
  return (
      <div className="overflow-auto flex-grow">{children}</div>
  );
};

export default IngredientsLayout;
