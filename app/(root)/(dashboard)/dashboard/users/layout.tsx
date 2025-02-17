import { ReactNode } from "react";

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="bg-gray-100 dark:bg-muted/40 min-h-screen p-4 md:p-6 rounded-md min-w-full">
      <div className="overflow-auto flex-grow">{children}</div>
    </main>
  );
};

export default UserLayout;
