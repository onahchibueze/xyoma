import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
}

export default function SectionWrapper({
  children,
  id,
  className = "",
  containerClassName = "",
  fullWidth = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative w-full py-16 md:py-24 lg:py-32 overflow-hidden ${className}`}
    >
      <div
        className={`mx-auto px-6 md:px-12 lg:px-20 ${
          fullWidth ? "w-full" : "max-w-screen-2xl"
        } ${containerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
