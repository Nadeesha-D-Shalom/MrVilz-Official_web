import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Crown, User, Users } from "lucide-react";
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

const CORE_LEADERSHIP_SLUGS = new Set(["nadeesha", "chamidu", "pabodha", "nethmina"]);

const EMPTY_MEMBER = {
  name: "",
  position: "",
  shortDescription: "",
  isLeadership: false
};

function isLeadershipMember(member) {
  const slug = String(member.slug || "").toLowerCase();
  if (CORE_LEADERSHIP_SLUGS.has(slug)) return true;
  return (
    member.is_leadership === 1 ||
    member.is_leadership === "1" ||
    member.isLeadership === true ||
    member.isLeadership === 1
  );
}

function memberShortText(member) {
  return member.short_description || member.shortDescription || "";
}

function TeamMemberDetails({
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
    <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row">
        {member.image_url ? (
          <img src={member.image_url} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
        ) : (
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400">
            <Users size={28} />
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
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
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
    </div>
  );
}

function TeamMemberRow({
  member,
  expanded,
  onToggle,
  onChange,
  pendingImages,
  setPendingImages,
  onSave,
  onDelete,
  saveStatus,
  saveError,
  saving
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50"
        aria-expanded={expanded}
      >
        <span className="truncate font-display text-base font-bold text-brand-ink">
          {member.name || "Unnamed member"}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded ? (
        <TeamMemberDetails
          member={member}
          onChange={onChange}
          pendingImages={pendingImages}
          setPendingImages={setPendingImages}
          onSave={onSave}
          onDelete={onDelete}
          saveStatus={saveStatus}
          saveError={saveError}
          saving={saving}
        />
      ) : null}
    </div>
  );
}

function TeamMemberList({
  members,
  expandedId,
  setExpandedId,
  updateMember,
  pendingImages,
  setPendingImages,
  saveMember,
  removeMember,
  states,
  errors
}) {
  return (
    <div className="space-y-2">
      {members.map((member) => (
        <TeamMemberRow
          key={member.id}
          member={member}
          expanded={expandedId === member.id}
          onToggle={() =>
            setExpandedId((current) => (current === member.id ? null : member.id))
          }
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
  const [expandedLeadershipId, setExpandedLeadershipId] = useState(null);
  const [expandedExtendedId, setExpandedExtendedId] = useState(null);
  const { states, errors, savingAll, anySaving, runSave, runSaveAll } = useRowSaveState();

  const leadership = useMemo(
    () => team.filter(isLeadershipMember).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [team]
  );
  const extended = useMemo(
    () => team.filter((m) => !isLeadershipMember(m)).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [team]
  );

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
    const leadershipFlag = isLeadershipMember(member);
    const payload = {
      name: member.name,
      position: member.position,
      bio: member.bio,
      shortDescription: memberShortText(member),
      isLeadership: leadershipFlag,
      imageUrl: member.image_url || member.imageUrl,
      sortOrder: member.sort_order ?? member.sortOrder
    };

    if (imageFile) {
      const fd = buildTeamFormData({ ...member, ...payload, isLeadership: leadershipFlag }, imageFile);
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
      const { data } = await api.put(`/admin/team/${member.id}`, payload);
      if (data.member) {
        setTeam((rows) => rows.map((r) => (r.id === member.id ? data.member : r)));
      }
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
    if (expandedLeadershipId === id) setExpandedLeadershipId(null);
    if (expandedExtendedId === id) setExpandedExtendedId(null);
    load();
  }

  return (
    <AdminPageShell
      description="Core leadership appears on the homepage. Add extended members for the Team Members page."
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
            These four profiles are shown on the homepage. Click a name to expand and edit.
          </p>
          {leadership.length === 0 ? (
            <AdminEmpty
              icon={Crown}
              title="No leadership profiles"
              description="Refresh the page — the four core members are assigned automatically."
            />
          ) : (
            <TeamMemberList
              members={leadership}
              expandedId={expandedLeadershipId}
              setExpandedId={setExpandedLeadershipId}
              updateMember={updateMember}
              pendingImages={pendingImages}
              setPendingImages={setPendingImages}
              saveMember={saveMember}
              removeMember={removeMember}
              states={states}
              errors={errors}
            />
          )}
        </AdminPanel>
      </div>

      <div className="mt-6">
        <AdminPanel title="Extended team members" icon={Users}>
          <p className="mb-4 text-sm text-slate-600">
            Shown on the Team Members page only. Click a name to expand and edit.
          </p>
          {extended.length === 0 ? (
            <AdminEmpty
              icon={Users}
              title="No extended members yet"
              description='Use "Add team member" above to add someone to the Team Members page.'
            />
          ) : (
            <TeamMemberList
              members={extended}
              expandedId={expandedExtendedId}
              setExpandedId={setExpandedExtendedId}
              updateMember={updateMember}
              pendingImages={pendingImages}
              setPendingImages={setPendingImages}
              saveMember={saveMember}
              removeMember={removeMember}
              states={states}
              errors={errors}
            />
          )}
        </AdminPanel>
      </div>
    </AdminPageShell>
  );
}
