import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <PageHeader title="Settings" subtitle="Site-wide statistics and contact details." />
      <SettingsForm settings={settings} />
    </div>
  );
}
