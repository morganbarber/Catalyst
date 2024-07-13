import { Dashboard} from "@/components/component/dashboard/dashboard";

export default function Home() {
  return (
    <main style={{ overflow: 'hidden' }}>
      <div style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Dashboard/>
      </div>
    </main>
  );
}
