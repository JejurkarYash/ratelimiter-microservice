"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X } from "lucide-react";
import axiosClient from "@/services/axios";

const SettingsPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [error, setError] = useState("");

  const handleDeleteProject = async () => {
    if (deleteConfirmation !== "DELETE") {
      setError('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await axiosClient.delete(`/tenant/projects/${projectId}`);
      setIsDeleteDialogOpen(false);
      // Redirect to dashboard after successful deletion
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (err: any) {
      console.error("Error deleting project:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete project. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteConfirmation("");
    setError("");
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
            Project Settings
          </h1>
          <p className="text-sm text-white/50">
            Manage your project configuration and preferences.
          </p>
        </div>
      </div>

      {/* Settings Container */}
      <div className="space-y-6">
        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="text-red-400" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-red-400 mb-2">
                Danger Zone
              </h2>
              <p className="text-sm text-white/60 mb-6">
                Irreversible and destructive actions.
              </p>

              {/* Delete Project Section */}
              <div className="bg-black/20 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-1">
                      Delete Project
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Once you delete a project, there is no going back. Please
                      be certain. This will permanently delete:
                    </p>
                    <ul className="text-xs text-white/40 mt-3 space-y-1 ml-4">
                      <li>• All API keys associated with this project</li>
                      <li>• All rate limiting rules</li>
                      <li>• All usage logs and analytics data</li>
                      <li>• All historical data</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-red-500/30 hover:border-red-500/50 cursor-pointer flex-shrink-0 whitespace-nowrap"
                  >
                    <Trash2 size={16} />
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0a0a0b] border border-white/10 rounded-2xl max-w-md w-full shadow-xl animate-in scale-in duration-300">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="text-red-400" size={20} />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Delete Project?
                </h2>
              </div>
              <button
                onClick={closeDialog}
                disabled={isDeleting}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white/60"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dialog Body */}
            <div className="p-6 space-y-4">
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                <p className="text-sm text-white/80 leading-relaxed">
                  This action{" "}
                  <span className="font-semibold text-red-400">
                    cannot be undone
                  </span>
                  . This will permanently delete your project and all associated
                  data including:
                </p>
                <ul className="text-xs text-white/60 mt-3 space-y-2 ml-4">
                  <li>• API keys</li>
                  <li>• Rate limiting rules</li>
                  <li>• All logs and analytics</li>
                </ul>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-white/80">
                  Type{" "}
                  <span className="font-mono font-semibold text-red-400">
                    DELETE
                  </span>{" "}
                  to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => {
                    setDeleteConfirmation(e.target.value);
                    setError("");
                  }}
                  placeholder="Type DELETE..."
                  disabled={isDeleting}
                  className="w-full bg-[#19191a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Dialog Footer */}
            <div className="flex gap-3 p-6 border-t border-white/5">
              <button
                onClick={closeDialog}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 font-medium text-sm transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={isDeleting || deleteConfirmation !== "DELETE"}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium text-sm transition-all border border-red-500/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
