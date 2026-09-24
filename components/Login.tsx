"use client";

import { Button, Card, Divider, Form, Input } from "antd";
import Image from "next/image";
import Logo from "./shared/Logo";
import { GoogleOutlined, UserAddOutlined } from "@ant-design/icons";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import ClientCatchError from "@/lib/client-catch-error";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const login = async (value: any) => {
    try {
      const payload = { ...value, redirect: false };
      const res = await signIn("credentials", payload);
      const session = await getSession();

      if (!session) {
        throw new Error("Failed to login user");
      }
      if (session.user.role === "user") {
        return router.replace("/user/orders");
      }
      if (session.user.role === "admin") {
        return router.replace("/admin/orders");
      }
    } catch (error) {
      ClientCatchError(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const payload = {
        redirect: true,
        callbackUrl: "/",
        prompt: "select_account",
      };

      const res = await signIn("google", payload);
      console.log(res);
    } catch (error) {
      ClientCatchError(error);
    }
  };

  return (
    <div className="bg-gray-100 h-screen grid grid-cols-2 animate__animated animate__fadeIn overflow-hidden">
      <div className="relative">
        <Image
          src="/images/signup.jpg"
          fill
          alt="signup"
          className="object-cover"
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="flex items-center justify-center">
        <Card className="w-120 animate__animated animate__slideInRight">
          <div className="space-y-6">
            <div>
              <Logo />
            </div>

            <Form layout="vertical" onFinish={login}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: "email" }]}
              >
                <Input size="large" placeholder="Enter Email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password size="large" placeholder="Enter Password" />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  size="large"
                  type="primary"
                  icon={<UserAddOutlined />}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <Divider />
            <Button
              icon={<GoogleOutlined className="text-blue-500!" />}
              size="large"
              className="w-full!"
              onClick={signInWithGoogle}
            >
              Sign In With Google
            </Button>
            <div className="flex gap-2">
              <p className="text-gray-500">Dont Have an account ?</p>
              <Link href="/signup">Sign Up</Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
