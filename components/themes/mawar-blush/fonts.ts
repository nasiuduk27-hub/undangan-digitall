import { Cormorant_Garamond, Nunito_Sans } from "next/font/google";

const header = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const body = Nunito_Sans({ subsets: ["latin"], display: "swap" });

export const mawarFonts = {
  header: header.style.fontFamily,
  body: body.style.fontFamily,
};
