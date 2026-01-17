import React from "react";

const DiagonalLinesDiv = () => {
  // Generate diagonal lines
  

  return (
    <div className="relative w-full min-h-screen bg-gray-900 overflow-hidden">
      {/* Diagonal lines container */}
      <div className="absolute inset-0 rotate-25 origin-center">
        <div className="relative w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4">
         
        </div>
      </div>
    </div>
  );
};

export default DiagonalLinesDiv;
