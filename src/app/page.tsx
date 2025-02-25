import { GeneratedImage } from "~/components/generated-image";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { ThemeTrigger } from "~/components/theme-switcher";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="space-x-2 p-2">
        <SidebarTrigger variant="outline" className="h-9 w-9" />
        <ThemeTrigger />
      </div>
      <div className="flex justify-center gap-4 p-4">
        <GeneratedImage />
      </div>
    </div>
  );
}
