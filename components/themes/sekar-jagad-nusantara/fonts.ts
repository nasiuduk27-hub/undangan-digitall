import { Cormorant, Plus_Jakarta_Sans } from "next/font/google";

const header = Cormorant({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const sekarFonts = {
  header: header.style.fontFamily,
  body: body.style.fontFamily,
};
