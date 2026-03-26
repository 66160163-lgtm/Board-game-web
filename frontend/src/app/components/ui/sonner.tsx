"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const isDark = document.documentElement.classList.contains('dark');
  return (
    <Sonner
      theme={isDark ? "dark" : "light"}
      className="toaster group"
      icons={{
        error: <CircleAlert className="w-5 h-5 text-red-600" />,
        warning: <CircleAlert className="w-5 h-5 text-red-600" />,
        info: <CircleAlert className="w-5 h-5 text-red-600" />,
        success: <CircleCheck className="w-5 h-5 text-green-600" />,
      }}
      style={
        {
          "--normal-bg": isDark ? "#1f2937" : "#ffffff",
          "--normal-text": isDark ? "#f3f4f6" : "#1a1a1a",
          "--normal-border": isDark ? "#374151" : "#e5e5e5",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
