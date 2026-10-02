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

  console.log(data);

  const columns = [
    {
      title: "Customer",
      key: "customer",

      render: (item: any) => (
        <div className="flex gap-2 items-center">
          <Avatar size="large" className="bg-gray-700! capitalize">
            {item.user.fullname[0]}
          </Avatar>
          <div className="flex flex-col">
            <h2 className="font-medium capitalize">{item.user.fullname}</h2>
            <label className="text-gray-500">{item.user.email}</label>
          </div>
        </div>
      ),
    },
    {
      title: "Order Id",
      key: "orderId",

      dataIndex: "orderId",
    },
    {
      title: "Payment Id",
      key: "paymentId",

      dataIndex: "paymentId",
    },
    {
      title: "Amount",
      key: "amount",

      render: (item: any) => {
        return <label>₹{item.amount.toLocaleString()}</label>;
      },
    },
    {
      title: "Fee",
      key: "fee",

      render: (item: any) => {
        return item.fee ? <label>₹{item.fee / 100}</label> : 0;
      },
    },
    {
      title: "Tax",
      key: "tax",

      render: (item: any) => {
        return item.tax ? <label>₹{item.tax / 100}</label> : 0;
      },
    },
    {
      title: "Date",
      key: "date",

      render: (item: any) => {
        return moment(item.createdAt).format("MMM DD, YYYY hh:mm A");
      },
    },
    {
      title: "Method",
      key: "method",

      render: (item: any) => {
        return (
          <Tag className="capitalize" color="cyan">
            {item.method}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      key: "status",

      render: (item: any) => {
        return (
          <>
            {item.status === "captured" ? (
              <Tag className="uppercase" color="geekblue">
                {item.status}
              </Tag>
            ) : (
              <Tag className="uppercase" color="zinc">
                {item.status}
              </Tag>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={"_id"}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Payments;
