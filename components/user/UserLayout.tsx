"use client";

import ChildrenInterface from "@/interface/children.interface";
import {
  LogoutOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Card, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const UserLayout: FC<ChildrenInterface> = ({ children }) => {
  const pathname = usePathname();
  const logout = async () => {
    signOut();
  };

  const getBreadCrumbs = (pathname: string) => {
    const arr = pathname.split("/");
    const breadcrumb = arr.map((item) => ({ title: item }));
    return breadcrumb;
  };

  const menus = [
    {
      icon: <ShoppingOutlined />,
      label: <Link href="/user/carts">Carts</Link>,
      key: "cart",
    },
    {
      icon: <ReconciliationOutlined />,
      label: <Link href="/user/orders">Orders</Link>,
      key: "orders",
    },
    {
      icon: <SettingOutlined />,
      label: <Link href="/user/settings">Settings</Link>,
      key: "settings",
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider width={300} className="border-r border-r-gray-200">
        <Menu theme="light" mode="inline" items={menus} className="h-full!" />
        <div className="bg-gray-400 p-4 fixed bottom-0 left-0 w-75 flex items-center gap-2">
          <Avatar size="large" className="text-xl! font-medium">
            S
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-base font-medium">Sujit Prasad</h2>
            <p className="text-xs">example@gmail.com</p>
          </div>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </div>
      </Sider>
      <Layout>
        <Layout.Content>
          <div className="w-11/12 mx-auto py-8 min-h-screen">
            <Breadcrumb items={getBreadCrumbs(pathname)} />
            <Card className="mt-8!">{children}</Card>
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;
