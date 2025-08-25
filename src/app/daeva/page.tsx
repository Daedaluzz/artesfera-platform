
import React, { Suspense } from "react";
import Daeva from "./Daeva";

const DaevaPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">Carregando...</div>}>
      <Daeva />
    </Suspense>
  );
};

export default DaevaPage;
