import Slug from "@/components/Slug";
import {
  fetchProductBySlug,
  fetchProductSlugs,
} from "@/controller/product.controller";
import SlugInterface from "@/interface/slug.interface";
import { FC } from "react";

export const revalidate = 20;

export const generateMetadata = async (context: SlugInterface) => {
  const paramsData = await context.params;

  const slugRes = await fetchProductBySlug(paramsData.slug);
  const data = slugRes.ok ? await slugRes.json() : null;

  return {
    title: `${paramsData.slug.split("-").join(" ")} - shopsphere`,
    description: data ? data.description : "ecommerce",
    keyword: "ecom, ecommerce, online ecommerce website",
    openGraph: {
      title: `${paramsData.slug.split("-").join(" ")} - shopsphere`,
      description: data ? data.description : "ecommerce",
      url: `${process.env.SERVER}/products/${paramsData.slug}`,
      siteName: "shopsphere",
      images: [
        {
          url: data ? data.image : "/images/logo.png", // replace with your image
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
};

const SlugRouter: FC<SlugInterface> = async ({ params }) => {
  const { slug } = await params;

  const slugRes = await fetchProductBySlug(slug);
  const data = slugRes.ok ? await slugRes.json() : null;

  return <Slug data={data} title={slug} />;
};

export default SlugRouter;

export const generateStaticParams = async () => {
  const slugs = await fetchProductSlugs();

  return slugs.map((slug: string) => ({ slug: slug }));
};
