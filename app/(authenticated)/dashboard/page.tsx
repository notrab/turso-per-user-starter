import { Todos } from "./todos";

export default async function Page() {
  return (
    <div className="space-y-3">
      <div className="pb-6 text-center">
        <h1 className="text-3xl font-black tracking-tight text-white">Todos</h1>
        <p className="text-white/60">
          The todos you add below are created inside your own database.
        </p>
      </div>
      <Todos />
    </div>
  );
}
