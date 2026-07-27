import { logout } from "../../../../lib/app-auth";
export async function POST(){await logout();return Response.json({ok:true})}
export async function GET(request:Request){await logout();return Response.redirect(new URL("/",request.url))}
