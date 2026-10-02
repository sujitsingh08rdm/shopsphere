"use client";

import ClientCatchError from "@/lib/client-catch-error";
import { SaveOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, InputNumber, message } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Settings = () => {
  const [userForm] = Form.useForm();
  const session = useSession();

  useEffect(() => {
    const sessionMessage = sessionStorage.getItem("message");
    if (sessionMessage) {
      message.info(sessionMessage);
      sessionStorage.removeItem("message");
    }
  }, []);

  useEffect(() => {
    if (session.data) {
      const user = session.data.user;
      userForm.setFieldsValue({ fullname: user.name, ...user.address });
    }
  }, [session]);

  const saveChanges = async (values: any) => {
    try {
      const payload = {
        fullname: values.fullname,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          country: values.country,
          pincode: values.pincode,
        },
      };
      await axios.put("/api/user/profile", payload);
      await session.update();
      message.success("Profile Info Saved");
    } catch (error) {
      ClientCatchError(error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-medium">Profile Information</h2>
      <Divider />
      <div>
        <Form layout="vertical" form={userForm} onFinish={saveChanges}>
          <div className="grid grid-cols-3 gap-8">
            <Form.Item
              name="fullname"
              label="Fullname"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="street"
              label="Street"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[{ required: true }]}
            >
              <InputNumber className="w-full!" size="large" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button
              htmlType="submit"
              size="large"
              type="primary"
              icon={<SaveOutlined />}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
