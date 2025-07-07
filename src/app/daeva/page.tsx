import React, { Suspense } from "react";
import { Sparkles } from "lucide-react";
import Daeva from "./Daeva";

const DaevaLoadingFallback = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-yellow/10 via-transparent to-brand-navy-blue/10 dark:from-brand-yellow/5 dark:via-transparent dark:to-brand-navy-blue/5">
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/[0.12] dark:bg-white/[0.06] backdrop-blur-[12px] border border-white/[0.2] dark:border-white/[0.12] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_0_15px_8px_rgba(255,255,255,0.04)]">
            <Sparkles className="w-8 h-8 text-brand-navy-blue dark:text-brand-yellow animate-pulse" />
          </div>
          <p className="text-sm text-brand-black/70 dark:text-brand-white/70">
            Carregando Daeva...
          </p>
        </div>
      </div>
    </div>
  );
};

const DaevaPage = () => {
  return (
    <Suspense fallback={<DaevaLoadingFallback />}>
      <Daeva />
    </Suspense>
  );
};

export default DaevaPage;
