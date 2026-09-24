"use client";
import Fetcher from "@/lib/Fetcher";
import { Avatar, Result, Select, Skeleton, Table, Tag, Tooltip } from "antd";
import moment from "moment";
import useSWR from "swr";

const data = [
  {
    orderId: "ORD1001",
    userId: "USR001",
    product: {
      productId: "P001",
      productName: "Wireless Mouse",
      quantity: 2,
      price: 29.99,
    },
    totalAmount: 59.98,
    status: "pending",
    createdAt: "2025-06-05T10:00:00Z",
  },
  {
    orderId: "ORD1002",
    userId: "USR002",
    product: {
      productId: "P003",
      productName: "Bluetooth Headphones",
      quantity: 1,
      price: 59.99,
    },
    totalAmount: 59.99,
    status: "success",
    createdAt: "2025-06-04T12:45:00Z",
  },
  {
    orderId: "ORD1003",
    userId: "USR003",
    product: {
      productId: "P002",
      productName: "USB-C Charger",
      quantity: 3,
      price: 29.99,
    },
    totalAmount: 89.97,
    status: "error",
    createdAt: "2025-06-03T14:30:00Z",
  },
  {
    orderId: "ORD1004",
    userId: "USR004",
    product: {
      productId: "P004",
      productName: "Laptop Stand",
      quantity: 1,
      price: 49.99,
    },
    totalAmount: 49.99,
    status: "warning",
    createdAt: "2025-06-02T16:00:00Z",
  },
];

const Payments = () => {
  const { data, error, isLoading } = useSWR("/api/payment", Fetcher);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={error.message} />;
  }

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (item: any) => (
        <div className="flex gap-2 items-center">
          <Avatar size="large" className="bg-orange-500!">
            M
          </Avatar>
          <div className="flex flex-col">
            <h2 className="font-medium capitalize">{item.user.fullname}</h2>
            <label className="text-gray-500">{item.user.email}</label>
          </div>
        </div>
      ),
    },
    {
      title: "Product",
      key: "product",
      render: (item: any) => (
        <label className="capitalize">{item.order.product.title}</label>
      ),
    },
    {
      title: "Payment ID",
      key: "payment",
      render: (item: any) => (
        <label className="capitalize">{item.paymentId}</label>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      render: (item: any) => <label>₹{item.order.product.price}</label>,
    },
    {
      title: "Vendor",
      key: "vendor",
      render: (item: any) => <Tag className="capitalize">{item.vendor}</Tag>,
    },
    {
      title: "Date",
      key: "date",
      render: (item: any) => (
        <label>{moment(item.createdAt).format("MMM DD, YYYY | hh:mm A")}</label>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <Skeleton active />
      <Table columns={columns} dataSource={data} rowKey={"_id"} />
    </div>
  );
};

export default Payments;
