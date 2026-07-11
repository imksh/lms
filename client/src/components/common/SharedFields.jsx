import React from "react";

export const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-black uppercase tracking-wider text-base-content/40">
      {label}
    </label>
    {children}
  </div>
);

export const inputCls =
  "input input-bordered input-sm bg-base-100 rounded-xl text-sm focus:border-primary w-full";
export const textareaCls =
  "textarea textarea-bordered textarea-sm bg-base-100 rounded-xl text-sm focus:border-primary w-full resize-none";
