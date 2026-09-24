"use client";
import ClientCatchError from "@/lib/client-catch-error";
import Fetcher from "@/lib/Fetcher";
import {
  Avatar,
  message,
  Result,
  Select,
  Skeleton,
  Table,
  Tooltip,
} from "antd";
import axios from "axios";
import moment from "moment";
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
        <div key={item.id} className="flex gap-2 items-center">
          <Avatar size="large" className="bg-orange-500! capitalize">
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
      title: "Product",
      key: "product",
      render: (item: any) => (
        <label className="capitalize">{item.product.title}</label>
      ),
    },
    {
      title: "Price",
      key: "price",
      render: (item: any) => <label>₹{item.product.price}</label>,
    },
    {
      title: "Discount",
      key: "discount",
      render: (item: any) => <label>{item.product.discount}%</label>,
    },
    {
      title: "Address",
      key: "address",
      render: (item: any) => {
        const address =
          item.user.address ||
          "42 Maplewood Avenue Greenfield Heights, West Bengal 713200 India";

        return (
          <Tooltip title={address}>
            <label className="block text-gray-500 max-w-50 truncate cursor-help">
              {address}
            </label>
          </Tooltip>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (item: any) => (
        <Select
          placeholder="status"
          style={{ width: 120 }}
          defaultValue={item.status}
          onChange={(value) => changeStatus(value, item._id)}
        >
          <Select.Option value="processing">Processing</Select.Option>
          <Select.Option value="dispatched">Dispatched</Select.Option>
          <Select.Option value="returned">Returned</Select.Option>
        </Select>
      ),
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
      <Table columns={columns} dataSource={data} rowKey={"_id"} />
    </div>
  );
};

export default Orders;
