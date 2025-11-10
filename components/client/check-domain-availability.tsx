"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function CheckDomainAvailability() {
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateSubdomain = (value: string) => {
    if (!value) return false;
    if (value.length > 63) return false;
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSubdomain(value);

    if (!value) {
      setError(null);
      return;
    }

    setError(validateSubdomain(value) ? null : "That ain't a domain g");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateSubdomain(subdomain)) {
      setError("That ain't a domain g");
      return;
    }

    setError(null);
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<
    "available" | "unavailable" | "error" | null
  >(null);
  const [resultDomain, setResultDomain] = useState<string | null>(null);

  const checkDomainAvailability = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
    setResult("error");
    setResultDomain(subdomain + ".cfy.ucc.asn.au");
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-sm" style={{ margin: "auto" }}>
      <CardHeader>
        <CardTitle>Is my domain available™?</CardTitle>
        <CardDescription>
          If you want to deploy a web-based app under the ucc-domain, use the
          following checker to see if it is available.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="relative">
                <Input
                  id="subdomain"
                  name="subdomain"
                  type="text"
                  placeholder="my-project"
                  className={cn(
                    "pr-40",
                    error && "border-destructive focus-visible:ring-destructive"
                  )}
                  required
                  aria-describedby={
                    error ? "domain-suffix domain-error" : "domain-suffix"
                  }
                  aria-invalid={error ? "true" : "false"}
                  inputMode="url"
                  value={subdomain}
                  onChange={handleChange}
                />
                <span
                  id="domain-suffix"
                  className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  .cfy.ucc.asn.au
                </span>
              </div>
              {error && (
                <p id="domain-error" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          className="w-full"
          disabled={!!error || !subdomain || !!loading}
          onClick={checkDomainAvailability}
        >
          Check
        </Button>
      </CardFooter>

      {result === "available" && resultDomain && (
        <Alert variant={"default"}>
          <AlertTitle>
            <b>{resultDomain}</b> is available!
          </AlertTitle>
          <AlertDescription>
            Next, refer to the Dokploy documentation on how to deploy your app
            under it.
          </AlertDescription>
        </Alert>
      )}
      {result === "unavailable" && resultDomain && (
        <Alert variant={"destructive"}>
          <AlertTitle>
            <b>{resultDomain}</b> is not available!
          </AlertTitle>
          <AlertDescription>
            You might need to find a better one. Maybe add your username to the domain.
          </AlertDescription>
        </Alert>
      )}
      {result === "error" && resultDomain && (
        <Alert variant={"destructive"}>
          <AlertTitle>
            <b>{resultDomain}</b> is.... !!??
          </AlertTitle>
          <AlertDescription>
            There has been an error running the check. Contact one of the wheels on our Discord instead. 
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
