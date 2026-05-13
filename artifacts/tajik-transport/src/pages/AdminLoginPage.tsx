import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Loader2, Lock, User, ShieldAlert } from "lucide-react";
import { useAdminLogin } from "@workspace/api-client-react";
import { setAdminToken } from "@/lib/adminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type LoginValues = {
  username: string;
  password: string;
};

export function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const login = useAdminLogin();

  const form = useForm<LoginValues>({
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(values: LoginValues) {
    setLoginError(null);
    login.mutate(
      { data: { username: values.username, password: values.password } },
      {
        onSuccess: (data) => {
          setAdminToken(data.token);
          setLocation("/admin");
        },
        onError: () => {
          setLoginError("Invalid username or password.");
        },
      }
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/30 rounded-full mb-6">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-serif text-white mb-2">Admin Access</h1>
          <p className="text-gray-500 font-light text-sm tracking-wider uppercase">
            Tajik Elite Control Panel
          </p>
        </div>

        <div className="bg-black border border-white/10 p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-admin-login">
              <FormField
                control={form.control}
                name="username"
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-light tracking-wide flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-primary/70" />
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
                        autoComplete="username"
                        className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none"
                        data-testid="input-username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300 font-light tracking-wide flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-primary/70" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        autoComplete="current-password"
                        className="bg-black/50 border-white/10 text-white focus:border-primary rounded-none"
                        data-testid="input-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {loginError && (
                <p className="text-red-400 text-sm text-center border border-red-500/20 bg-red-500/5 py-2 px-4" data-testid="text-login-error">
                  {loginError}
                </p>
              )}

              <Button
                type="submit"
                disabled={login.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-black py-5 tracking-widest uppercase rounded-none font-medium"
                data-testid="button-login"
              >
                {login.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6 tracking-wider">
          TAJIK ELITE — AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </main>
  );
}
