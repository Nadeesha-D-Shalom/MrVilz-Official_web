import { useEffect, useState } from "react";
import { FolderKanban } from "lucide-react";
import api from "../../api/client";
import { loadAdminList } from "../../utils/adminDataLoad";
import AdminImagePicker, { buildProjectFormData } from "../../components/admin/AdminImagePicker";
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", summary: "", progress: 0 });
  const [newImageFile, setNewImageFile] = useState(null);
  const [pendingImages, setPendingImages] = useState({});
  const [adding, setAdding] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { states, errors, savingAll, anySaving, runSave, runSaveAll } = useRowSaveState();

  function load() {
    loadAdminList(api.get("/admin/projects"), (d) => d.projects, setProjects, setLoadError);
  }

  useEffect(() => {
    load();
  }, []);

  async function persistProject(project) {
    const imageFile = pendingImages[project.id];
    if (imageFile) {
      const fd = buildProjectFormData(project, imageFile);
      const { data } = await api.put(`/admin/projects/${project.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (data.project) {
        setProjects((rows) => rows.map((r) => (r.id === project.id ? data.project : r)));
      }
      setPendingImages((p) => {
        const next = { ...p };
        delete next[project.id];
        return next;
      });
    } else {
      let highlights = project.highlights;
      if (typeof highlights === "string") {
        highlights = highlights.split(",").map((s) => s.trim()).filter(Boolean);
      }
      await api.put(`/admin/projects/${project.id}`, {
        title: project.title,
        summary: project.summary,
        progress: Number(project.progress),
        imageUrl: project.image_url || project.imageUrl,
        visualLayout: project.visual_layout || project.visualLayout,
        highlights
      });
    }
  }

  async function saveProject(project) {
    await runSave(project.id, () => persistProject(project));
  }

  async function saveAllProjects() {
    await runSaveAll(projects, (project) => persistProject(project));
  }

  async function addProject() {
    if (!newProject.title.trim()) return;
    setAdding(true);
    try {
      const fd = buildProjectFormData(newProject, newImageFile);
      await api.post("/admin/projects", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setNewProject({ title: "", summary: "", progress: 0 });
      setNewImageFile(null);
      setShowAdd(false);
      load();
    } finally {
      setAdding(false);
    }
  }

  async function removeProject(id) {
    if (!confirm("Remove this project?")) return;
    await api.delete(`/admin/projects/${id}`);
    load();
  }

  return (
    <AdminPageShell
      description="Edit homepage project cards — e.g. Clean Panadura Beach Sri Lanka. Choose an image from your device; files are stored with hashed names."
      loadError={loadError}
      action={
        <div className="flex flex-wrap gap-2">
          <AdminSaveAllButton
            count={projects.length}
            loading={savingAll}
            disabled={!projects.length || anySaving}
            onClick={saveAllProjects}
          />
          <AdminAddButton onClick={() => setShowAdd((v) => !v)}>Add project</AdminAddButton>
        </div>
      }
    >
      {showAdd ? (
        <AdminPanel title="New project" icon={FolderKanban}>
          <div className="grid gap-4">
            <AdminField label="Title" required>
              <AdminInput
                placeholder="e.g. Clean Panadura Beach Sri Lanka"
                value={newProject.title}
                onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Summary">
              <AdminTextarea
                rows={3}
                value={newProject.summary}
                onChange={(e) => setNewProject((p) => ({ ...p, summary: e.target.value }))}
              />
            </AdminField>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminField label="Progress %">
                <AdminInput
                  type="number"
                  min="0"
                  max="100"
                  value={newProject.progress}
                  onChange={(e) => setNewProject((p) => ({ ...p, progress: e.target.value }))}
                />
              </AdminField>
              <AdminImagePicker
                label="Project image"
                hint="Optional — JPG, PNG, WebP, GIF"
                onFileSelect={setNewImageFile}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <AdminButton onClick={addProject} loading={adding}>
              Create project
            </AdminButton>
            <AdminButton variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </AdminButton>
          </div>
        </AdminPanel>
      ) : null}

      {projects.length === 0 ? (
        <AdminEmpty
          icon={FolderKanban}
          title="No projects"
          description="Add your first campaign or project card."
        />
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <AdminPanel key={project.id} title={project.title || "Project"}>
              <div className="grid gap-4 lg:grid-cols-[120px_1fr]">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt=""
                    className="aspect-video w-full rounded-xl object-cover lg:aspect-square"
                  />
                ) : null}
                <div className="grid gap-4">
                  <AdminField label="Title">
                    <AdminInput
                      value={project.title}
                      onChange={(e) =>
                        setProjects((rows) =>
                          rows.map((r) => (r.id === project.id ? { ...r, title: e.target.value } : r))
                        )
                      }
                    />
                  </AdminField>
                  <AdminField label="Summary">
                    <AdminTextarea
                      rows={3}
                      value={project.summary || ""}
                      onChange={(e) =>
                        setProjects((rows) =>
                          rows.map((r) => (r.id === project.id ? { ...r, summary: e.target.value } : r))
                        )
                      }
                    />
                  </AdminField>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AdminField label="Progress %">
                      <AdminInput
                        type="number"
                        min="0"
                        max="100"
                        value={project.progress}
                        onChange={(e) =>
                          setProjects((rows) =>
                            rows.map((r) =>
                              r.id === project.id ? { ...r, progress: e.target.value } : r
                            )
                          )
                        }
                      />
                    </AdminField>
                    <AdminImagePicker
                      label="Project image"
                      hint="Choose a new file to replace the current photo"
                      currentSrc={project.image_url}
                      onFileSelect={(file) =>
                        setPendingImages((p) => ({ ...p, [project.id]: file }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <AdminSaveNotice status={states[project.id]} message={errors[project.id]} />
                <div className="flex flex-wrap gap-2">
                  <AdminDeleteButton onClick={() => removeProject(project.id)} />
                  <AdminButton
                    loading={states[project.id] === "saving"}
                    onClick={() => saveProject(project)}
                  >
                    Save changes
                  </AdminButton>
                </div>
              </div>
            </AdminPanel>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
