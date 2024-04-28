import { Todos } from "./todos";
import { Form } from "./form";

export default async function Page() {
  return (
    <div className="space-y-3">
      <Todos />
      <Form />
    </div>
  );
}
