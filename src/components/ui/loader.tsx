"use client";

import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="animate-[bounce_1s_infinite_alternate]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brlightlight-icon.webp"
          alt="Company Logo"
          className="w-[70px] max-[400px]:w-[60px] h-auto animate-[pulse_3s_ease-in-out_infinite] transition-all duration-300"
          onError={(e) => {
            e.currentTarget.src = "/images/brightlight-main-logo.webp";
          }}
        />
      </div>
    </div>
  );
};

export default Loader;
