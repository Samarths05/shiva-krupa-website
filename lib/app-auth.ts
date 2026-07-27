import { cookies } from "next/headers";

export type AccessRole = "viewer" | "admin";
export type AccessSession = { email:string; role:AccessRole };
const COOKIE_NAME="clinic_session";
// Cloudflare Workers' Web Crypto implementation caps PBKDF2 at 100,000 rounds.
// Keep this value identical for password creation and login verification.
const PBKDF2_ITERATIONS=100000;

async function db(){
 const {env}=await import("cloudflare:workers");
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS access_users (email TEXT PRIMARY KEY, role TEXT NOT NULL, password_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS access_sessions (token_hash TEXT PRIMARY KEY, email TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 return env.DB;
}
function hex(bytes:ArrayBuffer){return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function digest(value:string){return hex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))}
async function passwordHash(password:string,salt:string){
 const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveBits"]);
 return hex(await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:new TextEncoder().encode(salt),iterations:PBKDF2_ITERATIONS},key,256));
}
export async function listAccessUsers(){
 const rows=await (await db()).prepare("SELECT email, role, created_at FROM access_users ORDER BY role DESC, email").all();
 return rows.results||[];
}
export async function upsertAccessUser(email:string,role:AccessRole,password:string){
 email=email.trim().toLowerCase();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error("Enter a valid email address.");
 if(!["viewer","admin"].includes(role))throw new Error("Choose a valid access level.");
 if(password.length<8)throw new Error("Temporary password must contain at least 8 characters.");
 const salt=crypto.randomUUID(),hash=await passwordHash(password,salt),database=await db();
 await database.prepare("INSERT INTO access_users(email,role,password_hash,salt) VALUES(?,?,?,?) ON CONFLICT(email) DO UPDATE SET role=excluded.role,password_hash=excluded.password_hash,salt=excluded.salt").bind(email,role,hash,salt).run();
 await database.prepare("DELETE FROM access_sessions WHERE email=?").bind(email).run();
}
export async function deleteAccessUser(email:string){
 const database=await db();email=email.trim().toLowerCase();
 await database.batch([database.prepare("DELETE FROM access_sessions WHERE email=?").bind(email),database.prepare("DELETE FROM access_users WHERE email=?").bind(email)]);
}
export async function login(email:string,password:string){
 const database=await db();email=email.trim().toLowerCase();
 const user=await database.prepare("SELECT email,role,password_hash,salt FROM access_users WHERE email=?").bind(email).first<any>();
 if(!user||await passwordHash(password,user.salt)!==user.password_hash)return null;
 const token=`${crypto.randomUUID()}${crypto.randomUUID()}`,tokenHash=await digest(token),expires=new Date(Date.now()+7*86400000);
 await database.prepare("INSERT INTO access_sessions(token_hash,email,expires_at) VALUES(?,?,?)").bind(tokenHash,email,expires.toISOString()).run();
 (await cookies()).set(COOKIE_NAME,token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",expires});
 return {email,role:user.role as AccessRole};
}
export async function getAppSession():Promise<AccessSession|null>{
 const token=(await cookies()).get(COOKIE_NAME)?.value;if(!token)return null;
 const database=await db(),row=await database.prepare("SELECT u.email,u.role FROM access_sessions s JOIN access_users u ON u.email=s.email WHERE s.token_hash=? AND s.expires_at>CURRENT_TIMESTAMP").bind(await digest(token)).first<any>();
 return row?{email:row.email,role:row.role}:null;
}
export async function logout(){
 const jar=await cookies(),token=jar.get(COOKIE_NAME)?.value;
 if(token)await (await db()).prepare("DELETE FROM access_sessions WHERE token_hash=?").bind(await digest(token)).run();
 jar.delete(COOKIE_NAME);
}
