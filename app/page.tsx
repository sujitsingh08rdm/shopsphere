import Products from "@/components/Products";
import { fetchProducts } from "@/controller/product.controller";

export const revalidate = 20;

export const metadata = {
  title: `shopsphere - ${process.env.DOMAIN}`,
  description: "The Best website for Your Ecommerce needs",
  keyword: "ecom, ecommerce, online ecommerce website, ",
  openGraph: {
    title: `shopsphere - ${process.env.DOMAIN}`,
    description: "The Best website for Your Ecommerce needs.",
    url: process.env.SERVER,
    siteName: "shopsphere",
    images: [
      {
        url: "/images/logo.png", // replace with your image
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const HomeRouter = async () => {
  const products = await fetchProducts();

  return <Products data={products} />;
};

export default HomeRouter;
