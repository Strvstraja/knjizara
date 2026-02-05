import { type AuthUser } from "wasp/auth";
import Breadcrumb from "../../layout/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import SellersAdminTable from "./SellersAdminTable";

const SellersAdmin = ({ user }: { user: AuthUser }) => {
  return (
    <DefaultLayout user={user}>
      <Breadcrumb pageName="Manage Sellers" />
      <div className="flex flex-col gap-10">
        <SellersAdminTable />
      </div>
    </DefaultLayout>
  );
};

export default SellersAdmin;
