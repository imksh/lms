import React from "react";

const RoleBadge = ({ role }) => {
  const cls =
    role === "admin"
      ? "badge-error"
      : role === "teacher"
        ? "badge-warning"
        : "badge-info";
  return (
    <span className={`badge badge-sm badge-soft font-bold uppercase ${cls}`}>
      {role}
    </span>
  );
};

export default RoleBadge;
