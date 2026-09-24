"use client";
import ChildrenInterface from "@/interface/children.interface";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { FC } from "react";
import Logo from "./shared/Logo";
import Link from "next/link";
import {
  LogoutOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Dropdown } from "antd";
import { usePathname } from "next/navigation";

const menus = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Carts",
    href: "/carts",
  },
  {
    label: "Sign In",
    href: "/login",
  },
];

const Layout: FC<ChildrenInterface> = ({ children }) => {
  const pathname = usePathname();
  // const session = useSession();

  // console.log(session);

  const accountMenu = {
    items: [
      { icon: <ProfileOutlined />, label: "Sujit", key: "Fullname" },
      { icon: <SettingOutlined />, label: "Settings", key: "Settings" },
      { icon: <LogoutOutlined />, label: "Logout", key: "Logout" },
    ],
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
        </div>
        <Link href="/signup">
          <Button
            size="large"
            type="primary"
            className="bg-indigo-500!"
            icon={<UserAddOutlined />}
          >
            Sign Up
          </Button>
        </Link>
        <Dropdown menu={accountMenu}>
          <Avatar size="large" src="/images/avt.jpg" />
        </Dropdown>
      </nav>
      <div className="w-9/12 mx-auto py-24">{children}</div>
      <footer className="bg-zinc-900 h-112.5 flex items-center justify-center text-white text-4xl">
        Ye bhi thik h
      </footer>
    </AntdRegistry>
  );
};

export default Layout;
