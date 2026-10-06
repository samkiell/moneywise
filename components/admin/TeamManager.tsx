"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ITeamMember } from "@/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Edit2, Trash2, X, Users } from "lucide-react";

interface TeamManagerProps {
  initialMembers: ITeamMember[];
}

export function TeamManager({ initialMembers }: TeamManagerProps) {
  const router = useRouter();
  const [members] = useState<ITeamMember[]>(initialMembers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ITeamMember | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    photo: "",
    displayOrder: 0,
    active: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      bio: "",
      photo: "",
      displayOrder: members.length + 1,
      active: true,
    });
    setError("");
    setModalOpen(true);
  };

  const handleOpenEdit = (m: ITeamMember) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      role: m.role,
      bio: m.bio || "",
      photo: m.photo || "",
      displayOrder: m.displayOrder,
      active: m.active,
    });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingMember ? `/api/team/${editingMember._id}` : "/api/team";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to save team member.");
      }

      setModalOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this team member?")) return;
    try {
      await fetch(`/api/team/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      <div className="bg-surface border border-neutral-border rounded-lg overflow-hidden">
        {members.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-secondary">
            <Users className="w-8 h-8 text-neutral-secondary mx-auto mb-3 opacity-60" />
            <p>No editorial team members added yet.</p>
            <p className="text-xs text-neutral-secondary mt-1">
              Add chief editors, copy editors, and line editors to populate the public masthead.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-neutral-border text-xs text-neutral-secondary uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Order</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-border">
                {members.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-neutral-border flex items-center justify-center font-bold text-xs text-primary overflow-hidden">
                        {member.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          member.name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <span className="font-medium text-neutral-main">{member.name}</span>
                    </td>
                    <td className="px-6 py-4 text-neutral-secondary">{member.role}</td>
                    <td className="px-6 py-4 text-neutral-secondary">{member.displayOrder}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] font-semibold uppercase rounded ${
                          member.active ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {member.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="text-xs text-red-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface border border-neutral-border rounded-lg max-w-lg w-full p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-border mb-4">
              <h2 className="font-serif text-lg font-bold text-neutral-main">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-secondary hover:text-neutral-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-main mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bello Oluwaferanmi Enoch"
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-main mb-1">Editorial Role</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Chief Editor"
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-main mb-1">Bio (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief editorial biography..."
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Photo Upload via Cloudinary */}
              <ImageUpload
                value={formData.photo}
                onChange={(url) => setFormData((prev) => ({ ...prev, photo: url }))}
                folder="moneywise/team"
                label="Member Portrait Photo"
                description="Upload portrait photo (PNG, JPG, WebP up to 5MB)"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-main mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-white border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-medium text-neutral-main cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded border-neutral-border text-primary focus:ring-primary"
                    />
                    Active in Masthead
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-secondary hover:text-neutral-main"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-brand-dark rounded transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingMember ? "Update Member" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
