export interface View {
  id: number;
  config: { id: number };
  name: string;
  alias: string;
  database: string;
  warehouse: string;
  schema: any;
}
