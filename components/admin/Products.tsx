"use client";
import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  InboxOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Skeleton,
  Tag,
  Upload,
} from "antd";
import Image from "next/image";
import { useState } from "react";

const Products = () => {
  const [open, setOpen] = useState(false);
  const onSearch = (values: any) => {
    console.log(values);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createProduct = (values: any) => {
    console.log(values);
  };

  return (
    <div className="flex flex-col gap-8">
      <Skeleton />
      <div className="flex justify-between items-center ">
        <Form onFinish={onSearch}>
          <Form.Item
            name="search"
            rules={[{ required: true }]}
            className="mb-0!"
          >
            <Input
              placeholder="Search this site.."
              size="large"
              suffix={
                <Button
                  htmlType="submit"
                  type="text"
                  icon={<SearchOutlined />}
                />
              }
              className="w-100!"
            />
          </Form.Item>
        </Form>
        <Button
          onClick={() => setOpen(true)}
          type="primary"
          size="large"
          icon={<FileAddOutlined />}
          className="bg-indigo-500! hover:bg-indigo-600!"
        >
          Add products
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {Array(20)
          .fill(0)
          .map((item, index) => (
            <Card
              key={index}
              hoverable
              cover={
                <div className="relative w-full h-45">
                  <Image
                    src="/images/customer.jpg"
                    layout="fill"
                    alt={`product-${index}`}
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              }
              actions={[
                <EditOutlined key="edit" className="text-green-400!" />,
                <DeleteOutlined key="delete" className="text-rose-400!" />,
              ]}
            >
              <Card.Meta
                title="blue-jeans"
                description={
                  <div className="flex gap-2">
                    <label>₹200</label>
                    <del>₹200</del>
                    <label>(50% Off)</label>
                  </div>
                }
              />
              <Tag className="mt-4!" color="cyan">
                20 PCS
              </Tag>
            </Card>
          ))}
      </div>
      <Modal
        open={open}
        footer={null}
        width={720}
        onCancel={handleClose}
        centered
        mask={{ closable: false }}
      >
        <h2 className="text-lg font-medium">Add A New Product</h2>
        <Divider />
        <Form layout="vertical" onFinish={createProduct}>
          <Form.Item
            label="Product Name"
            name="title"
            rules={[{ required: true }]}
          >
            <Input size="large" placeholder="Enter Product Name" />
          </Form.Item>
          <div className="grid grid-cols-3 gap-6">
            <Form.Item
              label="Prices"
              name="price"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber
                size="large"
                placeholder="00.00"
                className="w-full!"
              />
            </Form.Item>

            <Form.Item
              label="Discount"
              name="discount"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber size="large" placeholder="20" className="w-full!" />
            </Form.Item>

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, type: "number" }]}
            >
              <InputNumber size="large" placeholder="20" className="w-full!" />
            </Form.Item>
          </div>
          <Form.Item
            label="Description"
            rules={[{ required: true }]}
            name="description"
          >
            <Input.TextArea rows={4} placeholder="Description" />
          </Form.Item>

          <Form.Item name="image" rules={[{ required: true }]}>
            <Button size="large" icon={<UploadOutlined />}>
              Upload Image
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              size="large"
              type="primary"
              icon={<ArrowRightOutlined />}
            >
              Add Now
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
