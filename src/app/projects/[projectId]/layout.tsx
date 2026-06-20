import { ProjectIdLayout } from "@/features/projects/components/project-id-layout";

import { Id } from "../../../../convex/_generated/dataModel";
import { TooltipProvider } from "@/components/ui/tooltip";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: Id<"projects"> }>
}) => {
  const { projectId } = await params;

  return (
    <TooltipProvider>
      <ProjectIdLayout
        projectId={projectId}
      >
        {children}
      </ProjectIdLayout>
    </TooltipProvider>
  );
}
 
export default Layout;