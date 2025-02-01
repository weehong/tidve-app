"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import DeleteDialog from "@/component/Dialog/DeleteDialog";
import { deleteProfile } from "@/lib/api/profile";

export default function ProfilePage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    await deleteProfile();
    router.push("/auth/logout");
  };

  return (
    <div className="flex flex-col gap-4">
      <DeleteDialog
        title="Delete Account"
        description="This action will delete your account and all associated data. This action is irreversible."
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAction={handleDelete}
      />
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="flex flex-col gap-4">
        <p>This action will delete your account and all associated data.</p>
      </div>

      <div className="flex flex-col justify-end gap-2">
        <div className="flex flex-row gap-4">
          <button
            className="rounded-md bg-red-500 px-4 py-2 text-white"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Close Account
          </button>
        </div>
      </div>
    </div>
  );
}
