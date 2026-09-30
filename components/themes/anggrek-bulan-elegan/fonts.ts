import { Bodoni_Moda, Lato } from "next/font/google";

const header = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const body = Lato({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const anggrekFonts = {
  header: header.style.fontFamily,
  body: body.style.fontFamily,
};
