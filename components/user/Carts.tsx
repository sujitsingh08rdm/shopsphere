"use client";

import ClientCatchError from "@/lib/client-catch-error";
import Fetcher from "@/lib/Fetcher";
import priceCalculate from "@/lib/price-calculate";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Result, Skeleton, Space } from "antd";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import useSWR, { mutate } from "swr";

import Pay from "../shared/Pay";
import { useRouter } from "next/navigation";

const Carts = () => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR("/api/cart", Fetcher);
  const [loading, setLoading] = useState({
    state: false,
    index: null,
    buttonIndex: null,
  });

  const getTotalAmount = () => {
    let sum = 0;
    for (let item of data) {
      const amount =
        priceCalculate(item.product.price, item.product.discount) *
        item.quantity;
      sum += amount;
    }

    return sum;
  };

  const removeCart = async (id: string, index: any, buttonIndex: any) => {
    try {
      setLoading({ state: true, index, buttonIndex });
      await axios.delete(`/api/cart/${id}`);
      mutate("/api/cart");
    } catch (error) {
      ClientCatchError(error);
    } finally {
      setLoading({ state: false, index: null, buttonIndex: null });
    }
  };

  const updateQuantity = async (
    qtn: number,
    id: string,
    index: any,
    buttonIndex: any,
  ) => {
    try {
      setLoading({ state: true, index, buttonIndex });
      await axios.put(`/api/cart/${id}`, { quantity: qtn });
      mutate("/api/cart");
    } catch (error) {
      ClientCatchError(error);
    } finally {
      setLoading({ state: false, index: null, buttonIndex: null });
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={error.message} />;
  }

  if (data.length === 0) {
    return <Empty />;
  }

  return (
    <div className="flex flex-col gap-8">
      {data.map((item: any, index: number) => (
        <Card key={index} hoverable>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Image
                src={item.product.image}
                width={150}
                height={90}
                alt={item.product.title}
              />
              <div>
                <h2 className="text-lg font-medium capitalize">
                  {item.product.title}
                </h2>
                <div className="space-x-3">
                  <label className="font-medium text-base">
                    ₹{priceCalculate(item.product.price, item.product.discount)}
                  </label>
                  <del className="text-gray-500">₹{item.product.price}</del>
                  <label className="text-gray-500">
                    ({item.product.discount}% Off)
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Space.Compact block>
                <Button
                  loading={
                    loading.state &&
                    loading.index === index &&
                    loading.buttonIndex === 0
                  }
                  icon={<MinusOutlined />}
                  size="large"
                  onClick={() =>
                    updateQuantity(item.quantity - 1, item._id, index, 0)
                  }
                />
                <Button size="large">{item.quantity}</Button>
                <Button
                  loading={
                    loading.state &&
                    loading.index === index &&
                    loading.buttonIndex === 1
                  }
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() =>
                    updateQuantity(item.quantity + 1, item._id, index, 1)
                  }
                />
              </Space.Compact>
              <Button
                loading={
                  loading.state &&
                  loading.index === index &&
                  loading.buttonIndex === 2
                }
                icon={<DeleteOutlined />}
                type="primary"
                danger
                size="large"
                onClick={() => removeCart(item._id, index, 2)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex gap-4 justify-end items-center">
        <h2 className="text-2xl font-semibold">
          Total Payble amount : ₹{getTotalAmount().toLocaleString()}
        </h2>
        <div>
          <Pay product={data} onSuccess={() => router.push("/user/orders")} />
        </div>
      </div>
    </div>
  );
};

export default Carts;
