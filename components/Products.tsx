"use client";

import DataInterface from "@/interface/data.interface";
import ClientCatchError from "@/lib/client-catch-error";
import priceCalculate from "@/lib/price-calculate";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, message, Tag } from "antd";
import axios from "axios";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { mutate } from "swr";

const Products: FC<DataInterface> = ({ data }) => {
  const [isBrowser, setIsBrowser] = useState(false);
  const router = useRouter();

  const addToCart = async (id: string) => {
    try {
      const session = await getSession();
      if (!session) {
        return router.push("/login");
      }
      await axios.post("/api/cart", { product: id });
      message.success("Product Added to Cart");
      mutate("/api/cart?count=true");
    } catch (error) {
      ClientCatchError(
        error,
        "You're an Admin, Please switch to User For Buying Product",
      );
    }
  };

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) return null;

  return (
    <div className="grid grid-cols-4 gap-10">
      {data.data.map((item: any, index: number) => (
        <Card
          key={index}
          hoverable
          cover={
            <div className="relative w-full h-45">
              {
                <Image
                  src={item.image || "/images/customer.jpg"}
                  fill
                  alt={item.title}
                  className="rounded-t-lg object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="eager"
                />
              }
            </div>
          }
        >
          <Card.Meta
            title={
              <Link
                href={`/products/${item.title.toLowerCase().split(" ").join("-")}`}
                className="text-inherit! hover:underline!"
              >
                {item.title}
              </Link>
            }
            description={
              <div className="flex gap-2">
                <label>₹{priceCalculate(item.price, item.discount)}</label>
                <del>₹{item.price}</del>
                <label>({item.discount})</label>
              </div>
            }
          />
          <div className="mt-4 space-y-2">
            <Button
              key="cart"
              icon={<ShoppingCartOutlined />}
              type="primary"
              className="w-full!"
              onClick={() => addToCart(item._id)}
            >
              Add To Cart
            </Button>
            <Link
              href={`/products/${item.title.toLowerCase().split(" ").join("-")}`}
            >
              <Button className="w-full!" key="buy" type="primary" danger>
                Buy Now
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Products;
