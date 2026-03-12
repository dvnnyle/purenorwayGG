import SectionScaffold from "./SectionScaffold";
import "./create-section.css";

export default function CreateSectionPage() {
  return (
    <main className="create-section-page">
      <section className="create-section-hero">
        <p className="create-section-kicker">DEVELOPER TOOLS</p>
        <h1>Create Section</h1>
        <p className="create-section-subtitle">Raw scaffold templates for new sections</p>
      </section>

      <SectionScaffold />
    </main>
  );
}
