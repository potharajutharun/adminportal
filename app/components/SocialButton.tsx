import React from "react";

type Props = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
};

export default function SocialButton({
  label,
  onClick,
  icon,
  className,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center justify-center gap-3 w-full py-2 rounded-md border text-sm font-medium " +
        (className || "")
      }
      type="button"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
