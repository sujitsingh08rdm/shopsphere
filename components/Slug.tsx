import DataInterface from "@/interface/data.interface";
import priceCalculate from "@/lib/price-calculate";
import { Button, Card, Empty } from "antd";
import Image from "next/image";
import { FC } from "react";

interface TitleInterface extends DataInterface {
  title: string;
}

const Slug: FC<TitleInterface> = ({ data, title }) => {
  if (!data) {
    return <Empty />;
  }

  return (
    <div>
      <Card className="shadow-lg">
        <div className="flex gap-12">
          <Image
            src={data.image}
            width={240}
            height={0}
            alt={data.title}
            className="rounded-lg object-cover"
          />
          <div>
            <h2 className="text-4xl font-bold">{data.title}</h2>
            <p className="text-slate-500 mt-2">{data.description}</p>
            <div className="text-3xl font-medium flex gap-4 mt-4 mb-4">
              <h2>₹{priceCalculate(data.price, data.discount)}</h2>
              <del className="text-rose-400">₹{data.price}</del>
              <h2 className="text-rose-400">({data.discount}% Discount)</h2>
            </div>
            <Button
              type="primary"
              className="bg-indigo-500! font-medium! px-12! py-6! text-xl! hover:bg-indigo-600!"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Slug;
