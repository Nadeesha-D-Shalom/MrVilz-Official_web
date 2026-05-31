import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Trash2,
  ShoppingBag,
  Star
} from "lucide-react";
import api from "../../api/client";
import { loadAdminList } from "../../utils/adminDataLoad";
import AdminImagePicker, { buildProductFormData } from "../../components/admin/AdminImagePicker";
import LazyImage from "../../components/ui/LazyImage";
import {
  AdminPageShell,
  AdminPanel,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminButton
} from "../../components/admin/AdminUi";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Live" },
  { id: "hidden", label: "Hidden" }
];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" }
];

const emptyProduct = {
  title: "",
  description: "",
  shortDescription: "",
  price: "",
  compareAtPrice: "",
  currency: "LKR",
  category: "general",
  tags: "",
  sku: "",
  stock: 0,
  condition: "new",
  purchaseLink: "",
  isActive: true,
  isFeatured: false,
  sortOrder: 0
};

function formatPrice(amount, currency = "LKR") {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount));
}

function ProductPreviewCard({ product, compact }) {
  const image = product.imageUrl || product.image_url;
  const price = product.price;
  const compare = product.compareAtPrice ?? product.compare_at_price;
  const currency = product.currency || "LKR";

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${
        compact ? "" : "max-w-sm"
      }`}
    >
      <LazyImage
        src={image}
        alt={product.title || "Product"}
        aspectClass="aspect-square"
        className="w-full"
      />
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {product.isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
              <Star size={10} /> Featured
            </span>
          ) : null}
          {!product.isActive ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
              Hidden
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
          {product.title || "Untitled product"}
        </h3>
        {product.shortDescription ? (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.shortDescription}</p>
        ) : null}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-xl font-extrabold text-brand-red">
            {formatPrice(price, currency)}
          </span>
          {compare && Number(compare) > Number(price) ? (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(compare, currency)}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Stock: {product.stock ?? 0} · {product.condition || "new"}
        </p>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ title: "", intro: "" });
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [notice, setNotice] = useState("");

  function load() {
    loadAdminList(
      api.get("/admin/products"),
      (d) => {
        setSettings(d.settings || { title: "", intro: "" });
        return d.products;
      },
      setProducts,
      setLoadError
    );
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "active") return products.filter((p) => p.isActive);
    if (filter === "hidden") return products.filter((p) => !p.isActive);
    return products;
  }, [products, filter]);

  const selected = useMemo(
    () => products.find((p) => p.id === selectedId) || null,
    [products, selectedId]
  );

  function openNew() {
    setDraft({ ...emptyProduct });
    setImageFile(null);
    setSelectedId(null);
    setView("edit");
  }

  function openEdit(product) {
    setDraft({
      title: product.title,
      description: product.description || "",
      shortDescription: product.shortDescription || product.short_description || "",
      price: product.price,
      compareAtPrice: product.compareAtPrice ?? product.compare_at_price ?? "",
      currency: product.currency || "LKR",
      category: product.category || "general",
      tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      sku: product.sku || "",
      stock: product.stock ?? 0,
      condition: product.condition || "new",
      purchaseLink: product.purchaseLink || product.purchase_link || "",
      isActive: Boolean(product.isActive),
      isFeatured: Boolean(product.isFeatured),
      sortOrder: product.sortOrder ?? product.sort_order ?? 0
    });
    setImageFile(null);
    setSelectedId(product.id);
    setView("edit");
  }

  function openDetail(product) {
    setSelectedId(product.id);
    setView("detail");
  }

  async function saveSettings() {
    setSettingsSaving(true);
    setNotice("");
    try {
      const { data } = await api.put("/admin/marketplace-settings/page", settings);
      setSettings(data.settings);
      setNotice("Marketplace page settings saved.");
    } catch {
      setNotice("Could not save page settings.");
    } finally {
      setSettingsSaving(false);
    }
  }

  async function saveProduct() {
    if (!draft.title.trim()) {
      setNotice("Product title is required.");
      return;
    }
    if (draft.price === "" || Number(draft.price) < 0) {
      setNotice("Valid price is required.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      const payload = {
        ...draft,
        tags: draft.tags,
        price: Number(draft.price),
        compareAtPrice: draft.compareAtPrice === "" ? "" : Number(draft.compareAtPrice),
        stock: Number(draft.stock) || 0,
        sortOrder: Number(draft.sortOrder) || 0
      };
      const fd = buildProductFormData(payload, imageFile);
      if (selectedId) {
        await api.put(`/admin/products/${selectedId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await api.post("/admin/products", fd, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      setView("list");
      setSelectedId(null);
      setDraft(emptyProduct);
      setImageFile(null);
      load();
      setNotice("Product saved.");
    } catch {
      setNotice("Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(id) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await api.delete(`/admin/products/${id}`);
    if (selectedId === id) {
      setSelectedId(null);
      setView("list");
    }
    load();
    setNotice("Product deleted.");
  }

  async function toggleActive(product) {
    await api.put(`/admin/products/${product.id}`, { isActive: !product.isActive });
    load();
  }

  return (
    <AdminPageShell
      description="Manage marketplace products — add items with images, pricing, stock, and purchase links. Published items appear on the public marketplace."
      loadError={loadError}
      action={
        <AdminButton variant="dark" icon={Plus} onClick={openNew}>
          Add product
        </AdminButton>
      }
    >
      {notice ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          {notice}
        </p>
      ) : null}

      <AdminPanel title="Marketplace page header" icon={ShoppingBag}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="Page title" required>
            <AdminInput
              value={settings.title}
              onChange={(e) => setSettings((s) => ({ ...s, title: e.target.value }))}
            />
          </AdminField>
          <AdminField label="Intro" className="sm:col-span-2">
            <AdminTextarea
              rows={3}
              value={settings.intro}
              onChange={(e) => setSettings((s) => ({ ...s, intro: e.target.value }))}
            />
          </AdminField>
        </div>
        <div className="mt-4 flex justify-end">
          <AdminButton loading={settingsSaving} onClick={saveSettings}>
            Save header
          </AdminButton>
        </div>
      </AdminPanel>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
              filter === f.id
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {view === "edit" ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <AdminPanel title={selectedId ? "Edit product" : "New product"} icon={Pencil}>
            <div className="space-y-4">
              <AdminField label="Title" required>
                <AdminInput
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                />
              </AdminField>
              <AdminField label="Short description" hint="Shown on product cards">
                <AdminInput
                  value={draft.shortDescription}
                  onChange={(e) => setDraft((d) => ({ ...d, shortDescription: e.target.value }))}
                />
              </AdminField>
              <AdminField label="Full description">
                <AdminTextarea
                  rows={6}
                  value={draft.description}
                  onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                />
              </AdminField>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminField label="Price" required>
                  <AdminInput
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.price}
                    onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                  />
                </AdminField>
                <AdminField label="Compare at price" hint="Original price for discounts">
                  <AdminInput
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.compareAtPrice}
                    onChange={(e) => setDraft((d) => ({ ...d, compareAtPrice: e.target.value }))}
                  />
                </AdminField>
                <AdminField label="Currency">
                  <AdminSelect
                    value={draft.currency}
                    onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
                  >
                    <option value="LKR">LKR</option>
                    <option value="USD">USD</option>
                  </AdminSelect>
                </AdminField>
                <AdminField label="Stock">
                  <AdminInput
                    type="number"
                    min={0}
                    value={draft.stock}
                    onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))}
                  />
                </AdminField>
                <AdminField label="Category">
                  <AdminInput
                    value={draft.category}
                    onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                  />
                </AdminField>
                <AdminField label="Condition">
                  <AdminSelect
                    value={draft.condition}
                    onChange={(e) => setDraft((d) => ({ ...d, condition: e.target.value }))}
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </AdminSelect>
                </AdminField>
                <AdminField label="SKU">
                  <AdminInput
                    value={draft.sku}
                    onChange={(e) => setDraft((d) => ({ ...d, sku: e.target.value }))}
                  />
                </AdminField>
                <AdminField label="Sort order">
                  <AdminInput
                    type="number"
                    min={0}
                    value={draft.sortOrder}
                    onChange={(e) => setDraft((d) => ({ ...d, sortOrder: e.target.value }))}
                  />
                </AdminField>
              </div>
              <AdminField label="Tags" hint="Comma-separated">
                <AdminInput
                  value={draft.tags}
                  onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))}
                />
              </AdminField>
              <AdminField label="Purchase link" hint="WhatsApp, contact form, or external checkout URL">
                <AdminInput
                  value={draft.purchaseLink}
                  onChange={(e) => setDraft((d) => ({ ...d, purchaseLink: e.target.value }))}
                  placeholder="https://wa.me/..."
                />
              </AdminField>
              <AdminImagePicker
                label="Product image"
                currentSrc={selected?.imageUrl || selected?.image_url}
                onFileSelect={setImageFile}
              />
              <div className="flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Live on marketplace
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={draft.isFeatured}
                    onChange={(e) => setDraft((d) => ({ ...d, isFeatured: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Featured product
                </label>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setView(selectedId ? "detail" : "list");
                  setImageFile(null);
                }}
              >
                Cancel
              </AdminButton>
              <AdminButton loading={saving} onClick={saveProduct}>
                Save product
              </AdminButton>
            </div>
          </AdminPanel>
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Preview</p>
            <ProductPreviewCard product={{ ...draft, imageUrl: selected?.imageUrl }} />
          </div>
        </div>
      ) : view === "detail" && selected ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <ProductPreviewCard product={selected} />
          <div className="space-y-3">
            <AdminButton className="w-full" onClick={() => openEdit(selected)}>
              <Pencil size={16} className="mr-2 inline" />
              Edit
            </AdminButton>
            <AdminButton variant="secondary" className="w-full" onClick={() => toggleActive(selected)}>
              {selected.isActive ? (
                <>
                  <EyeOff size={16} className="mr-2 inline" />
                  Hide from marketplace
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-2 inline" />
                  Publish
                </>
              )}
            </AdminButton>
            <button
              type="button"
              onClick={() => removeProduct(selected.id)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              type="button"
              onClick={() => {
                setView("list");
                setSelectedId(null);
              }}
              className="w-full text-center text-sm font-semibold text-slate-500 hover:text-slate-900"
            >
              ← Back to all products
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {!filtered.length ? (
            <div className="col-span-full">
              <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
                No products yet. Add your first item to start selling.
              </p>
            </div>
          ) : (
            filtered.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <button type="button" onClick={() => openDetail(product)} className="w-full text-left">
                  <LazyImage
                    src={product.imageUrl || product.image_url}
                    alt={product.title}
                    aspectClass="aspect-[4/3]"
                  />
                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {product.isActive ? "Live" : "Hidden"}
                      </span>
                      {product.isFeatured ? (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-slate-900">
                      {product.title}
                    </h3>
                    <p className="mt-1 font-display text-lg font-extrabold text-brand-red">
                      {formatPrice(product.price, product.currency)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Stock: {product.stock ?? 0} · {product.category}
                    </p>
                  </div>
                </button>
                <div className="flex gap-2 border-t border-slate-100 p-3">
                  <button
                    type="button"
                    onClick={() => openEdit(product)}
                    className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(product)}
                    className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                  >
                    {product.isActive ? "Hide" : "Publish"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </AdminPageShell>
  );
}
