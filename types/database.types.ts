// Tipos escritos manualmente a partir do schema em supabase/migrations/.
// Quando o projeto Supabase estiver provisionado, substituir gerando via:
// npx supabase gen types typescript --project-id <id> > types/database.types.ts

export type AppointmentStatus = "confirmado" | "cancelado" | "concluido";
export type ProfileRole = "cliente" | "admin";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          telefone: string;
          role: ProfileRole;
          created_at: string;
        };
        Insert: {
          id: string;
          nome: string;
          telefone: string;
          role?: ProfileRole;
        };
        Update: Partial<{
          nome: string;
          telefone: string;
          role: ProfileRole;
        }>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          nome: string;
          descricao: string | null;
          duracao_minutos: number;
          preco: number;
          ativo: boolean;
          ordem: number;
          created_at: string;
        };
        Insert: {
          slug: string;
          nome: string;
          descricao?: string | null;
          duracao_minutos?: number;
          preco: number;
          ativo?: boolean;
          ordem?: number;
        };
        Update: Partial<{
          slug: string;
          nome: string;
          descricao: string | null;
          duracao_minutos: number;
          preco: number;
          ativo: boolean;
          ordem: number;
        }>;
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          cliente_id: string;
          service_id: string;
          data: string;
          hora_inicio: string;
          hora_fim: string;
          status: AppointmentStatus;
          observacoes: string | null;
          created_at: string;
        };
        Insert: {
          cliente_id: string;
          service_id: string;
          data: string;
          hora_inicio: string;
          hora_fim: string;
          status?: AppointmentStatus;
          observacoes?: string | null;
        };
        Update: Partial<{
          status: AppointmentStatus;
          data: string;
          hora_inicio: string;
          hora_fim: string;
          observacoes: string | null;
        }>;
        Relationships: [
          {
            foreignKeyName: "appointments_cliente_id_fkey";
            columns: ["cliente_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      blocked_slots: {
        Row: {
          id: string;
          data: string;
          hora_inicio: string;
          hora_fim: string;
          motivo: string | null;
          created_at: string;
        };
        Insert: {
          data: string;
          hora_inicio: string;
          hora_fim: string;
          motivo?: string | null;
        };
        Update: Partial<{
          data: string;
          hora_inicio: string;
          hora_fim: string;
          motivo: string | null;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
