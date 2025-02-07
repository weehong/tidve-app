"use client";

import { useState } from "react";

import ActionDialog from "@/components/modal/ActionDialog";

export default function Dialog() {
  const [open, setOpen] = useState(true);

  const onConfirm = () => {
    alert("Confirm");
  };

  return (
    <ActionDialog
      title="Payment successful"
      description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius aliquam laudantium explicabo pariatur iste dolorem animi vitae error totam. At sapiente aliquam accusamus facere veritatis."
      open={open}
      onClose={() => setOpen(false)}
      onConfirmButtonLabel="Confirm"
      onConfirm={onConfirm}
    />
  );
}
