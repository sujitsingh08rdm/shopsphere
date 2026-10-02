"use client";
import Fetcher from "@/lib/Fetcher";
import priceCalculate from "@/lib/price-calculate";
import { Card, Divider, Empty, Image, Result, Skeleton, Tag } from "antd";
import moment from "moment";
import useSWR from "swr";

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

  const totalPrice = () => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const prices = data[i].prices;
      const discounts = data[i].discounts;
      const quantities = data[i].quantities;
      for (let j = 0; j < prices.length; j++) {
        const price = prices[j];
        const discount = discounts[j];
        const quantity = quantities[j];
        const amount = priceCalculate(price, discount);
        const total = amount * quantity;

        sum += total;
      }
    }
    return sum;
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
                      height={150}
                      width={120}
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
                      <div className="flex gap-2">
                        <Tag
                          className="font-medium"
                          color={getStatusColor(item.status)}
                        >
                          {item.status.toUpperCase()}
                        </Tag>
                        <Tag color="pink" className="font-medium">
                          {item.quantities[pIndex]} PCS
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Divider />
          <h2 className="text-xl font-bold">
            Total Price: ₹{item.grossTotal}
            {/* {totalPrice().toLocaleString()} */}
          </h2>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
