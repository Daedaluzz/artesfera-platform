import React, { Suspense } from "react";
import Projects from "./Projects";

const ProjectsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-yellow" />
      </div>
    }>
      <Projects />
    </Suspense>
  );
};

export default ProjectsPage;

export const metadata = {
  title: "Projetos | ArtEsfera",
  description: "Descubra oportunidades de colaboração e contratação na comunidade artística",
};
