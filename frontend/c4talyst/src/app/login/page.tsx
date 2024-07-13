import { Login} from "@/components/component/auth/login"

export default function Home() {
  return (
    <main style={{ overflow: 'hidden' }}>
      <div style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Login/>
      </div>
    </main>
  );
}
