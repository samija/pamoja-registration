"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface RealtimeOptions {
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  onInsert?: (payload: Record<string, unknown>) => void;
  onUpdate?: (payload: Record<string, unknown>) => void;
  onDelete?: (payload: Record<string, unknown>) => void;
  onChange?: (payload: Record<string, unknown>) => void;
}

export function useRealtime({ table, event = "*", onInsert, onUpdate, onDelete, onChange }: RealtimeOptions) {
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        { event, schema: "public", table },
        (payload) => {
          onChange?.(payload.new as Record<string, unknown>);
          if (payload.eventType === "INSERT") onInsert?.(payload.new as Record<string, unknown>);
          if (payload.eventType === "UPDATE") onUpdate?.(payload.new as Record<string, unknown>);
          if (payload.eventType === "DELETE") onDelete?.(payload.old as Record<string, unknown>);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event]); // eslint-disable-line react-hooks/exhaustive-deps
}
