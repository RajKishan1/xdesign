export interface FontOption {
  id: string;
  name: string;
  family: string;
  googleFontUrl: string;
  category: "sans-serif" | "serif" | "monospace" | "display";
}

export const POPULAR_FONTS: FontOption[] = [
  {
    id: "inter",
    name: "Inter",
    family: "Inter",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
    category: "sans-serif",
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "Roboto",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap",
    category: "sans-serif",
  },
  {
    id: "open-sans",
    name: "Open Sans",
    family: "Open Sans",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap",
    category: "sans-serif",
  },
  {
    id: "lato",
    name: "Lato",
    family: "Lato",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap",
    category: "sans-serif",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    family: "Montserrat",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap",
    category: "sans-serif",
  },
  {
    id: "poppins",
    name: "Poppins",
    family: "Poppins",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap",
    category: "sans-serif",
  },
  {
    id: "raleway",
    name: "Raleway",
    family: "Raleway",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap",
    category: "sans-serif",
  },
  {
    id: "nunito",
    name: "Nunito",
    family: "Nunito",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800;900&display=swap",
    category: "sans-serif",
  },
  {
    id: "plus-jakarta-sans",
    name: "Plus Jakarta Sans",
    family: "Plus Jakarta Sans",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap",
    category: "sans-serif",
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    family: "Space Grotesk",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
    category: "sans-serif",
  },
  {
    id: "work-sans",
    name: "Work Sans",
    family: "Work Sans",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;800;900&display=swap",
    category: "sans-serif",
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    family: "DM Sans",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap",
    category: "sans-serif",
  },
  {
    id: "playfair-display",
    name: "Playfair Display",
    family: "Playfair Display",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap",
    category: "serif",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    family: "Merriweather",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap",
    category: "serif",
  },
  {
    id: "lora",
    name: "Lora",
    family: "Lora",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap",
    category: "serif",
  },
  {
    id: "jetbrains-mono",
    name: "JetBrains Mono",
    family: "JetBrains Mono",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&display=swap",
    category: "monospace",
  },
  {
    id: "source-code-pro",
    name: "Source Code Pro",
    family: "Source Code Pro",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;600;700;900&display=swap",
    category: "monospace",
  },
  {
    id: "bebas-neue",
    name: "Bebas Neue",
    family: "Bebas Neue",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
    category: "display",
  },
  {
    id: "oswald",
    name: "Oswald",
    family: "Oswald",
    googleFontUrl: "https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap",
    category: "display",
  },
];

export const DEFAULT_FONT = "plus-jakarta-sans";

export const getFontById = (fontId: string): FontOption | undefined => {
  return POPULAR_FONTS.find((f) => f.id === fontId);
};
