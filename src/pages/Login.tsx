import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = trpc.auth.login.useMutation({
    onSuccess: () => navigate("/admin"),
    onError: () => setError("Wrong password"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Staff login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              login.mutate({ password });
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-md border px-3 py-2"
              autoComplete="current-password"
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button className="w-full" size="lg" type="submit" disabled={login.isPending}>
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
