"use client";

import { Button, Card, Form, Input } from "antd";
import Image from "next/image";
import Logo from "./shared/Logo";
import { UserAddOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import ClientCatchError from "@/lib/client-catch-error";

const Signup = () => {
  const router = useRouter();

  const signup = async (value: any) => {
    try {
      await axios.post("/api/user/signup", value);
      router.push("/login");
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
        <Card className="w-[480px] animate__animated animate__slideInRight">
          <div className="space-y-6">
            <div>
              <Logo />
            </div>

            <Form layout="vertical" onFinish={signup}>
              <Form.Item
                name="fullname"
                label="Fullname"
                rules={[{ required: true }]}
              >
                <Input size="large" placeholder="Enter Fullname" />
              </Form.Item>

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
                  danger
                  icon={<UserAddOutlined />}
                >
                  Signup
                </Button>
              </Form.Item>
            </Form>
            <div className="flex gap-2">
              <p className="text-gray-500">Already Have an account ?</p>
              <Link href="/login">Sign In</Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
