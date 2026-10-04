import Signup from "@/components/Signup";

export const metadata = {
  title: `Signup - shopsphere`,
  description: "Signup or register your ecomm account with us",
  keyword:
    "ecom, ecommerce, online ecommerce website, ecomm login, shopping login , ecomm register",
  openGraph: {
    title: `Signup - shopsphere`,
    description: "Signup Or Register With your ecomm account",
    url: `${process.env.SERVER}/signup`,
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

const SignupRouter = () => {
  return <Signup />;
};

export default SignupRouter;
