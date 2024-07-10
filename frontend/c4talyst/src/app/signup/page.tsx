import { Signup} from "@/components/component/signup"

export default function Home() {
  return (
    <main style={{ overflow: 'hidden' }}>
      <div style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Signup/>
      </div>
    </main>
  );
}
