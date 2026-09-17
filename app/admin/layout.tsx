import AdminLayout from "@/components/admin/AdminLayout";
import ChildrenInterface from "@/interface/children.interface";
import { FC } from "react";

const AdminLayouterRouter: FC<ChildrenInterface> = ({ children }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminLayouterRouter;
