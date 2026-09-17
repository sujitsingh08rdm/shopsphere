"use client";
import ChildrenInterface from "@/interface/children.interface";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { FC } from "react";

const Layout: FC<ChildrenInterface> = ({ children }) => {
  return (
    <AntdRegistry>
      <div>{children}</div>
    </AntdRegistry>
  );
};

export default Layout;
