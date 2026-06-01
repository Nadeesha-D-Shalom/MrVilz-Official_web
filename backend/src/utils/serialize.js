function baseId(doc) {
  if (!doc) return null;
  const id = doc._id ?? doc.id;
  return id ? String(id) : null;
}

function withId(doc) {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject() : { ...doc };
  const id = baseId(o);
  delete o._id;
  delete o.__v;
  return { id, ...o };
}

function withIdList(docs) {
  return (docs || []).map((d) => withId(d));
}

function statPublic(doc) {
  const o = withId(doc);
  if (!o) return null;
  return {
    id: o.id,
    statKey: o.stat_key,
    label: o.label,
    value: o.value,
    suffix: o.suffix
  };
}

function statAdmin(doc) {
  const o = withId(doc);
  if (!o) return null;
  return {
    id: o.id,
    statKey: o.stat_key,
    label: o.label,
    value: o.value,
    suffix: o.suffix,
    sortOrder: o.sort_order,
    isActive: Boolean(o.is_active)
  };
}

function socialPublic(doc) {
  const o = withId(doc);
  if (!o) return null;
  return {
    id: o.id,
    platform: o.platform,
    label: o.label,
    url: o.url,
    icon: o.icon
  };
}

function teamPublic(doc) {
  const o = withId(doc);
  if (!o) return null;
  return {
    id: o.id,
    name: o.name,
    slug: o.slug,
    position: o.position,
    bio: o.bio,
    shortDescription: o.short_description || null,
    imageUrl: o.image_url,
    isLeadership: o.is_leadership === 1
  };
}

function teamAdmin(doc) {
  const o = withId(doc);
  if (!o) return null;
  const leadership = o.is_leadership === 1;
  return {
    id: o.id,
    name: o.name,
    slug: o.slug,
    position: o.position,
    bio: o.bio,
    short_description: o.short_description || null,
    shortDescription: o.short_description || null,
    image_url: o.image_url,
    imageUrl: o.image_url,
    sort_order: o.sort_order,
    sortOrder: o.sort_order,
    is_active: o.is_active,
    is_leadership: o.is_leadership ?? 0,
    isLeadership: leadership
  };
}

function projectPublic(doc) {
  const o = withId(doc);
  if (!o) return null;
  let highlights = o.highlights;
  if (typeof highlights === "string") {
    try {
      highlights = JSON.parse(highlights);
    } catch {
      highlights = [];
    }
  }
  return {
    id: o.id,
    title: o.title,
    summary: o.summary,
    progress: o.progress,
    imageUrl: o.image_url,
    visualLayout: o.visual_layout,
    highlights: highlights || []
  };
}

function careerPostPublic(doc) {
  const o = withId(doc);
  if (!o) return null;
  return {
    id: o.id,
    title: o.title,
    description: o.description,
    roleType: o.role_type,
    sortOrder: o.sort_order,
    createdAt: o.created_at
  };
}

function careerPostAdmin(doc) {
  const o = withId(doc);
  if (!o) return null;
  return {
    id: o.id,
    title: o.title,
    description: o.description,
    roleType: o.role_type,
    isPublished: Boolean(o.is_published),
    sortOrder: o.sort_order,
    createdAt: o.created_at,
    updatedAt: o.updated_at
  };
}

function messageAdmin(doc) {
  const o = withId(doc);
  if (!o) return null;
  return {
    id: o.id,
    name: o.name,
    email: o.email,
    phone: o.phone,
    subject: o.subject,
    message: o.message,
    status: o.status,
    createdAt: o.created_at
  };
}

function teamAppAdmin(doc) {
  const o = withId(doc);
  if (!o) return null;
  return {
    id: o.id,
    fullName: o.full_name,
    email: o.email,
    phone: o.phone,
    address: o.address,
    city: o.city,
    age: o.age,
    gender: o.gender,
    message: o.message,
    status: o.status,
    createdAt: o.created_at
  };
}

function jobAppAdmin(doc) {
  const o = withId(doc);
  if (!o) return null;
  return {
    id: o.id,
    jobTitle: o.job_title,
    fullName: o.full_name,
    email: o.email,
    phone: o.phone,
    address: o.address,
    city: o.city,
    age: o.age,
    gender: o.gender,
    linkedinUrl: o.linkedin_url,
    portfolioUrl: o.portfolio_url,
    currentRole: o.current_role,
    experienceYears: o.experience_years,
    coverLetter: o.cover_letter,
    cvFilename: o.cv_filename,
    cvUrl: o.cv_url,
    additionalDocUrl: o.additional_doc_url,
    additionalInfo: o.additional_info,
    status: o.status,
    createdAt: o.created_at
  };
}

function galleryPublic(doc) {
  const o = withId(doc);
  if (!o) return null;
  const { resolveMediaUrl } = require("./mediaUrl");
  return {
    id: o.id,
    title: o.title,
    caption: o.caption,
    imageUrl: resolveMediaUrl(o.image_url),
    altText: o.alt_text || o.title,
    category: o.category
  };
}

function productPublic(doc, { full = false } = {}) {
  const o = withId(doc);
  if (!o) return null;
  const { resolveMediaUrl } = require("./mediaUrl");
  const base = {
    id: o.id,
    title: o.title,
    slug: o.slug,
    shortDescription: o.short_description || "",
    price: o.price,
    compareAtPrice: o.compare_at_price,
    currency: o.currency || "LKR",
    imageUrl: resolveMediaUrl(o.image_url),
    category: o.category || "general",
    stock: o.stock ?? 0,
    condition: o.condition || "new",
    isFeatured: o.is_featured === 1,
    inStock: (o.stock ?? 0) > 0
  };
  if (full) {
    return {
      ...base,
      description: o.description || "",
      tags: o.tags || [],
      sku: o.sku || null,
      purchaseLink: o.purchase_link || null
    };
  }
  return base;
}

function productAdmin(doc) {
  const o = withId(doc);
  if (!o) return null;
  const { resolveMediaUrl } = require("./mediaUrl");
  const imageUrl = resolveMediaUrl(o.image_url);
  return {
    id: o.id,
    title: o.title,
    slug: o.slug,
    description: o.description || "",
    short_description: o.short_description || "",
    shortDescription: o.short_description || "",
    price: o.price,
    compare_at_price: o.compare_at_price,
    compareAtPrice: o.compare_at_price,
    currency: o.currency || "LKR",
    image_url: imageUrl,
    imageUrl,
    category: o.category || "general",
    tags: o.tags || [],
    sku: o.sku || "",
    stock: o.stock ?? 0,
    condition: o.condition || "new",
    purchase_link: o.purchase_link || "",
    purchaseLink: o.purchase_link || "",
    is_active: o.is_active,
    isActive: Boolean(o.is_active),
    is_featured: o.is_featured ?? 0,
    isFeatured: o.is_featured === 1,
    sort_order: o.sort_order,
    sortOrder: o.sort_order,
    createdAt: o.created_at,
    updatedAt: o.updated_at
  };
}

module.exports = {
  withId,
  withIdList,
  statPublic,
  statAdmin,
  socialPublic,
  teamPublic,
  teamAdmin,
  projectPublic,
  careerPostPublic,
  careerPostAdmin,
  messageAdmin,
  teamAppAdmin,
  jobAppAdmin,
  galleryPublic,
  productPublic,
  productAdmin
};
