"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSupabase } from "@/components/supabase-provider";
import { ensureProfile } from "@/lib/supabase/profile";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Ingresa tu correo." })
    .email("Introduce un correo válido."),
  password: z
    .string()
    .min(1, { message: "Ingresa tu contraseña." })
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
});

const signUpSchema = signInSchema
  .extend({
    fullName: z
      .string()
      .min(1, { message: "¿Cómo te llamas?" })
      .min(2, "Tu nombre debe tener al menos 2 caracteres.")
      .max(80, "Usa un nombre más corto."),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirma tu contraseña." })
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden.",
  });

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export function AuthScreen() {
  const router = useRouter();
  const { supabase, session, isLoading } = useSupabase();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignIn = async (values: SignInValues) => {
    if (isSigningIn) return;

    setIsSigningIn(true);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        toast.error("No pudimos iniciar sesión", {
          description: error.message,
        });
        return;
      }

      if (data.session?.user) {
        const { error: profileError } = await ensureProfile(
          supabase,
          data.session.user
        );

        if (profileError) {
          console.error("No se pudo sincronizar el perfil", profileError);
        }
      }

      toast.success("Bienvenida/o de nuevo ✨");
      router.replace("/");
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Reintenta en unos minutos.";
      console.error("Error al iniciar sesión", error);
      toast.error("No pudimos iniciar sesión", { description });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = signInForm.getValues("email");

    const validated = signInSchema.pick({ email: true }).safeParse({ email });

    if (!validated.success) {
      signInForm.setError("email", {
        message: "Ingresa un correo válido para recuperar tu contraseña.",
      });
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset`,
    });

    if (error) {
      toast.error("No pudimos enviar el correo", {
        description: error.message,
      });
      return;
    }

    toast.info("Revisa tu correo", {
      description: "Te enviamos un enlace para restablecer tu contraseña.",
    });
  };

  const handleSignUp = async (values: SignUpValues) => {
    if (isSigningUp) return;

    setIsSigningUp(true);

    try {
      const { email, password, fullName } = values;
      const trimmedEmail = email.trim();
      const trimmedFullName = fullName.trim();
      const { error, data } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedFullName,
          },
        },
      });

      if (error) {
        toast.error("Ocurrió un problema al crear tu cuenta", {
          description: error.message,
        });
        return;
      }

      if (data.session) {
        const { error: profileError } = await ensureProfile(
          supabase,
          data.session.user
        );

        if (profileError) {
          console.error("No se pudo crear el perfil", profileError);
        }

        toast.success("Cuenta creada. Vamos a tu espacio 🌿");
        router.replace("/");
        return;
      }

      toast.info("Confirma tu correo ✉️", {
        description:
          "Te enviamos un correo para activar tu cuenta. Sigue el enlace para continuar.",
      });
      signUpForm.reset();
      setActiveTab("login");
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Reintenta en unos minutos.";
      console.error("Error al crear la cuenta", error);
      toast.error("Ocurrió un problema al crear tu cuenta", { description });
    } finally {
      setIsSigningUp(false);
    }
  };

  if (isLoading || session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#E9E5DA] via-[#E9E5DA] to-[#D5D9CE]">
        <p className="text-sm text-muted-foreground">
          {session ? "Te estamos redirigiendo a tu panel..." : "Cargando..."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#E9E5DA] via-[#E9E5DA] to-[#D5D9CE]">
      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            ῥέω
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Tu espacio financiero mindful
          </h1>
          <p className="text-sm text-muted-foreground">
            Inicia sesión o crea una cuenta para seguir fluyendo con tus metas.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            if (isSigningIn || isSigningUp) {
              return;
            }
            setActiveTab(value as "login" | "register");
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 bg-white/60 backdrop-blur">
            <TabsTrigger
              value="login"
              disabled={isSigningIn || isSigningUp}
            >
              Iniciar sesión
            </TabsTrigger>
            <TabsTrigger
              value="register"
              disabled={isSigningIn || isSigningUp}
            >
              Crear cuenta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <Card className="bg-white/80 backdrop-blur border-white/40 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Bienvenida/o de vuelta</CardTitle>
                <CardDescription>
                  Ingresa a tu panel mindful con tus credenciales.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...signInForm}>
                  <form
                    onSubmit={signInForm.handleSubmit(handleSignIn)}
                    className="space-y-6"
                  >
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder="tucorreo@ejemplo.com"
                              {...field}
                              disabled={isSigningIn}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="current-password"
                              placeholder="••••••••"
                              {...field}
                              disabled={isSigningIn}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center justify-between text-sm">
                      <Button
                        type="button"
                        variant="link"
                        className={cn("px-0 font-normal")}
                        onClick={handlePasswordReset}
                        disabled={isSigningIn}
                      >
                        Recuperar contraseña
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSigningIn}
                    >
                      {isSigningIn ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <Card className="bg-white/80 backdrop-blur border-white/40 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Crea tu espacio</CardTitle>
                <CardDescription>
                  Personaliza tu experiencia mindful desde el inicio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...signUpForm}>
                  <form
                    onSubmit={signUpForm.handleSubmit(handleSignUp)}
                    className="space-y-6"
                  >
                    <FormField
                      control={signUpForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              autoComplete="name"
                              placeholder="Tu nombre completo"
                              {...field}
                              disabled={isSigningUp}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder="tucorreo@ejemplo.com"
                              {...field}
                              disabled={isSigningUp}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="new-password"
                              placeholder="Crea una contraseña segura"
                              {...field}
                              disabled={isSigningUp}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar contraseña</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              autoComplete="new-password"
                              placeholder="Repite tu contraseña"
                              {...field}
                              disabled={isSigningUp}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSigningUp}
                    >
                      {isSigningUp ? "Creando tu cuenta..." : "Crear cuenta"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
