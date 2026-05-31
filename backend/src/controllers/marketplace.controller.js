const { Product } = require("../models");
const { getContentByKey, upsertContent } = require("../utils/content");
const { productPublic, productAdmin } = require("../utils/serialize");
const { isValidId, toObjectId } = require("../utils/mongoId");
const { slugify } = require("../utils/slugify");
const { productImage } = require("../middleware/uploadHashedImage");

async function getMarketplacePageSettings() {
  const data = await getContentByKey("marketplace");
  if (!data) {
    return {
      title: "Mr Vilz Marketplace",
      intro:
        "Browse eco-friendly products, merchandise, and items from our community — support conservation while you shop."
    };
  }
  return {
    title: data.title || "Mr Vilz Marketplace",
    intro: data.intro || ""
  };
}

function parseBool(value) {
  return value === true || value === "true" || value === "1" || value === 1 ? 1 : 0;
}

function parseTags(value) {
  if (Array.isArray(value)) return value.map((t) => String(t).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

async function uniqueSlug(base, excludeId = null) {
  let slug = slugify(base) || "item";
  let candidate = slug;
  let n = 1;
  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: toObjectId(excludeId) };
    const exists = await Product.findOne(query).select("_id").lean();
    if (!exists) return candidate;
    candidate = `${slug}-${n++}`;
  }
}

function applyImageFromUpload(req, target) {
  if (req.file) {
    target.image_url = productImage.publicUrlForStoredFile(req.file.filename);
  } else if (req.body.imageUrl !== undefined) {
    target.image_url = req.body.imageUrl ? String(req.body.imageUrl).trim() : null;
  }
}

async function listPublishedProducts(_req, res, next) {
  try {
    const settings = await getMarketplacePageSettings();
    const products = await Product.find({ is_active: 1 })
      .sort({ is_featured: -1, sort_order: 1, created_at: -1 })
      .lean();
    return res.json({
      marketplace: {
        ...settings,
        products: products.map((p) => productPublic(p))
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function getPublishedProduct(req, res, next) {
  try {
    const slug = String(req.params.slug || "").trim();
    if (!slug) {
      return res.status(404).json({ message: "Product not found." });
    }
    const product = await Product.findOne({ slug, is_active: 1 }).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json({ product: productPublic(product, { full: true }) });
  } catch (error) {
    return next(error);
  }
}

async function listProducts(_req, res, next) {
  try {
    const settings = await getMarketplacePageSettings();
    const products = await Product.find().sort({ sort_order: 1, created_at: -1 }).lean();
    return res.json({
      settings,
      products: products.map(productAdmin)
    });
  } catch (error) {
    return next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Product not found." });
    }
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.json({ product: productAdmin(product) });
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const title = (req.body.title || "").trim();
    const price = Number(req.body.price);
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ message: "Valid price is required." });
    }

    const slug = await uniqueSlug(req.body.slug?.trim() || title);
    const payload = {
      title,
      slug,
      description: (req.body.description || "").trim(),
      short_description: (req.body.shortDescription || req.body.short_description || "").trim(),
      price,
      compare_at_price:
        req.body.compareAtPrice !== undefined && req.body.compareAtPrice !== ""
          ? Number(req.body.compareAtPrice)
          : req.body.compare_at_price !== undefined && req.body.compare_at_price !== ""
            ? Number(req.body.compare_at_price)
            : null,
      currency: (req.body.currency || "LKR").trim().toUpperCase(),
      category: (req.body.category || "general").trim(),
      tags: parseTags(req.body.tags),
      sku: (req.body.sku || "").trim() || null,
      stock: Number(req.body.stock) || 0,
      condition: (req.body.condition || "new").trim(),
      purchase_link: (req.body.purchaseLink || req.body.purchase_link || "").trim() || null,
      is_active: parseBool(req.body.isActive ?? req.body.is_active ?? 1),
      is_featured: parseBool(req.body.isFeatured ?? req.body.is_featured ?? 0),
      sort_order: Number(req.body.sortOrder ?? req.body.sort_order) || 0
    };

    applyImageFromUpload(req, payload);

    const product = await Product.create(payload);
    return res.status(201).json({ product: productAdmin(product.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) {
      return res.status(404).json({ message: "Product not found." });
    }

    const existing = await Product.findById(oid);
    if (!existing) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (req.body.title !== undefined) existing.title = String(req.body.title).trim();
    if (req.body.slug !== undefined && req.body.slug !== "") {
      existing.slug = await uniqueSlug(req.body.slug, existing._id);
    } else if (req.body.title !== undefined && !req.body.slug) {
      existing.slug = await uniqueSlug(existing.title, existing._id);
    }
    if (req.body.description !== undefined) {
      existing.description = String(req.body.description).trim();
    }
    if (req.body.shortDescription !== undefined || req.body.short_description !== undefined) {
      existing.short_description = String(
        req.body.shortDescription ?? req.body.short_description ?? ""
      ).trim();
    }
    if (req.body.price !== undefined && req.body.price !== "") {
      existing.price = Number(req.body.price);
    }
    if (req.body.compareAtPrice !== undefined || req.body.compare_at_price !== undefined) {
      const val = req.body.compareAtPrice ?? req.body.compare_at_price;
      existing.compare_at_price = val === "" || val == null ? null : Number(val);
    }
    if (req.body.currency !== undefined) {
      existing.currency = String(req.body.currency).trim().toUpperCase();
    }
    if (req.body.category !== undefined) {
      existing.category = String(req.body.category).trim();
    }
    if (req.body.tags !== undefined) {
      existing.tags = parseTags(req.body.tags);
    }
    if (req.body.sku !== undefined) {
      existing.sku = String(req.body.sku).trim() || null;
    }
    if (req.body.stock !== undefined && req.body.stock !== "") {
      existing.stock = Number(req.body.stock);
    }
    if (req.body.condition !== undefined) {
      existing.condition = String(req.body.condition).trim();
    }
    if (req.body.purchaseLink !== undefined || req.body.purchase_link !== undefined) {
      const link = req.body.purchaseLink ?? req.body.purchase_link;
      existing.purchase_link = link ? String(link).trim() : null;
    }
    if (req.body.sortOrder !== undefined || req.body.sort_order !== undefined) {
      existing.sort_order = Number(req.body.sortOrder ?? req.body.sort_order) || 0;
    }
    if (req.body.isActive !== undefined || req.body.is_active !== undefined) {
      existing.is_active = parseBool(req.body.isActive ?? req.body.is_active);
    }
    if (req.body.isFeatured !== undefined || req.body.is_featured !== undefined) {
      existing.is_featured = parseBool(req.body.isFeatured ?? req.body.is_featured);
    }

    if (req.file) {
      productImage.deleteLocalFileIfExists(existing.image_url);
      existing.image_url = productImage.publicUrlForStoredFile(req.file.filename);
    } else if (req.body.imageUrl !== undefined) {
      existing.image_url = req.body.imageUrl ? String(req.body.imageUrl).trim() : null;
    }

    await existing.save();
    return res.json({ product: productAdmin(existing.toObject()) });
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const oid = toObjectId(req.params.id);
    if (!oid) {
      return res.status(404).json({ message: "Product not found." });
    }
    const existing = await Product.findById(oid);
    if (!existing) {
      return res.status(404).json({ message: "Product not found." });
    }
    productImage.deleteLocalFileIfExists(existing.image_url);
    await Product.deleteOne({ _id: oid });
    return res.json({ message: "Product deleted." });
  } catch (error) {
    return next(error);
  }
}

async function updateMarketplaceSettings(req, res, next) {
  try {
    const title = (req.body.title || "").trim();
    const intro = (req.body.intro || "").trim();
    if (!title) {
      return res.status(400).json({ message: "Page title is required." });
    }
    await upsertContent("marketplace", { title, intro });
    return res.json({ settings: { title, intro } });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPublishedProducts,
  getPublishedProduct,
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateMarketplaceSettings
};
