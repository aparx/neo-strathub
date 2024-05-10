"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@repo/ui/components";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function EditorPage() {
  const form = useForm<{ name: string }>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(3),
      }),
    ),
  });

  return (
    <form onSubmit={form.handleSubmit((data) => alert(JSON.stringify(data)))}>
      <TextField
        {...form.register("name")}
        error={form.formState.errors.name?.message}
      />
      <Button type={"submit"}>Submit</Button>
    </form>
  );
}
