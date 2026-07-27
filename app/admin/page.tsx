import { redirect } from "next/navigation";
import AdminPanel from "../../components/admin-panel";
import { isAdmin } from "../../lib/admin-auth";
export const dynamic="force-dynamic";
export const metadata={title:"Private Admin",robots:{index:false,follow:false}};
export default async function Admin(){if(!(await isAdmin()))redirect("/admin/login");return <AdminPanel/>}
