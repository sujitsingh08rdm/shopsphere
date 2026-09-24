"use client";
import Link from "next/link";
import { CloseCircleOutlined, LoginOutlined } from "@ant-design/icons";

const AuthFailed = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <CloseCircleOutlined className="text-5xl text-red-500" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          Authentication Failed
        </h1>

        {/* Description */}
        <p className="mb-8 text-sm leading-6 text-gray-500">
          We couldn't authenticate your account. Your session may have expired
          or your credentials may be invalid.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            <LoginOutlined />
            Go to Login
          </Link>

          <Link
            href="/"
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthFailed;
