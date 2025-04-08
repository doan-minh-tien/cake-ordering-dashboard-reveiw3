import { ReactNode } from "react";

const NotificationsLayout = ({ children }: { children: ReactNode }) => {
  return <div className="overflow-auto flex-grow">{children}</div>;
};

export default NotificationsLayout;
