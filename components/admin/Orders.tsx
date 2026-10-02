"use client";

import ClientCatchError from "@/lib/client-catch-error";
import Fetcher from "@/lib/Fetcher";
import priceCalculate from "@/lib/price-calculate";
import {
  Avatar,
  Card,
  Empty,
  message,
  Result,
  Select,
  Skeleton,
  Table,
  Tag,
  Tooltip,
} from "antd";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import useSWR, { mutate } from "swr";

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
  const { data, error, isLoading } = useSWR("/api/order", Fetcher);

  const changeStatus = async (value: string, id: string) => {
    try {
      await axios.put(`/api/order/${id}`, { status: value });
      message.success("Product Status Updated, Thank You!");
      mutate("/api/order");
    } catch (error) {
      ClientCatchError(error);
    }
  };

  const getTotalSales = (item: any) => {
    let sum = 0;

    for (let i = 0; i < item.prices.length; i++) {
      const price = item.prices[i];
      const discount = item.discounts[i];
      const quantity = item.quantities[i];
      const total = priceCalculate(price, discount) * quantity;
      sum += total;
    }

    return <label>₹ {Math.round(sum)}</label>;
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

  const columns = [
    {
      title: "Order ID",
      key: "orderId",
      dataIndex: "orderId",
    },
    {
      title: "Customer",
      key: "customer",
      render: (item: any) => (
        <div className="flex gap-2 items-center">
          <Avatar size={"large"}>{item.user.fullname[0].toUpperCase()}</Avatar>
          <div className="flex flex-col">
            <h2 className="font-medium capitalize">{item.user.fullname}</h2>
            <label className="text-xs text-gray-500">{item.user.email}</label>
          </div>
        </div>
      ),
    },
    {
      title: "Total Sales",
      key: "total-sales",
      render: getTotalSales,
    },
    {
      title: "Total Products",
      key: "total-products",
      render: (item: any) => item.products.length,
    },
    {
      title: "Address",
      key: "address",
      render: (item: any) => {
        const address = item.user.address;

        const fullAddress = address.pincode
          ? `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.pincode}`
          : "";

        return (
          <div className="capitalize">
            {address.pincode ? (
              <Tooltip title={fullAddress}>
                <span>
                  {fullAddress.length > 20
                    ? `${fullAddress.slice(0, 20)}...`
                    : fullAddress}
                </span>
              </Tooltip>
            ) : (
              "Not found"
            )}
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (item: any) => (
        <Select
          style={{ width: 150 }}
          defaultValue={item.status}
          onChange={(status) => changeStatus(status, item._id)}
        >
          <Select.Option value="processing">Processing</Select.Option>
          <Select.Option value="dispatched">Dispatched</Select.Option>
          <Select.Option value="returned">Returned</Select.Option>
        </Select>
      ),
    },
    {
      title: "Created",
      key: "created",
      render: (item: any) =>
        moment(item.createdAt).format("MMM DD, YYYY hh:mm A"),
    },
  ];

  const browserProducts = (item: any) => {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {item.products.map((product: any, pIndex: number) => (
          <Card key={product._id} hoverable>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="rounded-xl object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold">
                    Price: ₹
                    {priceCalculate(
                      item.prices[pIndex],
                      item.discounts[pIndex],
                    )}
                  </span>
                  <span>
                    Original Price: <del>₹{item.prices[pIndex]}</del>
                  </span>
                  <span>
                    {" "}
                    <Tag color="green">{item.discounts[pIndex]}% OFF</Tag>
                  </span>
                </div>
              </div>
              {/* Price + Discount */}
              <div className="flex items-center justify-between">
                {/* Product Name */}
                <div>
                  <h3 className="text-xl font-bold capitalize">
                    {product.title}
                  </h3>
                  {/* Quantity */}
                  <div className="text-sm text-gray-500">
                    Quantity:{" "}
                    <span className="font-medium">
                      {item.quantities[pIndex]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={"_id"}
        expandable={{
          expandedRowRender: browserProducts,
          rowExpandable: (record: any) => record.name !== "Not Expandable",
        }}
      />
    </div>
  );
};

export default Orders;
