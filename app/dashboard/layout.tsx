import React from "react";
import Sidebar from "./components/Sidebar/Sidebar";

type Props = {
  children: React.ReactNode;
};

const layout = (props: Props) => {
  return (
    <div className="w-screen h-screen flex">
      <Sidebar />
      {props.children}
    </div>
  );
};

export default layout;
