"use client";

import React, { FC } from "react";
import {
  CreditCardOutlined,
  LogoutOutlined,
  ProfileOutlined,
  ReconciliationOutlined,
  SettingOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Dropdown,
  Layout,
  Menu,
  theme,
} from "antd";
import Link from "next/link";
import ChildrenInterface from "@/interface/children.interface";
import Logo from "../shared/Logo";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const { Header, Content, Sider } = Layout;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const AdminLayout: FC<ChildrenInterface> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const logout = async () => {
    signOut();
  };

  const pathname = usePathname();

  const menus = [
    {
      icon: <ShoppingOutlined />,
      label: <Link href="/admin/products">Products</Link>,
      key: "products",
    },

    {
      icon: <ReconciliationOutlined />,
      label: <Link href="/admin/orders">Orders</Link>,
      key: "orders",
    },
    {
      icon: <CreditCardOutlined />,
      label: <Link href="/admin/payments">Payments</Link>,
      key: "payments",
    },
    {
      icon: <UserOutlined />,
      label: <Link href="/admin/users">Users</Link>,
      key: "users",
    },
  ];

  const accountMenu = {
    items: [
      { icon: <ProfileOutlined />, label: "Sujit", key: "Fullname" },
      { icon: <SettingOutlined />, label: "Settings", key: "Settings" },
      {
        icon: <LogoutOutlined />,
        label: <a onClick={logout}>Logout</a>,
        key: "Logout",
      },
    ],
  };

  const getBreadCrumbs = (pathname: string) => {
    const arr = pathname.split("/");
    const breadcrumb = arr.map((item) => ({ title: item }));
    return breadcrumb;
  };

  return (
    <Layout hasSider>
      <Sider style={siderStyle} width={260}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" items={menus} />
      </Sider>
      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex items-center"
        >
          <div className="px-4 w-full flex justify-between items-center">
            <Logo />
            <div>
              <Dropdown menu={accountMenu}>
                <Avatar size="large" src="/images/avt.jpg" />
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          style={{ margin: "24px 16px 0", overflow: "initial" }}
          className="px-8 flex flex-col gap-8"
        >
          <Breadcrumb items={getBreadCrumbs(pathname)} />
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
