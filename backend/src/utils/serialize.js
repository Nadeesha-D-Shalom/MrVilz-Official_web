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
    imageUrl: o.image_url
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
  return {
    id: o.id,
    title: o.title,
    caption: o.caption,
    imageUrl: o.image_url,
    category: o.category
  };
}

module.exports = {
  withId,
  withIdList,
  statPublic,
  statAdmin,
  socialPublic,
  teamPublic,
  projectPublic,
  careerPostPublic,
  careerPostAdmin,
  messageAdmin,
  teamAppAdmin,
  jobAppAdmin,
  galleryPublic
};
