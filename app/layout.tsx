import type {Metadata} from "next";
import {BookingProvider} from "@/components/booking-provider";
import {SiteHeader,Footer} from "@/components/ui";
import "./globals.css";
export const metadata:Metadata={title:{default:"Emirul Hakimi | Personal Training in Penang",template:"%s | Emirul Hakimi PT"},description:"Explore RM35, 90-minute personal training sessions in Penang. Try the complete portfolio booking demo.",icons:{icon:"/images/emirul-initials.svg"},openGraph:{title:"Train with Emirul Hakimi",description:"Personal training in Penang. RM35 for a 90-minute 1-on-1 session."}};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><BookingProvider><SiteHeader/>{children}<Footer/></BookingProvider></body></html>;
}
