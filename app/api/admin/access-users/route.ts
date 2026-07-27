import { requireAdminApi } from "../../../../lib/admin-auth";
import { deleteAccessUser, listAccessUsers, upsertAccessUser, type AccessRole } from "../../../../lib/app-auth";
export async function GET(){if(!(await requireAdminApi()))return Response.json({error:"Unauthorized"},{status:401});return Response.json({users:await listAccessUsers()})}
export async function POST(request:Request){
 if(!(await requireAdminApi()))return Response.json({error:"Unauthorized"},{status:401});
 try{const {email,role,password}=await request.json();await upsertAccessUser(String(email||""),String(role||"viewer") as AccessRole,String(password||""));return Response.json({ok:true})}
 catch(e){return Response.json({error:e instanceof Error?e.message:"Could not add access."},{status:400})}
}
export async function DELETE(request:Request){
 if(!(await requireAdminApi()))return Response.json({error:"Unauthorized"},{status:401});
 const {email}=await request.json();await deleteAccessUser(String(email||""));return Response.json({ok:true});
}
