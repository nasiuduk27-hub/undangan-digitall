import { Playfair_Display, Lora } from "next/font/google";

const header = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], display: "swap" });
const body = Lora({ subsets: ["latin"], display: "swap" });

export const melatiFonts = {
  header: header.style.fontFamily,
  body: body.style.fontFamily,
};
