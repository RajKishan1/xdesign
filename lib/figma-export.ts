import axios from "axios";

/**
 * Converts a DOM element to SVG representation
 */
function elementToSvg(
  element: Element,
  offsetX: number = 0,
  offsetY: number = 0
): string {
  // Skip script and style elements
  if (element.tagName === "SCRIPT" || element.tagName === "STYLE") {
    return "";
  }

  const rect = element.getBoundingClientRect();
  const x = Math.max(0, rect.left - offsetX);
  const y = Math.max(0, rect.top - offsetY);
  const width = Math.max(0, rect.width);
  const height = Math.max(0, rect.height);

  // Skip if element has no dimensions
  if (width === 0 && height === 0 && element.children.length === 0) {
    return "";
  }

  // Get computed styles - use element's ownerDocument to get the right window
  const doc = element.ownerDocument;
  const win = doc.defaultView || (doc as any).parentWindow;
  if (!win) return "";
  
  const styles = win.getComputedStyle(element);
  const bgColor = styles.backgroundColor;
  const color = styles.color;
  const fontSize = styles.fontSize;
  const fontFamily = styles.fontFamily;
  const fontWeight = styles.fontWeight;
  const textAlign = styles.textAlign;
  const borderColor = styles.borderColor;
  const borderWidth = styles.borderWidth;
  const borderRadius = styles.borderRadius;
  const opacity = styles.opacity;
  const display = styles.display;
  const visibility = styles.visibility;

  // Skip hidden elements
  if (display === "none" || visibility === "hidden") {
    return "";
  }

  let svgContent = "";

  // Convert background to rect if visible
  if (bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent" && width > 0 && height > 0) {
    const fill = rgbToHex(bgColor);
    const rx = borderRadius !== "0px" && borderRadius !== "none" ? parseFloat(borderRadius) : 0;
    svgContent += `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"${rx > 0 ? ` rx="${rx}"` : ""} opacity="${opacity}"/>\n`;
  }

  // Convert border if present
  if (borderWidth !== "0px" && borderColor !== "rgba(0, 0, 0, 0)" && borderColor !== "transparent") {
    const stroke = rgbToHex(borderColor);
    const strokeWidth = parseFloat(borderWidth);
    const rx = borderRadius !== "0px" && borderRadius !== "none" ? parseFloat(borderRadius) : 0;
    svgContent += `  <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${rx > 0 ? ` rx="${rx}"` : ""} opacity="${opacity}"/>\n`;
  }

  // Convert text content (only for leaf nodes with text)
  const hasOnlyTextChildren = Array.from(element.childNodes).every(
    (node) => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && (node as Element).children.length === 0)
  );

  if (hasOnlyTextChildren && element.textContent && element.textContent.trim()) {
    const text = element.textContent.trim();
    const textColor = rgbToHex(color);
    const textX = textAlign === "center" ? x + width / 2 : textAlign === "right" ? x + width - 10 : x + 10;
    const textY = y + parseFloat(fontSize) * 0.8; // Approximate baseline
    const anchor = textAlign === "center" ? "middle" : textAlign === "right" ? "end" : "start";
    svgContent += `  <text x="${textX}" y="${textY}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${textColor}" opacity="${opacity}" text-anchor="${anchor}">${escapeXml(text)}</text>\n`;
  }

  // Convert images
  if (element instanceof HTMLImageElement && element.src && width > 0 && height > 0) {
    svgContent += `  <image x="${x}" y="${y}" width="${width}" height="${height}" href="${element.src}" opacity="${opacity}"/>\n`;
  }

  // Recursively process children
  Array.from(element.children).forEach((child) => {
    svgContent += elementToSvg(child, offsetX, offsetY);
  });

  return svgContent;
}

/**
 * Converts RGB color string to hex
 */
function rgbToHex(rgb: string): string {
  if (rgb.startsWith("#")) return rgb;
  if (rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return "none";
  
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return "#000000";
  
  const r = parseInt(match[0]).toString(16).padStart(2, "0");
  const g = parseInt(match[1]).toString(16).padStart(2, "0");
  const b = parseInt(match[2]).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

/**
 * Escapes XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Converts iframe content to editable SVG for Figma
 */
export async function convertIframeToEditableSvg(
  iframe: HTMLIFrameElement,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        reject(new Error("Cannot access iframe content"));
        return;
      }

      // Wait for content to be fully loaded
      if (iframeDoc.readyState !== "complete") {
        iframe.onload = () => {
          setTimeout(() => {
            try {
              const svg = buildSvgFromDocument(iframeDoc, width, height);
              resolve(svg);
            } catch (error) {
              reject(error);
            }
          }, 100);
        };
        return;
      }

      setTimeout(() => {
        try {
          const svg = buildSvgFromDocument(iframeDoc, width, height);
          resolve(svg);
        } catch (error) {
          reject(error);
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Builds SVG from document
 */
function buildSvgFromDocument(doc: Document, width: number, height: number): string {
  const root = doc.body || doc.documentElement;
  if (!root) {
    throw new Error("No root element found");
  }

  // Get the root element's position to use as offset
  const rootRect = root.getBoundingClientRect();
  const offsetX = rootRect.left;
  const offsetY = rootRect.top;

  // Get all styles
  let styles = "";
  try {
    for (const sheet of doc.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          styles += rule.cssText + "\n";
        }
      } catch (e) {
        // Cross-origin stylesheets may fail
      }
    }
  } catch (e) {
    // Ignore style errors
  }

  // Convert DOM to SVG
  const svgElements = elementToSvg(root, offsetX, offsetY);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style type="text/css">
      <![CDATA[
        ${styles}
      ]]>
    </style>
  </defs>
  ${svgElements}
</svg>`;

  return svg;
}

/**
 * Alternative approach: Convert iframe to SVG using canvas
 * This captures the rendered HTML as an image and embeds it in SVG for better Figma compatibility
 */
export async function convertIframeToFigmaSvg(
  iframe: HTMLIFrameElement,
  width: number,
  height: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Try to access iframe content
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        // Fallback: use the HTML string approach
        reject(new Error("Cannot access iframe content"));
        return;
      }

      // Create a canvas to capture the iframe content
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Create an image from the iframe's body
      const htmlContent = iframeDoc.documentElement.outerHTML;
      
      // For better compatibility, we'll use the HTML approach
      // If canvas capture is needed, it would require html2canvas library
      convertHtmlToFigmaSvg(htmlContent, width, height)
        .then(resolve)
        .catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Main function to copy design to clipboard as editable SVG for Figma
 * Converts the iframe DOM to structured SVG that Figma can parse into editable elements
 * 
 * Note: Figma doesn't support direct paste of SVG from clipboard.
 * This function copies the SVG and also provides a download option.
 * Users should drag the downloaded SVG file into Figma for best results.
 */
export async function copyDesignToFigma(
  iframe: HTMLIFrameElement | null,
  html: string,
  width: number,
  height: number,
  title: string = "Design"
): Promise<void> {
  try {
    // Check if clipboard API is available
    if (!navigator.clipboard) {
      throw new Error("Clipboard API is not available");
    }

    // Get the full HTML content for image generation
    const fullHtml = iframe?.contentDocument ? 
      iframe.contentDocument.documentElement.outerHTML : 
      html;

    // Priority: Copy as PNG image - Figma can paste images directly
    // This is the most reliable way to paste into Figma
    try {
      const response = await axios.post(
        "/api/screenshot",
        {
          html: fullHtml,
          width,
          height,
        },
        {
          responseType: "blob",
          validateStatus: (status) => status >= 200 && status < 300,
        }
      );

      const imageBlob = response.data as Blob;

      // Copy as PNG image - Figma can paste this directly
      if (navigator.clipboard.write && typeof ClipboardItem !== "undefined") {
        const imageItem = new ClipboardItem({
          "image/png": imageBlob,
        });
        await navigator.clipboard.write([imageItem]);
        return; // Successfully copied as image - this will paste in Figma
      } else {
        throw new Error("ClipboardItem API not supported");
      }
    } catch (error) {
      console.error("Failed to copy as PNG image:", error);
      throw new Error("Failed to copy design as image. Please try again.");
    }
  } catch (error) {
    console.error("Failed to copy design to Figma:", error);
    throw error;
  }
}

/**
 * Converts HTML content to SVG format (fallback method)
 */
async function convertHtmlToFigmaSvg(
  html: string,
  width: number,
  height: number,
  title: string = "Design"
): Promise<string> {
  // Create an SVG that embeds the HTML as a foreignObject
  // This is a fallback when iframe access is not available
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <defs>
    <style type="text/css">
      <![CDATA[
        * { margin: 0; padding: 0; box-sizing: border-box; }
      ]]>
    </style>
  </defs>
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; overflow: visible;">
${html}
    </div>
  </foreignObject>
</svg>`;

  return svg;
}
