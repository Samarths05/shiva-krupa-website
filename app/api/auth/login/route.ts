import { login } from "../../../../lib/app-auth";
export async function POST(request:Request){
 try{const {email,password}=await request.json();const session=await login(String(email||""),String(password||""));if(!session)return Response.json({error:"Incorrect email or password."},{status:401});return Response.json({ok:true,role:session.role})}
 catch(e){return Response.json({error:e instanceof Error?e.message:"Could not sign in."},{status:400})}
}
