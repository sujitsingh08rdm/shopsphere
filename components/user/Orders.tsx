"use client";
import Fetcher from "@/lib/Fetcher";
import priceCalculate from "@/lib/price-calculate";
import { Card, Empty, Image, Result, Skeleton, Tag } from "antd";
import moment from "moment";
import useSWR from "swr";

// const data = [
//   {
//     orderId: "ORD1001",
//     userId: "USR001",
//     product: {
//       productId: "P001",
//       productName: "Wireless Mouse",
//       quantity: 2,
//       price: 29.99,
//     },
//     totalAmount: 59.98,
//     status: "pending",
//     createdAt: "2025-06-05T10:00:00Z",
//   },
//   {
//     orderId: "ORD1002",
//     userId: "USR002",
//     product: {
//       productId: "P003",
//       productName: "Bluetooth Headphones",
//       quantity: 1,
//       price: 59.99,
//     },
//     totalAmount: 59.99,
//     status: "success",
//     createdAt: "2025-06-04T12:45:00Z",
//   },
//   {
//     orderId: "ORD1003",
//     userId: "USR003",
//     product: {
//       productId: "P002",
//       productName: "USB-C Charger",
//       quantity: 3,
//       price: 29.99,
//     },
//     totalAmount: 89.97,
//     status: "error",
//     createdAt: "2025-06-03T14:30:00Z",
//   },
//   {
//     orderId: "ORD1004",
//     userId: "USR004",
//     product: {
//       productId: "P004",
//       productName: "Laptop Stand",
//       quantity: 1,
//       price: 49.99,
//     },
//     totalAmount: 49.99,
//     status: "warning",
//     createdAt: "2025-06-02T16:00:00Z",
//   },
// ];

const Orders = () => {
  const { data, isLoading, error } = useSWR("/api/order", Fetcher);

  const getStatusColor = (status: string) => {
    if (status === "processing") {
      return "cyan";
    }
    if (status === "dispatched") {
      return "geekblue";
    }
    if (status === "returned") {
      return "volcano";
    }
  };

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={error.message} />;
  }

  if (!data) {
    return <Empty />;
  }

  return (
    <div className="flex flex-col gap-8">
      {data.map((item: any, index: number) => (
        <Card
          key={index}
          title={item.orderId}
          extra={
            <label className="text-gray-400">
              {moment(item.createdAt).format("MMM DD, YYYY hh:mm A")}
            </label>
          }
        >
          <div className="flex flex-col gap-4">
            {item.products.map((product: any, pIndex: number) => (
              <Card key={pIndex} hoverable>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <Image
                      src={product.image}
                      width={100}
                      height={90}
                      alt={product.title}
                    />
                    <div>
                      <h2 className="text-lg font-medium capitalize">
                        {product.title}
                      </h2>
                      <div className="space-x-3 mb-2">
                        <label className="font-medium text-base">
                          ₹
                          {priceCalculate(
                            item.prices[pIndex],
                            item.discounts[pIndex],
                          )}
                        </label>
                        <del className="text-gray-500">
                          ₹{item.prices[pIndex]}
                        </del>
                        <label className="text-gray-500">
                          ({item.discounts[pIndex]}% Off)
                        </label>
                      </div>
                      <Tag color={getStatusColor(item.status)}>
                        {item.status.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
