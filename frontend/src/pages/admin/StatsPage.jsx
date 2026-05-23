import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
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

export default function StatsPage() {
  const [stats, setStats] = useState([]);
  const [loadError, setLoadError] = useState("");
  const { states, errors, savingAll, anySaving, runSave, runSaveAll } = useRowSaveState();

  useEffect(() => {
    loadAdminList(api.get("/admin/stats"), (d) => d.stats, setStats, setLoadError);
  }, []);

  async function saveStat(stat) {
    await runSave(stat.id, () =>
      api.put(`/admin/stats/${stat.id}`, {
        label: stat.label,
        value: Number(stat.value),
        suffix: stat.suffix,
        sortOrder: stat.sort_order ?? stat.sortOrder
      })
    );
  }

  async function saveAllStats() {
    await runSaveAll(stats, (stat) =>
      api.put(`/admin/stats/${stat.id}`, {
        label: stat.label,
        value: Number(stat.value),
        suffix: stat.suffix,
        sortOrder: stat.sort_order ?? stat.sortOrder
      })
    );
  }

  return (
    <AdminPageShell
      description="Edit the four impact counters on the homepage. Save one row or use Save all."
      loadError={loadError}
      action={
        <AdminSaveAllButton
          count={stats.length}
          loading={savingAll}
          disabled={!stats.length || anySaving}
          onClick={saveAllStats}
        />
      }
    >
      <AdminPanel title="Impact statistics" icon={BarChart3}>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-brand-ink">{stat.label || "Stat"}</p>
                <AdminSaveNotice status={states[stat.id]} message={errors[stat.id]} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AdminField label="Label">
                  <AdminInput
                    value={stat.label}
                    onChange={(e) =>
                      setStats((rows) =>
                        rows.map((r) => (r.id === stat.id ? { ...r, label: e.target.value } : r))
                      )
                    }
                  />
                </AdminField>
                <AdminField label="Value">
                  <AdminInput
                    type="number"
                    value={stat.value}
                    onChange={(e) =>
                      setStats((rows) =>
                        rows.map((r) => (r.id === stat.id ? { ...r, value: e.target.value } : r))
                      )
                    }
                  />
                </AdminField>
                <AdminField label="Suffix" hint="e.g. + or K">
                  <AdminInput
                    value={stat.suffix || ""}
                    onChange={(e) =>
                      setStats((rows) =>
                        rows.map((r) => (r.id === stat.id ? { ...r, suffix: e.target.value } : r))
                      )
                    }
                  />
                </AdminField>
                <div className="flex items-end">
                  <AdminButton
                    className="w-full sm:w-auto"
                    loading={states[stat.id] === "saving"}
                    onClick={() => saveStat(stat)}
                  >
                    Save
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>
    </AdminPageShell>
  );
}
