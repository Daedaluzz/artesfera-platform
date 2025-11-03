import { parseProjectSlug } from "@/lib/firestoreProjects";
import ProjectDetail from "./ProjectDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const { id } = parseProjectSlug(slug);

  return <ProjectDetail projectId={id} />;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { id } = parseProjectSlug(slug);

  // In a real app, you'd fetch the project data here
  // Using id to potentially customize metadata
  return {
    title: `Projeto ${id} | ArtEsfera`,
    description: "Detalhes do projeto na ArtEsfera",
  };
}
