"use client";
import ClientCatchError from "@/lib/client-catch-error";
import Fetcher from "@/lib/Fetcher";
import {
  ArrowRightOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  SaveOutlined,
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
  message,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Result,
  Skeleton,
  Tag,
  Upload,
} from "antd";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { debounce } from "lodash";

const Products = () => {
  const [productForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [limit, setLimit] = useState(16);
  const { data, isLoading, error } = useSWR(
    `/api/product?page=${page}&limit=${limit}`,
    Fetcher,
  );
  const [products, setProducts] = useState({ data: [], total: 0 });

  const onSearch = debounce(async (e: any) => {
    try {
      const value = e.target.value.trim();
      const { data } = await axios.get(`/api/product?search=${value}`);
      setProducts(data);
    } catch (error) {
      ClientCatchError(error);
    }
  }, 2000);

  const handleClose = () => {
    setOpen(false);
    productForm.resetFields();
    setEditId(null);
  };

  const createProduct = async (values: any) => {
    try {
      values.image = values.image.file.originFileObj;
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      await axios.post("/api/product", formData);
      message.success("Product Added Successfully");
      handleClose();
    } catch (error) {
      ClientCatchError(error);
    }
  };

  const onPaginate = (page: number, limit: number) => {
    setPage(page);
    setLimit(limit);
  };

  const editProduct = (item: any) => {
    setEditId(item._id);
    setOpen(true);
    productForm.setFieldsValue(item);
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`/api/product/${id}`);
      mutate(`/api/product?page=${page}&limit=${limit}`);
    } catch (error) {
      ClientCatchError(error);
    }
  };

  const saveProduct = async (values: any) => {
    if (typeof values.image === "object") {
      values.image = values.image.file.originFileObj;
    }
    await axios.put(`/api/product/${editId}`, values);
    handleClose();
    mutate(`/api/product?page=${page}&limit=${limit}`);
  };

  const changeImage = (id: string) => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.click();

      input.onchange = async () => {
        if (!input.files) {
          return message.error("File not selected");
        }
        const file = input.files[0];
        input.remove();
        const formData = new FormData();
        formData.append("id", id);
        formData.append("image", file);

        await axios.put("/api/product/change-image", formData);
        mutate(`/api/product?page=${page}&limit=${limit}`);
      };
    } catch (error) {
      ClientCatchError(error);
    }
  };

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  if (isLoading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Result status="error" title={error.message} />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center ">
        {/* <Form onFinish={onSearch}> */}
        {/* <Form.Item name="search" rules={[{ required: true }]} className="mb-0!"> */}
        <Input
          placeholder="Search this site.."
          size="large"
          suffix={
            <Button htmlType="submit" type="text" icon={<SearchOutlined />} />
          }
          className="w-100!"
          onChange={onSearch}
        />
        {/* </Form.Item> */}
        {/* </Form> */}
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
        {products.data.map((item: any, index: number) => (
          <Card
            key={index}
            hoverable
            cover={
              <div className="relative w-full h-45">
                {
                  <Popconfirm
                    title="Do You want to Change Image?"
                    onConfirm={() => changeImage(item._id)}
                  >
                    <Image
                      src={item.image || "/images/customer.jpg"}
                      layout="fill"
                      alt={`product-${index}`}
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                  </Popconfirm>
                }
              </div>
            }
            actions={[
              <EditOutlined
                key="edit"
                className="text-green-400!"
                onClick={() => editProduct(item)}
              />,
              <Popconfirm
                title="Do You Want To Delete Product?"
                onConfirm={() => deleteProduct(item._id)}
              >
                <DeleteOutlined key="delete" className="text-rose-400!" />
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              title={item.title}
              description={
                <div className="flex gap-2">
                  <label>₹{item.price}</label>
                  <del>₹{item.price}</del>
                  <label>({item.discount})</label>
                </div>
              }
            />
            <Tag className="mt-4!" color="cyan">
              {item.quantity} PCS
            </Tag>
          </Card>
        ))}
      </div>
      <div className="flex justify-end w-full">
        <Pagination
          total={products.total}
          onChange={onPaginate}
          current={page}
          pageSizeOptions={[16, 32, 64, 100]}
          defaultPageSize={limit}
        />
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
        <Form
          layout="vertical"
          onFinish={editId ? saveProduct : createProduct}
          form={productForm}
        >
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

          {!editId && (
            <Form.Item name="image" rules={[{ required: true }]}>
              <Upload fileList={[]}>
                <Button size="large" icon={<UploadOutlined />}>
                  Upload Image
                </Button>
              </Upload>
            </Form.Item>
          )}

          <Form.Item>
            {editId ? (
              <Button
                htmlType="submit"
                size="large"
                type="primary"
                icon={<SaveOutlined />}
              >
                Save Changes
              </Button>
            ) : (
              <Button
                htmlType="submit"
                size="large"
                type="primary"
                icon={<ArrowRightOutlined />}
              >
                Add Now
              </Button>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
