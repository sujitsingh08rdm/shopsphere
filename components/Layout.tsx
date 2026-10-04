"use client";
import ChildrenInterface from "@/interface/children.interface";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { FC } from "react";
import Logo from "./shared/Logo";
import Link from "next/link";
import {
  LogoutOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Skeleton, Tooltip } from "antd";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import Fetcher from "@/lib/Fetcher";

const menus = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
];

const Layout: FC<ChildrenInterface> = ({ children }) => {
  const pathname = usePathname();
  const session = useSession();
  const { data, isLoading } = useSWR(
    session?.data?.user.role === "user" ? "/api/cart?count=true" : null,
    Fetcher,
  );

  const handleLogout = () => {
    signOut();
  };

  const userMenu = {
    items: [
      {
        icon: <UserOutlined />,
        label: (
          <Link className="capitalize" href={"/user/orders"}>
            {session.data?.user.name}
          </Link>
        ),
        key: "Fullname",
      },
      {
        icon: <SettingOutlined />,
        label: <Link href="/user/settings">Settings</Link>,
        key: "Settings",
      },
      {
        icon: <LogoutOutlined />,
        label: <a onClick={handleLogout}>Logout</a>,
        key: "Logout",
      },
    ],
  };

  const adminMenu = {
    items: [
      {
        icon: <UserOutlined />,
        label: (
          <Link className="capitalize" href={"/admin/orders"}>
            {session.data?.user.name}
          </Link>
        ),
        key: "Fullname",
      },
      {
        icon: <SettingOutlined />,
        label: <Link href="/admin/settings">Settings</Link>,
        key: "Settings",
      },
      {
        icon: <LogoutOutlined />,
        label: <a onClick={handleLogout}>Logout</a>,
        key: "Logout",
      },
    ],
  };

  const getMenu = (role: string) => {
    if (role === "user") {
      return userMenu;
    }
    if (role === "admin") {
      return adminMenu;
    }

    // signOut();
  };

  const blacklist = ["/admin", "/login", "/signup", "/user", "/auth-failed"];
  const isBlacklist = blacklist.some((path) => pathname.startsWith(path));

  if (isBlacklist) {
    return (
      <AntdRegistry>
        <div>{children}</div>
      </AntdRegistry>
    );
  }

  if (isLoading) {
    return (
      <AntdRegistry>
        <Skeleton active />
      </AntdRegistry>
    );
  }

  return (
    <AntdRegistry>
      <nav className="bg-white sticky top-0 left-0 px-12 shadow-lg flex justify-between items-center z-10">
        <Logo />
        <div className="flex items-center">
          {menus.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-black py-6 px-12 hover:text-white hover:bg-indigo-500"
            >
              {item.label}
            </Link>
          ))}
          {!session.data && (
            <div className="space-x-2 animate__animated animate__fadeIn">
              <Link href="/login">
                <Button
                  size="large"
                  className="text-black py-6 px-12 hover:text-white hover:bg-indigo-500"
                  icon={<UserAddOutlined />}
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="large"
                  type="primary"
                  className="bg-rose-500!"
                  icon={<UserAddOutlined />}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        {session.data && (
          <div className="flex items-center gap-8 animate__animated animate__fadeIn">
            {session.data.user.role === "user" && (
              <Tooltip title="Your Carts">
                <Link href="/user/carts">
                  <Badge count={data && data.count}>
                    <ShoppingCartOutlined className="text-3xl text-slate-400!" />
                  </Badge>
                </Link>
              </Tooltip>
            )}
            <Dropdown menu={getMenu(session.data.user.role)}>
              <Avatar size="large" src="/images/avt.jpg" />
            </Dropdown>
          </div>
        )}
      </nav>
      <div className="w-9/12 mx-auto py-24">{children}</div>
      <footer className="bg-zinc-900 h-112.5 flex items-center justify-center text-white text-4xl">
        Ye bhi thik h
      </footer>
    </AntdRegistry>
  );
};

export default Layout;
