import localFont from "next/font/local";

export const openSauceOne = localFont({
  src: [
    { path: "../public/fonts/OpenSauceOne-Light.ttf", weight: "300" },
    { path: "../public/fonts/OpenSauceOne-Regular.ttf", weight: "400" },
    { path: "../public/fonts/OpenSauceOne-Medium.ttf", weight: "500" },
    { path: "../public/fonts/OpenSauceOne-SemiBold.ttf", weight: "600" },
    { path: "../public/fonts/OpenSauceOne-Bold.ttf", weight: "700" },
  ],
  variable: "--font-open-sauce-one",
  display: "swap",
});
