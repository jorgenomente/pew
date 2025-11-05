import type { LucideIcon } from "lucide-react";

export const DEFAULT_PERSONAS = ["Persona 1", "Persona 2"] as const;
export type Persona = string;

export type MovementType = "income" | "expense";

export interface MovementFormData {
  fecha: string;
  persona: Persona;
  categoria: string;
  descripcion: string;
  monto: string;
  recibido: boolean;
  tipo: MovementType;
}

export interface VariableExpenseFormData {
  concepto: string;
  categoria: string;
  fecha: string;
  monto: string;
  nota: string;
}

export type GoalPriority = "alta" | "media" | "baja";

export interface GoalFormData {
  nombre: string;
  montoObjetivo: string;
  montoActual: string;
  fecha: string;
  prioridad: GoalPriority;
}

export interface CasitaItemFormData {
  concepto: string;
  montoEstimado: string;
  pagado: string;
  categoria?: string;
  nota: string;
}

export type IconComponent = LucideIcon;
