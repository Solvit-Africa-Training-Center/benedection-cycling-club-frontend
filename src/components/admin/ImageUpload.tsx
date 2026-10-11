"use client";

import { useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import Button from "./Button";
import FormField from "./FormField";
import {
  IMAGE_ACCEPTED_TYPES,
  IMAGE_JPEG_QUALITY,
  IMAGE_MAX_BYTES,
  IMAGE_MAX_WIDTH,
  uploadImage,
} from "@/lib/admin/api";
import { ApiError } from "@/lib/admin/errors";
import { cx, loadImage, readFileAsDataUrl } from "@/lib/admin/utils";

type ImageUploadProps = {
  id?: string;
  label: string;
  /** Current image URL (or data URL), if any. */
  value?: string;
  /** Called with the new URL, or undefined when the image is removed. */
  onChange: (value: string | undefined) => void;
  hint?: string;
  /** Shown under the field when the parent form reports an error. */
  error?: string;
  /** Alt text for the preview image. */
  altText: string;
  className?: string;
};

const ACCEPT = IMAGE_ACCEPTED_TYPES.join(",");
const MAX_MB = Math.round(IMAGE_MAX_BYTES / (1024 * 1024));

/**
 * File picker that resizes in the browser before storing.
 *
 * Why resize here: phone cameras produce 4000px, 6 MB files that would blow the
 * localStorage quota on the third upload. Downscaling to 1200px wide JPEG at
 * quality 0.8 keeps a usable photo at roughly a tenth of the size.
 *
 * The resized file is handed to `api.uploadImage`, so a real deployment only has
 * to change that one function to POST to Django.
 */
export default function ImageUpload({
  id,
  label,
  value,
  onChange,
  hint,
  error,
  altText,
  className,
}: ImageUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>();
  const message = error ?? localError;

  /** Draws the image to a canvas at most `IMAGE_MAX_WIDTH` wide and exports JPEG. */
  async function resizeToJpeg(file: File): Promise<File> {
    const dataUrl = await readFileAsDataUrl(file);
    const image = await loadImage(dataUrl);

    const scale = Math.min(1, IMAGE_MAX_WIDTH / image.width);
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new ApiError(500, "This browser cannot process images. Please try another one.");
    }
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", IMAGE_JPEG_QUALITY);
    });
    if (!blob) {
      throw new ApiError(500, "That image could not be processed. Please try another one.");
    }

    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, {
      type: "image/jpeg",
    });
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Reset the input so choosing the same file twice still fires a change event.
    event.target.value = "";
    if (!file) return;

    setLocalError(undefined);
    setBusy(true);

    try {
      if (!IMAGE_ACCEPTED_TYPES.includes(file.type as (typeof IMAGE_ACCEPTED_TYPES)[number])) {
        throw new ApiError(415, "Use a JPG, PNG or WebP image.", {
          image: "Use a JPG, PNG or WebP image.",
        });
      }
      if (file.size > IMAGE_MAX_BYTES) {
        throw new ApiError(413, `That image is larger than ${MAX_MB} MB. Choose a smaller file.`, {
          image: `Keep the image under ${MAX_MB} MB.`,
        });
      }

      const resized = await resizeToJpeg(file);
      const url = await uploadImage(resized);
      onChange(url);
    } catch (caught) {
      setLocalError(
        caught instanceof ApiError
          ? caught.message
          : "That image could not be uploaded. Please try another one.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormField id={inputId} label={label} hint={hint} error={message} className={className}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div
          className={cx(
            "flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg border sm:w-44",
            message ? "border-red-400/70" : "border-white/15",
            value ? "bg-black/40" : "bg-white/[0.03]",
          )}
        >
          {value ? (
            // Plain <img> on purpose: stored images are local data URLs and
            // next/image would try to optimise a path that only exists in this browser.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={altText} className="h-full w-full object-cover" />
          ) : (
            <span className="font-sans text-xs uppercase tracking-widest text-slate-500">
              No image
            </span>
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPT}
            onChange={handleFile}
            aria-invalid={Boolean(message) || undefined}
            aria-describedby={describedBy}
            className="sr-only"
          />
          <Button size="sm" busy={busy} onClick={() => inputRef.current?.click()}>
            {value ? "Replace image" : "Choose image"}
          </Button>

          {value ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setLocalError(undefined);
                onChange(undefined);
              }}
              className="text-red-300 hover:bg-red-500/15 hover:text-red-200"
            >
              Remove image
            </Button>
          ) : null}

          <p className="font-sans text-xs text-slate-500">
            JPG, PNG or WebP up to {MAX_MB} MB. Resized to {IMAGE_MAX_WIDTH}px wide before saving.
          </p>
        </div>
      </div>
    </FormField>
  );
}
