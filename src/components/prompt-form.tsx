"use client";

import { env } from "~/env";
import Image from "next/image";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

import { HfInference, type Options } from "@huggingface/inference";

const formSchema = z
  .object({
    inputs: z
      .string()
      .min(10, {
        message: "Prompt must be at least 10 characters.",
      })
      .max(160, {
        message: "Prompt must not be longer than 30 characters.",
      }),
  })
  .strict();

async function query(values: z.infer<typeof formSchema>) {
  const hf = new HfInference(env.NEXT_PUBLIC_HUGGINGFACE_KEY);

  const options: Options = {
    retry_on_error: true,
    wait_for_model: true,
  };

  const response = await hf.textToImage(
    {
      inputs: `${values.inputs}, masterpiece, best quality, very aesthetic, absurdres`,
      model: "cagliostrolab/animagine-xl-3.1",
      parameters: {
        guidance_scale: 7,
        height: 1152,
        width: 896,
        negative_prompt:
          "nsfw, lowres, (bad), text, error, fewer, extra, missing, worst quality, jpeg artifacts, low quality, watermark, unfinished, displeasing, oldest, early, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract]",
        num_inference_steps: 28,
      },
    },
    options,
  );

  return response;
}

export function PromptForm() {
  const [imageURL, setImageURL] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }

      const response = await query(values);

      // Convert the response into an object URL and set it as the image source
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: "image/jpeg" }); // Adjust MIME type based on your image type
      const newImageURL = URL.createObjectURL(blob);
      setImageURL(newImageURL); // Update state with the new image URL

      toast.success("AI Image successfully generated!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unknown error occurred.",
      );
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Inputs */}
          <FormField
            control={form.control}
            name="inputs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="1girl, green hair, sweater, looking at viewer, upper body, beanie, outdoors, night, turtleneck, masterpiece, best quality, very aesthetic"
                    rows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {imageURL && <Image src={imageURL} alt="" width={896} height={1152} />}
    </>
  );
}
