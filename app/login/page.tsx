import Login from "@/components/Login";

export const metadata = {
  title: `Login - shopsphere`,
  description: "Signin Or Login With your ecomm account",
  keyword:
    "ecom, ecommerce, online ecommerce website, ecomm login, shopping login",
  openGraph: {
    title: `Login - shopsphere`,
    description: "Signin Or Login With your ecomm account",
    url: `${process.env.SERVER}/login`,
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

const LoginRouter = () => {
  return <Login />;
};

export default LoginRouter;
