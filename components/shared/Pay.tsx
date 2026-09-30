"use client";

import ClientCatchError from "@/lib/client-catch-error";
import priceCalculate from "@/lib/price-calculate";
import { Button, Empty, Modal, Result } from "antd";
import axios from "axios";

import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";

interface ModifiedRazorpayInterface extends RazorpayOrderOptions {
  notes: any;
}

interface ProductInterface {
  _id: string;
  image: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  quantity: number;
}

interface PayInterface {
  theme?: "red" | "blue";
  title?: string;
  product: any;
  onSuccess?: (payload: PaymentSuccessInterface) => void;
  onFailed?: (payload: PaymentFailedInterface) => void;
}

interface PaymentSuccessInterface {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PaymentFailedInterface {
  reason: string;
  order_id: string;
  payment_id: string;
}

const Pay: FC<PayInterface> = ({
  product,
  onSuccess,
  onFailed,
  title = "Pay Now",
  theme = "blue",
}) => {
  const [open, setOpen] = useState(false);
  const isArr = Array.isArray(product);
  const router = useRouter();
  const session = useSession();
  const { Razorpay } = useRazorpay();

  const getTotalAmount = () => {
    let sum = 0;
    for (let item of product) {
      const amount =
        priceCalculate(item.product.price, item.product.discount) *
        item.quantity;
      sum += amount;
    }

    return sum;
  };

  const getOrderPayload = () => {
    const products = [];
    const prices = [];
    const discounts = [];

    if (!isArr) {
      return {
        products: [product._id],
        prices: [product.price],
        discounts: [product.discount],
      };
    }

    for (let item of product) {
      products.push(item.product._id);
      prices.push(item.product.price);
      discounts.push(item.product.discount);
    }

    return {
      products,
      prices,
      discounts,
    };
  };

  const handleSuccess = (payload: PaymentSuccessInterface) => {
    if (onSuccess) {
      return onSuccess(payload);
    }
    return null;
  };

  const payNow = async () => {
    try {
      if (!session.data) {
        throw new Error("Session not initialized yet!");
      }

      const payload = { amount: isArr ? getTotalAmount() : product.price };

      const { data } = await axios.post("/api/razorpay/order", payload);

      const options: ModifiedRazorpayInterface = {
        name: "ShopSphere",
        description: "Bulk Order",
        amount: data.amount,
        order_id: data.id,
        currency: "INR",
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        notes: {
          name: session.data.user.name as string,
          user: session.data.user.id,
          orders: JSON.stringify(getOrderPayload()),
        },
        handler: handleSuccess,
      };

      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", (err: any) => {
        setOpen(true);
        if (!onFailed) {
          return;
        }
        const payload = {
          reason: err.reason,
          order_id: err.metadata.order_id,
          payment_id: err.metadata.payment_id,
        };

        onFailed(payload);
      });
    } catch (error) {
      ClientCatchError(error);
    }
  };

  if (product.length === 0) {
    return <Empty />;
  }

  return (
    <>
      {theme === "blue" ? (
        <Button
          onClick={payNow}
          size="large"
          type="primary"
          className="px-8! py-4! font-medium!"
        >
          {title}
        </Button>
      ) : (
        <Button
          danger
          onClick={payNow}
          size="large"
          type="primary"
          className="px-8! py-4! font-medium!"
        >
          {title}
        </Button>
      )}
      <Modal
        width="50%"
        open={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
        }}
      >
        <Result
          status="500"
          title="500"
          subTitle="Payment Failed, Please try after Sometime.."
          extra={
            <Button
              type="primary"
              onClick={() => router.push("/user/orders")}
            ></Button>
          }
        />
      </Modal>
    </>
  );
};

export default Pay;
