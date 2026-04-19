import api from "./api.js";
import { absoluteUrlForUploadPath } from "../config/staticAssetBase.js";

/** Public: get all active products */
export async function getProducts() {
  const { data } = await api.get("/api/v1/shop/products");
  if (!data.success) throw new Error(data.message || "Failed to fetch products");
  return data.data;
}

/** Public: get one product by id or slug */
export async function getProductByIdOrSlug(idOrSlug) {
  const { data } = await api.get(`/api/v1/shop/products/${encodeURIComponent(idOrSlug)}`);
  if (!data.success) throw new Error(data.message || "Failed to fetch product");
  return data.data;
}

/** Public: create checkout (optional auth). Returns { orderId, checkoutUrl }. */
export async function createCheckout(payload) {
  const { data } = await api.post("/api/v1/shop/checkout", payload);
  if (!data.success) throw new Error(data.message || "Checkout failed");
  return data.data;
}

/** Normalize DB/API quirks: JSON column as string, nested JSON, etc. */
export function normalizeShopImages(images) {
  if (images == null) return [];
  const parseMaybe = (val) => {
    if (typeof val !== "string") return val;
    const t = val.trim();
    if (!t.startsWith("[")) return val;
    try {
      const parsed = JSON.parse(t);
      return Array.isArray(parsed) ? parsed : val;
    } catch {
      return val;
    }
  };
  if (Array.isArray(images)) {
    const out = [];
    for (const entry of images) {
      if (entry == null) continue;
      if (typeof entry === "string") {
        const inner = parseMaybe(entry);
        if (Array.isArray(inner)) {
          for (const x of inner) {
            if (x != null && String(x).trim()) out.push(String(x).trim());
          }
        } else if (String(inner).trim()) {
          out.push(String(inner).trim());
        }
      } else {
        out.push(String(entry).trim());
      }
    }
    return out.filter(Boolean);
  }
  if (typeof images === "string") {
    const inner = parseMaybe(images);
    if (Array.isArray(inner)) {
      return inner.map((x) => String(x).trim()).filter(Boolean);
    }
    return images.trim() ? [images.trim()] : [];
  }
  return [];
}

/** URL for shop product images (uploads served at backend root, not under /api). */
export function getShopImageUrl(path) {
  return absoluteUrlForUploadPath(path);
}

// ——— Admin (requires auth) ———

export async function adminListProducts(params = {}) {
  const { data } = await api.get("/api/v1/admin/shop/products", { params });
  if (!data.success) throw new Error(data.message || "Failed to list products");
  return data.data;
}

export async function adminGetProduct(id) {
  const { data } = await api.get(`/api/v1/admin/shop/products/${id}`);
  if (!data.success) throw new Error(data.message || "Failed to get product");
  return data.data;
}

export async function adminCreateProduct(body) {
  const { data } = await api.post("/api/v1/admin/shop/products", body);
  if (!data.success) throw new Error(data.message || "Failed to create product");
  return data.data;
}

export async function adminUpdateProduct(id, body) {
  const { data } = await api.put(`/api/v1/admin/shop/products/${id}`, body);
  if (!data.success) throw new Error(data.message || "Failed to update product");
  return data.data;
}

export async function adminDeleteProduct(id) {
  const { data } = await api.delete(`/api/v1/admin/shop/products/${id}`);
  if (!data.success) throw new Error(data.message || "Failed to delete product");
  return data;
}

/** Upload one image; returns { path } (e.g. /uploads/shop/xxx.jpg). Use FormData with field "image". */
export async function adminUploadShopImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/api/v1/admin/shop/upload-image", formData);
  if (!data.success) throw new Error(data.message || "Upload failed");
  return data.data.path;
}

export async function adminListOrders(params = {}) {
  const { data } = await api.get("/api/v1/admin/shop/orders", { params });
  if (!data.success) throw new Error(data.message || "Failed to list orders");
  return { orders: data.data, total: data.total };
}

export async function adminGetOrder(id) {
  const { data } = await api.get(`/api/v1/admin/shop/orders/${id}`);
  if (!data.success) throw new Error(data.message || "Failed to get order");
  return data.data;
}
