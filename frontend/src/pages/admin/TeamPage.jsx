import { useEffect, useState } from "react";
import { Users, User } from "lucide-react";
import api from "../../api/client";
import { loadAdminList } from "../../utils/adminDataLoad";
import AdminImagePicker, { buildTeamFormData } from "../../components/admin/AdminImagePicker";
import {
  AdminPageShell,
  AdminPanel,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminButton,
  AdminAddButton,
  AdminDeleteButton,
  AdminSaveNotice,
  AdminSaveAllButton,
  AdminEmpty,
  useRowSaveState
} from "../../components/admin/AdminUi";

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", position: "", bio: "" });
  const [newImageFile, setNewImageFile] = useState(null);
  const [pendingImages, setPendingImages] = useState({});
  const [adding, setAdding] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { states, errors, savingAll, anySaving, runSave, runSaveAll } = useRowSaveState();

  function load() {
    loadAdminList(api.get("/admin/team"), (d) => d.team, setTeam, setLoadError);
  }

  useEffect(() => {
    load();
  }, []);

  async function persistMember(member) {
    const imageFile = pendingImages[member.id];
    if (imageFile) {
      const fd = buildTeamFormData(member, imageFile);
      const { data } = await api.put(`/admin/team/${member.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (data.member) {
        setTeam((rows) => rows.map((r) => (r.id === member.id ? data.member : r)));
      }
      setPendingImages((p) => {
        const next = { ...p };
        delete next[member.id];
        return next;
      });
    } else {
      await api.put(`/admin/team/${member.id}`, {
        name: member.name,
        position: member.position,
        bio: member.bio,
        imageUrl: member.image_url || member.imageUrl,
        sortOrder: member.sort_order ?? member.sortOrder
      });
    }
  }

  async function saveMember(member) {
    await runSave(member.id, () => persistMember(member));
  }

  async function saveAllMembers() {
    await runSaveAll(team, (member) => persistMember(member));
  }

  async function addMember() {
    if (!newMember.name.trim()) return;
    setAdding(true);
    try {
      const fd = buildTeamFormData(newMember, newImageFile);
      await api.post("/admin/team", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setNewMember({ name: "", position: "", bio: "" });
      setNewImageFile(null);
      setShowAdd(false);
      load();
    } finally {
      setAdding(false);
    }
  }

  async function removeMember(id) {
    if (!confirm("Remove this team member?")) return;
    await api.delete(`/admin/team/${id}`);
    load();
  }

  return (
    <AdminPageShell
      description="Manage core leadership photos and roles. Choose images from your device — no URLs."
      loadError={loadError}
      action={
        <div className="flex flex-wrap gap-2">
          <AdminSaveAllButton
            count={team.length}
            loading={savingAll}
            disabled={!team.length || anySaving}
            onClick={saveAllMembers}
          />
          <AdminAddButton onClick={() => setShowAdd((v) => !v)}>Add member</AdminAddButton>
        </div>
      }
    >
      {showAdd ? (
        <AdminPanel title="New team member" icon={User}>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Name" required>
              <AdminInput
                value={newMember.name}
                onChange={(e) => setNewMember((m) => ({ ...m, name: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Position">
              <AdminInput
                value={newMember.position}
                onChange={(e) => setNewMember((m) => ({ ...m, position: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Bio" className="sm:col-span-2">
              <AdminTextarea
                rows={3}
                value={newMember.bio}
                onChange={(e) => setNewMember((m) => ({ ...m, bio: e.target.value }))}
              />
            </AdminField>
            <AdminImagePicker
              className="sm:col-span-2"
              label="Profile photo"
              onFileSelect={setNewImageFile}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <AdminButton onClick={addMember} loading={adding}>
              Create member
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </AdminButton>
          </div>
        </AdminPanel>
      ) : null}

      {team.length === 0 ? (
        <AdminEmpty icon={Users} title="No team members" description="Add your first leadership profile." />
      ) : (
        <div className="space-y-4">
          {team.map((member) => (
            <AdminPanel key={member.id} title={member.name || "Team member"}>
              <div className="flex flex-col gap-4 lg:flex-row">
                {member.image_url ? (
                  <img
                    src={member.image_url}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <Users size={32} />
                  </span>
                )}
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminField label="Name">
                      <AdminInput
                        value={member.name}
                        onChange={(e) =>
                          setTeam((rows) =>
                            rows.map((r) => (r.id === member.id ? { ...r, name: e.target.value } : r))
                          )
                        }
                      />
                    </AdminField>
                    <AdminField label="Position">
                      <AdminInput
                        value={member.position}
                        onChange={(e) =>
                          setTeam((rows) =>
                            rows.map((r) =>
                              r.id === member.id ? { ...r, position: e.target.value } : r
                            )
                          )
                        }
                      />
                    </AdminField>
                    <AdminImagePicker
                      className="sm:col-span-2"
                      label="Profile photo"
                      hint="Choose a new file to replace the photo"
                      currentSrc={member.image_url}
                      onFileSelect={(file) =>
                        setPendingImages((p) => ({ ...p, [member.id]: file }))
                      }
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <AdminSaveNotice status={states[member.id]} message={errors[member.id]} />
                    <div className="flex flex-wrap gap-2">
                      <AdminDeleteButton onClick={() => removeMember(member.id)} />
                      <AdminButton
                        loading={states[member.id] === "saving"}
                        onClick={() => saveMember(member)}
                      >
                        Save changes
                      </AdminButton>
                    </div>
                  </div>
                </div>
              </div>
            </AdminPanel>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
