"use client";
import Fetcher from "@/lib/Fetcher";
import { Card, Result, Skeleton } from "antd";
import moment from "moment";
import Image from "next/image";
import useSWR from "swr";

const Users = () => {
  const { data, isLoading, error } = useSWR("/api/user", Fetcher);

  if (isLoading) {
    return <Skeleton active className="col-span-4" />;
  }

  if (error) {
    return <Result status="error" title={error.message} />;
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
              title={<label className="capitalize">{item.fullname}</label>}
              description={item.email}
            />
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
