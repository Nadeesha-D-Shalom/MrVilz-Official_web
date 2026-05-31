const { mongoose } = require("../config/db");

const ts = {
  createdAt: "created_at",
  updatedAt: "updated_at"
};

const SiteContent = mongoose.model(
  "SiteContent",
  new mongoose.Schema(
    {
      content_key: { type: String, required: true, unique: true },
      content_json: { type: mongoose.Schema.Types.Mixed, required: true }
    },
    { timestamps: ts }
  )
);

const SiteStat = mongoose.model(
  "SiteStat",
  new mongoose.Schema(
    {
      stat_key: { type: String, required: true, unique: true },
      label: String,
      value: Number,
      suffix: { type: String, default: "" },
      sort_order: { type: Number, default: 0 },
      is_active: { type: Number, default: 1 }
    },
    { timestamps: { updatedAt: "updated_at", createdAt: false } }
  )
);

const SocialLink = mongoose.model(
  "SocialLink",
  new mongoose.Schema(
    {
      platform: String,
      label: String,
      url: String,
      icon: String,
      sort_order: { type: Number, default: 0 },
      is_active: { type: Number, default: 1 }
    },
    { timestamps: ts }
  )
);

const TeamMember = mongoose.model(
  "TeamMember",
  new mongoose.Schema(
    {
      name: String,
      slug: { type: String, unique: true, sparse: true },
      position: String,
      bio: String,
      short_description: String,
      image_url: String,
      sort_order: { type: Number, default: 0 },
      is_leadership: { type: Number, default: 0 },
      is_active: { type: Number, default: 1 }
    },
    { timestamps: ts }
  )
);

const Project = mongoose.model(
  "Project",
  new mongoose.Schema(
    {
      title: String,
      summary: String,
      progress: { type: Number, default: 0 },
      image_url: String,
      visual_layout: { type: String, default: "landscape" },
      highlights: { type: mongoose.Schema.Types.Mixed, default: [] },
      sort_order: { type: Number, default: 0 },
      is_active: { type: Number, default: 1 }
    },
    { timestamps: ts }
  )
);

const ContactMessage = mongoose.model(
  "ContactMessage",
  new mongoose.Schema(
    {
      name: String,
      email: String,
      phone: String,
      subject: String,
      message: String,
      status: { type: String, default: "new" }
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
  )
);

const GalleryItem = mongoose.model(
  "GalleryItem",
  new mongoose.Schema(
    {
      title: String,
      caption: String,
      image_url: String,
      file_hash: String,
      category: { type: String, default: "general" },
      sort_order: { type: Number, default: 0 },
      is_active: { type: Number, default: 1 }
    },
    { timestamps: ts }
  )
);

const TeamApplication = mongoose.model(
  "TeamApplication",
  new mongoose.Schema(
    {
      full_name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      age: Number,
      gender: String,
      message: String,
      status: { type: String, default: "new" }
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
  )
);

const CareerPost = mongoose.model(
  "CareerPost",
  new mongoose.Schema(
    {
      title: String,
      description: String,
      role_type: String,
      is_published: { type: Number, default: 0 },
      sort_order: { type: Number, default: 0 }
    },
    { timestamps: ts }
  )
);

const JobApplication = mongoose.model(
  "JobApplication",
  new mongoose.Schema(
    {
      job_title: String,
      full_name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      age: Number,
      gender: String,
      linkedin_url: String,
      portfolio_url: String,
      current_role: String,
      experience_years: Number,
      cover_letter: String,
      cv_filename: String,
      cv_url: String,
      additional_doc_filename: String,
      additional_doc_url: String,
      additional_info: String,
      status: { type: String, default: "new" }
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } }
  )
);

const Admin = mongoose.model(
  "Admin",
  new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      password_hash: { type: String, required: true },
      display_name: String,
      email: String,
      phone: String,
      address: String,
      role: { type: String, enum: ["admin", "super_admin"], default: "admin" },
      is_active: { type: Number, default: 1 }
    },
    { timestamps: ts }
  )
);

const Product = mongoose.model(
  "Product",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      slug: { type: String, unique: true, sparse: true },
      description: String,
      short_description: String,
      price: { type: Number, required: true, min: 0 },
      compare_at_price: { type: Number, default: null },
      currency: { type: String, default: "LKR" },
      image_url: String,
      category: { type: String, default: "general" },
      tags: { type: [String], default: [] },
      sku: String,
      stock: { type: Number, default: 0 },
      condition: { type: String, default: "new" },
      purchase_link: String,
      is_active: { type: Number, default: 1 },
      is_featured: { type: Number, default: 0 },
      sort_order: { type: Number, default: 0 }
    },
    { timestamps: ts }
  )
);

module.exports = {
  SiteContent,
  SiteStat,
  SocialLink,
  TeamMember,
  Project,
  ContactMessage,
  GalleryItem,
  TeamApplication,
  CareerPost,
  JobApplication,
  Admin,
  Product
};
