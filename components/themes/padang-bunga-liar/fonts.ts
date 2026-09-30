import { Libre_Baskerville, Karla } from "next/font/google";

const header = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const body = Karla({ subsets: ["latin"], display: "swap" });

export const padangFonts = {
  header: header.style.fontFamily,
  body: body.style.fontFamily,
};
