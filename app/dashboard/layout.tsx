import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";

type Props = {
  children: React.ReactNode;
};

const layout = (props: Props) => {
  return (
    <div className="sm:flex min-h-screen">
      <Sidebar />
      {props.children}
    </div>
  );
};

export default layout;
