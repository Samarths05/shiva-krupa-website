import type { Metadata } from "next";
import { FloatingActions, Footer, Header } from "../components/site-shell";
import { getSiteSettings } from "../lib/site-settings";
import { getAppSession } from "../lib/app-auth";
import { getChatGPTUser } from "./chatgpt-auth";
import AccessLogin from "../components/access-login";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Shiva Krupa Polyclinic | Dr Aishwarya V Mathikatti", template: "%s | Shiva Krupa Polyclinic" },
  description: "Women’s health, fertility, pregnancy and general medicine care in Basaveshwar Nagar, Bengaluru.",
  other: { "codex-preview": "development" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSiteSettings();
  const [session,chatgptUser]=await Promise.all([getAppSession(),getChatGPTUser()]);
  const style = { "--primary":s.primary,"--gold":s.accent,"--cream":s.background,"--ink":s.ink,"--muted":s.muted,"--surface":s.surface,"--soft":s.soft,"--deep":s.deep,"--radius":`${s.radius}px`,"--serif":`"${s.headingFont}", Georgia, serif`,"--sans":`"${s.bodyFont}", Arial, sans-serif` } as React.CSSProperties;
  const classes=`theme-${s.themeMode} width-${s.contentWidth} cards-${s.cardStyle} buttons-${s.buttonStyle} motion-${s.animationStyle}`;
  if((s as any).websitePrivate&&!session&&!chatgptUser)return <html lang="en"><body style={style} className={classes}><main><AccessLogin/></main></body></html>;
  return <html lang="en"><body style={style} className={classes}><Header settings={s}/><main>{children}</main><Footer settings={s}/><FloatingActions settings={s}/></body></html>;
}
