"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSupabase } from "@/components/supabase-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const resetSchema = z
  .object({
    password: z
      .string({ error: "Ingresa tu nueva contraseña." })
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmPassword: z
      .string({ error: "Confirma tu nueva contraseña." })
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas deben coincidir.",
  });

type ResetValues = z.infer<typeof resetSchema>;

export function ResetPasswordScreen() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [isReady, setIsReady] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setIsReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      if (data.session) {
        setIsReady(true);
      } else {
        // We still allow the form; Supabase may deliver the session shortly after.
        setTimeout(() => {
          if (mounted) {
            setIsReady(true);
          }
        }, 500);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const onSubmit = (values: ResetValues) => {
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast.error("No pudimos actualizar tu contraseña", {
          description: error.message,
        });
        return;
      }

      toast.success("Contraseña actualizada", {
        description: "Ya puedes continuar con tu experiencia mindful.",
      });

      router.replace("/");
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#E9E5DA] via-[#E9E5DA] to-[#D5D9CE]">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur border-white/40 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Restablecer contraseña</CardTitle>
          <CardDescription>
            Elige una nueva contraseña para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isReady ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          placeholder="••••••••"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
                          placeholder="Repite la contraseña"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? "Guardando..." : "Actualizar contraseña"}
                </Button>
              </form>
            </Form>
          ) : (
            <p className="text-sm text-muted-foreground">
              Verificando tu enlace de recuperación...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
