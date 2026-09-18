import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SelectionProvider } from "@/components/selection/SelectionProvider";
import { SelectionBar } from "@/components/selection/SelectionBar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SelectionProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <SelectionBar />
      </div>
    </SelectionProvider>
  );
}
