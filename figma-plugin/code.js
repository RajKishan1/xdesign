"use strict";
/**
 * Gimble Design Figma Plugin - Import JSON as editable layers
 * Creates FRAME, TEXT, and RECTANGLE nodes from XDESIGN_FIGMA_EXPORT JSON.
 */
/// <reference types="@figma/plugin-typings" />
function fontWeightToStyle(weight) {
  if (weight >= 700) return "Bold";
  if (weight >= 600) return "Semi Bold";
  if (weight >= 500) return "Medium";
  if (weight >= 400) return "Regular";
  return "Regular";
}
function applyFills(node, fills) {
  var _a;
  if (!fills || fills.length === 0) return;
  const solid = fills.find((f) => f.type === "SOLID" && f.color);
  if (solid && solid.color) {
    node.fills = [
      {
        type: "SOLID",
        color: solid.color,
        opacity: (_a = solid.opacity) !== null && _a !== void 0 ? _a : 1,
      },
    ];
  }
}
async function applyFillsWithImages(node, fills) {
  if (!fills || fills.length === 0) return;
  const imageFill = fills.find(
    (f) => f.type === "IMAGE" && (f.imageBase64 || f.imageHash),
  );
  if (imageFill && imageFill.imageBase64) {
    try {
      const binary = Uint8Array.from(atob(imageFill.imageBase64), (c) =>
        c.charCodeAt(0),
      );
      const hash = figma.createImage(binary).hash;
      node.fills = [
        {
          type: "IMAGE",
          scaleMode: imageFill.scaleMode || "FILL",
          imageHash: hash,
        },
      ];
    } catch (e) {
      figma.notify("Could not embed image: " + (e && e.message), {
        error: true,
      });
    }
    return;
  }
  if (
    imageFill &&
    imageFill.imageHash &&
    !imageFill.imageHash.startsWith("http")
  ) {
    node.fills = [
      {
        type: "IMAGE",
        scaleMode: imageFill.scaleMode || "FILL",
        imageHash: imageFill.imageHash,
      },
    ];
    return;
  }
  applyFills(node, fills);
}
function applyStrokes(node, strokes, weight) {
  var _a;
  if (!strokes || strokes.length === 0) return;
  const solid = strokes.find((f) => f.type === "SOLID" && f.color);
  if (solid && solid.color) {
    node.strokes = [
      {
        type: "SOLID",
        color: solid.color,
        opacity: (_a = solid.opacity) !== null && _a !== void 0 ? _a : 1,
      },
    ];
    node.strokeWeight = weight || 1;
    node.strokeAlign = "INSIDE";
  }
}
function applyEffects(node, effects) {
  if (!effects || effects.length === 0) return;
  const shadows = effects.filter(
    (e) => e.type === "DROP_SHADOW" && e.visible && e.color,
  );
  if (shadows.length > 0) {
    node.effects = shadows.map((e) => ({
      type: "DROP_SHADOW",
      color: e.color,
      offset: e.offset || { x: 0, y: 2 },
      radius: e.radius || 4,
      spread: e.spread || 0,
      visible: true,
    }));
  }
}
async function createNodeFromJson(json, parent) {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u,
    _v,
    _w,
    _x,
    _y,
    _z,
    _0,
    _1,
    _2,
    _3;
  if (json.visible === false) return null;
  let node = null;
  if (json.type === "FRAME") {
    const frame = figma.createFrame();
    frame.name = json.name || "Frame";
    frame.x = json.x;
    frame.y = json.y;
    frame.resize(json.width, json.height);
    frame.opacity = (_a = json.opacity) !== null && _a !== void 0 ? _a : 1;
    frame.clipsContent =
      (_b = json.clipsContent) !== null && _b !== void 0 ? _b : true;
    const fn = json;
    applyFills(frame, fn.fills);
    applyStrokes(frame, fn.strokes, fn.strokeWeight);
    applyEffects(frame, fn.effects);
    frame.cornerRadius =
      (_c = fn.cornerRadius) !== null && _c !== void 0 ? _c : 0;
    if (
      fn.topLeftRadius !== undefined ||
      fn.topRightRadius !== undefined ||
      fn.bottomRightRadius !== undefined ||
      fn.bottomLeftRadius !== undefined
    ) {
      frame.topLeftRadius =
        (_d = fn.topLeftRadius) !== null && _d !== void 0 ? _d : 0;
      frame.topRightRadius =
        (_e = fn.topRightRadius) !== null && _e !== void 0 ? _e : 0;
      frame.bottomRightRadius =
        (_f = fn.bottomRightRadius) !== null && _f !== void 0 ? _f : 0;
      frame.bottomLeftRadius =
        (_g = fn.bottomLeftRadius) !== null && _g !== void 0 ? _g : 0;
    }
    frame.layoutMode =
      (_h = fn.layoutMode) !== null && _h !== void 0 ? _h : "NONE";
    frame.primaryAxisAlignItems =
      (_j = fn.primaryAxisAlignItems) !== null && _j !== void 0 ? _j : "MIN";
    frame.counterAxisAlignItems =
      (_k = fn.counterAxisAlignItems) !== null && _k !== void 0 ? _k : "MIN";
    frame.itemSpacing =
      (_l = fn.itemSpacing) !== null && _l !== void 0 ? _l : 0;
    frame.paddingLeft =
      (_m = fn.paddingLeft) !== null && _m !== void 0 ? _m : 0;
    frame.paddingRight =
      (_o = fn.paddingRight) !== null && _o !== void 0 ? _o : 0;
    frame.paddingTop = (_p = fn.paddingTop) !== null && _p !== void 0 ? _p : 0;
    frame.paddingBottom =
      (_q = fn.paddingBottom) !== null && _q !== void 0 ? _q : 0;
    if (fn.layoutPositioning) {
      frame.layoutPositioning = fn.layoutPositioning;
    }
    for (const child of fn.children || []) {
      const childNode = await createNodeFromJson(child, frame);
      if (childNode) frame.appendChild(childNode);
    }
    node = frame;
  } else if (json.type === "TEXT") {
    const tn = json;
    const text = figma.createText();
    text.name = json.name || "Text";
    text.x = json.x;
    text.y = json.y;
    text.resize(json.width, json.height);
    text.opacity = (_r = json.opacity) !== null && _r !== void 0 ? _r : 1;
    const family =
      ((_s = tn.style) === null || _s === void 0 ? void 0 : _s.fontFamily) ||
      "Inter";
    const style = fontWeightToStyle(
      ((_t = tn.style) === null || _t === void 0 ? void 0 : _t.fontWeight) ||
        400,
    );
    try {
      await figma.loadFontAsync({ family, style });
    } catch (_4) {
      try {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      } catch (_5) {
        // skip font
      }
    }
    text.characters = tn.characters || "";
    text.fontSize =
      ((_u = tn.style) === null || _u === void 0 ? void 0 : _u.fontSize) || 14;
    text.textAlignHorizontal =
      ((_v = tn.style) === null || _v === void 0
        ? void 0
        : _v.textAlignHorizontal) || "LEFT";
    text.textAlignVertical =
      ((_w = tn.style) === null || _w === void 0
        ? void 0
        : _w.textAlignVertical) || "TOP";
    if (
      ((_x = tn.style) === null || _x === void 0
        ? void 0
        : _x.letterSpacing) !== undefined
    ) {
      text.letterSpacing = { value: tn.style.letterSpacing, unit: "PIXELS" };
    }
    applyFills(text, tn.fills);
    applyEffects(text, tn.effects);
    if (
      tn.textAutoResize === "WIDTH_AND_HEIGHT" ||
      tn.textAutoResize === "HEIGHT"
    ) {
      text.textAutoResize = tn.textAutoResize;
    }
    node = text;
  } else if (json.type === "VECTOR") {
    const vec = figma.createVector();
    vec.name = json.name || "Vector";
    vec.x = json.x;
    vec.y = json.y;
    vec.resize(json.width, json.height);
    vec.opacity = json.opacity ?? 1;
    const vn = json;
    if (
      vn.vectorPaths &&
      Array.isArray(vn.vectorPaths) &&
      vn.vectorPaths.length > 0
    ) {
      vec.vectorPaths = vn.vectorPaths.map((p) => ({
        windingRule: p.windingRule === "EVENODD" ? "EVENODD" : "NONZERO",
        data: p.data || "",
      }));
    }
    applyFills(vec, vn.fills);
    applyStrokes(vec, vn.strokes, vn.strokeWeight);
    applyEffects(vec, vn.effects);
    node = vec;
  } else if (json.type === "RECTANGLE") {
    const rect = figma.createRectangle();
    rect.name = json.name || "Rectangle";
    rect.x = json.x;
    rect.y = json.y;
    rect.resize(json.width, json.height);
    rect.opacity = (_y = json.opacity) !== null && _y !== void 0 ? _y : 1;
    const rn = json;
    await applyFillsWithImages(rect, rn.fills);
    applyStrokes(rect, rn.strokes, rn.strokeWeight);
    applyEffects(rect, rn.effects);
    rect.cornerRadius =
      (_z = rn.cornerRadius) !== null && _z !== void 0 ? _z : 0;
    if (
      rn.topLeftRadius !== undefined ||
      rn.topRightRadius !== undefined ||
      rn.bottomRightRadius !== undefined ||
      rn.bottomLeftRadius !== undefined
    ) {
      rect.topLeftRadius =
        (_0 = rn.topLeftRadius) !== null && _0 !== void 0 ? _0 : 0;
      rect.topRightRadius =
        (_1 = rn.topRightRadius) !== null && _1 !== void 0 ? _1 : 0;
      rect.bottomRightRadius =
        (_2 = rn.bottomRightRadius) !== null && _2 !== void 0 ? _2 : 0;
      rect.bottomLeftRadius =
        (_3 = rn.bottomLeftRadius) !== null && _3 !== void 0 ? _3 : 0;
    }
    node = rect;
  }
  return node;
}
async function importJson(jsonString) {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (_a) {
    figma.notify("Invalid JSON", { error: true });
    return;
  }
  if (data.type !== "XDESIGN_FIGMA_EXPORT") {
    figma.notify("Not a Gimble Design export. Use Copy to Figma from the app.");
    return;
  }
  if (!data.nodes || data.nodes.length === 0) {
    figma.notify("No design data in export");
    return;
  }
  const rootJson = data.nodes[0];
  const root = await createNodeFromJson(rootJson, null);
  if (!root) {
    figma.notify("Could not create design");
    return;
  }
  root.x = figma.viewport.center.x - data.width / 2;
  root.y = figma.viewport.center.y - data.height / 2;
  figma.currentPage.appendChild(root);
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify(`Imported "${data.name}" as editable layers`);
}
figma.ui.onmessage = (msg) => {
  if (msg.type === "import-json" && msg.json) {
    importJson(msg.json)
      .then(() => figma.closePlugin())
      .catch((err) => {
        figma.notify(String(err), { error: true });
      });
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  }
};
// Pass undefined so Figma loads ui.html from manifest
figma.showUI(undefined, { width: 360, height: 320 });
