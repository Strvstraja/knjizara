import { type AuthUser } from "wasp/auth";
import Breadcrumb from "../../layout/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";
import BooksAdminTable from "./BooksAdminTable";

const BooksAdmin = ({ user }: { user: AuthUser }) => {
  return (
    <DefaultLayout user={user}>
      <Breadcrumb pageName="Manage Books" />
      <div className="flex flex-col gap-10">
        <BooksAdminTable />
      </div>
    </DefaultLayout>
  );
};

export default BooksAdmin;
