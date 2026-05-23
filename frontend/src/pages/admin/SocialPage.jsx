import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube, Link2, Share2 } from "lucide-react";
import api from "../../api/client";
import { loadAdminList } from "../../utils/adminDataLoad";
import {
  AdminPageShell,
  AdminPanel,
  AdminField,
  AdminInput,
  AdminButton,
  AdminSaveNotice,
  AdminSaveAllButton,
  useRowSaveState
} from "../../components/admin/AdminUi";

const PLATFORM_META = {
  facebook: { icon: Facebook, accent: "bg-blue-500/10 text-blue-600" },
  instagram: { icon: Instagram, accent: "bg-pink-500/10 text-pink-600" },
  youtube: { icon: Youtube, accent: "bg-red-500/10 text-red-600" },
  tiktok: { icon: Link2, accent: "bg-slate-800/10 text-slate-800" }
};

function platformIcon(platform) {
  const key = (platform || "").toLowerCase();
  return PLATFORM_META[key] || { icon: Share2, accent: "bg-slate-100 text-slate-600" };
}

export default function SocialPage() {
  const [links, setLinks] = useState([]);
  const [loadError, setLoadError] = useState("");
  const { states, errors, savingAll, anySaving, runSave, runSaveAll } = useRowSaveState();

  useEffect(() => {
    loadAdminList(api.get("/admin/social-links"), (d) => d.links, setLinks, setLoadError);
  }, []);

  async function saveLink(link) {
    await runSave(link.id, () =>
      api.put(`/admin/social-links/${link.id}`, {
        label: link.label,
        url: link.url,
        icon: link.icon,
        sortOrder: link.sort_order ?? link.sortOrder
      })
    );
  }

  async function saveAllLinks() {
    await runSaveAll(links, (link) =>
      api.put(`/admin/social-links/${link.id}`, {
        label: link.label,
        url: link.url,
        icon: link.icon,
        sortOrder: link.sort_order ?? link.sortOrder
      })
    );
  }

  return (
    <AdminPageShell
      description="Update your Facebook, Instagram, YouTube, and TikTok URLs. Save one link or use Save all."
      action={
        <AdminSaveAllButton
          count={links.length}
          loading={savingAll}
          disabled={!links.length || anySaving}
          onClick={saveAllLinks}
        />
      }
      loadError={loadError}
    >
      <AdminPanel
        title="Social platforms"
        description="One row per platform — label is shown on the site, URL is where visitors go."
        icon={Share2}
      >
        <div className="space-y-4">
          {links.map((link) => {
            const meta = platformIcon(link.platform);
            const Icon = meta.icon;
            return (
              <div
                key={link.id}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${meta.accent}`}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        {link.platform}
                      </p>
                      <p className="text-sm font-semibold text-brand-ink">{link.label}</p>
                    </div>
                  </div>
                  <AdminSaveNotice status={states[link.id]} message={errors[link.id]} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminField label="Display label">
                    <AdminInput
                      value={link.label}
                      onChange={(e) =>
                        setLinks((rows) =>
                          rows.map((r) => (r.id === link.id ? { ...r, label: e.target.value } : r))
                        )
                      }
                    />
                  </AdminField>
                  <AdminField label="Profile URL">
                    <AdminInput
                      type="url"
                      value={link.url}
                      onChange={(e) =>
                        setLinks((rows) =>
                          rows.map((r) => (r.id === link.id ? { ...r, url: e.target.value } : r))
                        )
                      }
                    />
                  </AdminField>
                </div>
                <div className="mt-4 flex justify-end">
                  <AdminButton
                    loading={states[link.id] === "saving"}
                    onClick={() => saveLink(link)}
                  >
                    Save changes
                  </AdminButton>
                </div>
              </div>
            );
          })}
        </div>
      </AdminPanel>
    </AdminPageShell>
  );
}
