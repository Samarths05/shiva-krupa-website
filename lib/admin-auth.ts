import { getChatGPTUser } from "../app/chatgpt-auth";
import { getAppSession } from "./app-auth";
const OWNER_EMAIL = "pavan1bk1@gmail.com";
export async function requireAdminApi() {
  const session=await getAppSession();
  if(session?.role==="admin")return session;
  const user = await getChatGPTUser();
  if (!user || user.email.toLowerCase() !== OWNER_EMAIL) return null;
  return user;
}
export async function isAdmin() {
  const session=await getAppSession();
  if(session?.role==="admin")return true;
  const user = await getChatGPTUser();
  return !!user && user.email.toLowerCase() === OWNER_EMAIL;
}
