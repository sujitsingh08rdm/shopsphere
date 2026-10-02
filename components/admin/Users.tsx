"use client";
import ClientCatchError from "@/lib/client-catch-error";
import Fetcher from "@/lib/Fetcher";
import { Card, Empty, message, Result, Select, Skeleton } from "antd";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import useSWR, { mutate } from "swr";

const Users = () => {
  const { data, isLoading, error } = useSWR("/api/user", Fetcher);

  const changeRole = async (role: string, userId: string) => {
    try {
      await axios.put(`/api/user/role/${userId}`, { role });
      mutate("/api/user");
      message.success("Role updated , Thank You!");
    } catch (error) {
      ClientCatchError(error);
    }
  };

  if (isLoading) {
    return <Skeleton active className="col-span-4" />;
  }

  if (error) {
    return <Result status="error" title={error.message} />;
  }

  if (data.length === 0) {
    return <Empty />;
  }
  
  return (
    <div className="grid grid-cols-4 gap-8">
      {data.map((item: any, index: number) => (
        <Card key={index} hoverable>
          <div className="flex flex-col items-center gap-6">
            <Image
              src={item.image || "/images/avt.jpg"}
              width={100}
              height={100}
              alt={`avt-${index}`}
              className="rounded-full"
              objectFit="cover"
            />
            <Card.Meta
              className="text-center"
              title={<label className="capitalize">{item.fullname}</label>}
              description={item.email}
            />
            <Select
              defaultValue={item.role}
              className="w-full! text-center! "
              size="large"
              onChange={(role: string) => changeRole(role, item._id)}
            >
              <Select.Option value="user">User</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
            </Select>
            <label className="font-medium">
              {moment(item.createdAt).format("MMM DD, YYYY")}
            </label>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Users;
