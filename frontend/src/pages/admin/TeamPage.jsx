import { useEffect, useMemo, useState } from "react";
import { Crown, User, Users } from "lucide-react";
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

const EMPTY_MEMBER = {
  name: "",
  position: "",
  shortDescription: "",
  isLeadership: false
};

function isLeadershipMember(member) {
  return member.is_leadership === 1 || member.isLeadership === true;
}

function memberShortText(member) {
  return member.short_description || member.shortDescription || "";
}

function TeamMemberEditor({
  member,
  onChange,
  pendingImages,
  setPendingImages,
  onSave,
  onDelete,
  saveStatus,
  saveError,
  saving
}) {
  const leadership = isLeadershipMember(member);

  return (
    <AdminPanel
      key={member.id}
      title={member.name || "Team member"}
      description={leadership ? "Core leadership (homepage)" : "Extended team (Team Members page)"}
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        {member.image_url ? (
          <img src={member.image_url} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
        ) : (
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <Users size={32} />
          </span>
        )}
        <div className="min-w-0 flex-1 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Name" required>
              <AdminInput
                value={member.name}
                onChange={(e) => onChange({ ...member, name: e.target.value })}
              />
            </AdminField>
            <AdminField label="Designation (position)">
              <AdminInput
                value={member.position}
                onChange={(e) => onChange({ ...member, position: e.target.value })}
              />
            </AdminField>
            <AdminField
              label={leadership ? "Bio (profile page)" : "Short description"}
              className="sm:col-span-2"
              hint={
                leadership
                  ? "Shown on the full profile page"
                  : "Brief text on the Team Members listing card"
              }
            >
              <AdminTextarea
                rows={3}
                value={leadership ? member.bio || "" : memberShortText(member) || member.bio || ""}
                onChange={(e) =>
                  onChange(
                    leadership
                      ? { ...member, bio: e.target.value }
                      : {
                          ...member,
                          short_description: e.target.value,
                          shortDescription: e.target.value
                        }
                  )
                }
              />
            </AdminField>
            <AdminImagePicker
              className="sm:col-span-2"
              label="Profile photo"
              hint="Choose a new file to replace the photo"
              currentSrc={member.image_url}
              onFileSelect={(file) => setPendingImages((p) => ({ ...p, [member.id]: file }))}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <AdminSaveNotice status={saveStatus} message={saveError} />
            <div className="flex flex-wrap gap-2">
              <AdminDeleteButton onClick={onDelete} />
              <AdminButton loading={saving} onClick={onSave}>
                Save changes
              </AdminButton>
            </div>
          </div>
        </div>
      </div>
    </AdminPanel>
  );
}

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState(EMPTY_MEMBER);
  const [newImageFile, setNewImageFile] = useState(null);
  const [pendingImages, setPendingImages] = useState({});
  const [adding, setAdding] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { states, errors, savingAll, anySaving, runSave, runSaveAll } = useRowSaveState();

  const leadership = useMemo(() => team.filter(isLeadershipMember), [team]);
  const extended = useMemo(() => team.filter((m) => !isLeadershipMember(m)), [team]);

  function load() {
    loadAdminList(api.get("/admin/team"), (d) => d.team, setTeam, setLoadError);
  }

  useEffect(() => {
    load();
  }, []);

  function updateMember(member) {
    setTeam((rows) => rows.map((r) => (r.id === member.id ? member : r)));
  }

  async function persistMember(member) {
    const imageFile = pendingImages[member.id];
    const payload = {
      name: member.name,
      position: member.position,
      bio: member.bio,
      shortDescription: memberShortText(member),
      isLeadership: isLeadershipMember(member),
      imageUrl: member.image_url || member.imageUrl,
      sortOrder: member.sort_order ?? member.sortOrder
    };

    if (imageFile) {
      const fd = buildTeamFormData({ ...member, ...payload, isLeadership: payload.isLeadership }, imageFile);
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
      await api.put(`/admin/team/${member.id}`, payload);
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
      const fd = buildTeamFormData(
        {
          ...newMember,
          bio: newMember.shortDescription,
          isLeadership: false
        },
        newImageFile
      );
      await api.post("/admin/team", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setNewMember(EMPTY_MEMBER);
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
      description="Core leadership appears on the homepage. Add extended members for the Team Members page (name, designation, short description)."
      loadError={loadError}
      action={
        <div className="flex flex-wrap gap-2">
          <AdminSaveAllButton
            count={team.length}
            loading={savingAll}
            disabled={!team.length || anySaving}
            onClick={saveAllMembers}
          />
          <AdminAddButton onClick={() => setShowAdd((v) => !v)}>Add team member</AdminAddButton>
        </div>
      }
    >
      {showAdd ? (
        <AdminPanel
          title="New team member"
          description="Added to the public Team Members page (not core leadership)."
          icon={User}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Name" required>
              <AdminInput
                value={newMember.name}
                onChange={(e) => setNewMember((m) => ({ ...m, name: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Designation (position)">
              <AdminInput
                value={newMember.position}
                onChange={(e) => setNewMember((m) => ({ ...m, position: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Short description" className="sm:col-span-2">
              <AdminTextarea
                rows={3}
                value={newMember.shortDescription}
                onChange={(e) => setNewMember((m) => ({ ...m, shortDescription: e.target.value }))}
                placeholder="A brief line for their card on the Team Members page"
              />
            </AdminField>
            <AdminImagePicker
              className="sm:col-span-2"
              label="Profile photo (optional)"
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

      <div className="mt-6">
      <AdminPanel title="Core leadership" icon={Crown}>
        <p className="mb-4 text-sm text-slate-600">
          These four profiles are shown on the homepage. Edit photos and roles here; they are not
          listed on the Team Members page.
        </p>
        {leadership.length === 0 ? (
          <AdminEmpty icon={Crown} title="No leadership profiles" description="Seed or add leadership members." />
        ) : (
          <div className="space-y-4">
            {leadership.map((member) => (
              <TeamMemberEditor
                key={member.id}
                member={member}
                onChange={updateMember}
                pendingImages={pendingImages}
                setPendingImages={setPendingImages}
                onSave={() => saveMember(member)}
                onDelete={() => removeMember(member.id)}
                saveStatus={states[member.id]}
                saveError={errors[member.id]}
                saving={states[member.id] === "saving"}
              />
            ))}
          </div>
        )}
      </AdminPanel>
      </div>

      <div className="mt-6">
      <AdminPanel title="Extended team members" icon={Users}>
        <p className="mb-4 text-sm text-slate-600">
          Shown on the Team Members page only. Use a short description for each card.
        </p>
        {extended.length === 0 ? (
          <AdminEmpty
            icon={Users}
            title="No extended members yet"
            description='Click "Add team member" above to publish someone on the Team Members page.'
          />
        ) : (
          <div className="space-y-4">
            {extended.map((member) => (
              <TeamMemberEditor
                key={member.id}
                member={member}
                onChange={updateMember}
                pendingImages={pendingImages}
                setPendingImages={setPendingImages}
                onSave={() => saveMember(member)}
                onDelete={() => removeMember(member.id)}
                saveStatus={states[member.id]}
                saveError={errors[member.id]}
                saving={states[member.id] === "saving"}
              />
            ))}
          </div>
        )}
      </AdminPanel>
      </div>
    </AdminPageShell>
  );
}
