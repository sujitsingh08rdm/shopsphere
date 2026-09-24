"use client";

import DataInterface from "@/interface/data.interface";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Button, Card, Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

const Products: FC<DataInterface> = ({ data }) => {
  const [isBrowser, setIsBrowser] = useState(false);

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
                <label>₹{item.price}</label>
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
