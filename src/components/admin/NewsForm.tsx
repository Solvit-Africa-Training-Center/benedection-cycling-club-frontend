"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import ImageUpload from "./ImageUpload";
import { SectionCard } from "./PageHeader";
import Select from "./Select";
import TextInput from "./TextInput";
import Textarea from "./Textarea";
import TagInput from "./TagInput";
import { useToast } from "./Toast";
import { useAuth } from "./AuthProvider";
import { newsApi } from "@/lib/admin/api";
import { errorFieldErrors, errorMessage } from "@/lib/admin/errors";
import type { FieldErrors, NewsArticle, NewsStatus } from "@/lib/admin/types";
import { slugify, toDateInputValue } from "@/lib/admin/utils";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

type NewsFormProps = {
  /** Omit to create a new article. */
  article?: NewsArticle;
};

/**
 * Create/edit form for a news article.
 *
 * The draft rule: while the status is "draft" the publish date is cleared and the
 * field is disabled, so a draft can never be presented as published.
 */
export default function NewsForm({ article }: NewsFormProps) {
  const router = useRouter();
  const { notify } = useToast();
  const { isAdmin } = useAuth();

  const isEdit = Boolean(article);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [body, setBody] = useState(article?.body ?? "");
  const [coverImage, setCoverImage] = useState<string | undefined>(article?.coverImage);
  const [tags, setTags] = useState<string[]>(article?.tags ?? []);
  const [status, setStatus] = useState<NewsStatus>(article?.status ?? "draft");
  const [publishDate, setPublishDate] = useState(
    article?.publishDate ? toDateInputValue(new Date(article.publishDate)) : "",
  );

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isDraft = status === "draft";

  const handleStatusChange = (next: NewsStatus) => {
    setStatus(next);
    if (next === "published" && !publishDate) {
      // Sensible default so the required date is never a blocker on first publish.
      setPublishDate(toDateInputValue());
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError(undefined);

    const draft = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      body,
      coverImage: coverImage || undefined,
      tags,
      status,
      // Never store a publish date on a draft.
      publishDate: isDraft ? undefined : publishDate || toDateInputValue(),
    };

    try {
      if (article) {
        await newsApi.update(article.id, draft);
        notify(`${draft.title || "Article"} saved.`);
      } else {
        const created = await newsApi.create(draft);
        notify(`${created.title} created.`);
      }
      router.push("/admin/news");
    } catch (error) {
      setErrors(errorFieldErrors(error));
      setFormError(errorMessage(error, "That change could not be saved."));
      notify("That change could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    setDeleting(true);
    try {
      await newsApi.remove(article.id);
      notify(`${article.title} moved to deleted.`);
      setConfirmDelete(false);
      router.push("/admin/news");
    } catch (error) {
      notify(errorMessage(error, "That record could not be deleted."), "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex max-w-3xl flex-col gap-6">
      {formError ? (
        <p
          role="alert"
          className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 font-sans text-sm text-red-200"
        >
          {formError}
        </p>
      ) : null}

      <SectionCard title="Article" description="Headline, summary and body text.">
        <TextInput
          id="news-title"
          label="Headline"
          required
          value={title}
          onChange={(event) => {
            const next = event.target.value;
            setTitle(next);
            if (!slugEdited) setSlug(slugify(next));
          }}
          error={errors.title}
        />

        <TextInput
          id="news-slug"
          label="Slug"
          required
          hint="Used in the article's web address. Generated from the headline."
          value={slug}
          onChange={(event) => {
            setSlugEdited(true);
            setSlug(event.target.value);
          }}
          error={errors.slug}
        />

        <Textarea
          id="news-excerpt"
          label="Excerpt"
          rows={3}
          hint="One or two sentences shown in listings."
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          error={errors.excerpt}
          trailing={`${excerpt.length} characters`}
        />

        {/* Plain textarea on purpose: the brief asked for a character count, not a
            rich-text editor. A WYSIWYG editor would be a new dependency. */}
        <Textarea
          id="news-body"
          label="Body"
          rows={12}
          hint="Plain text. Blank lines separate paragraphs."
          value={body}
          onChange={(event) => setBody(event.target.value)}
          error={errors.body}
          trailing={`${body.length} characters`}
        />

        <TagInput
          id="news-tags"
          label="Tags"
          value={tags}
          onChange={setTags}
          hint="Press Enter to add a tag."
          error={errors.tags}
        />
      </SectionCard>

      <SectionCard title="Media" description="Optional cover image.">
        <ImageUpload
          id="news-cover"
          label="Cover image"
          altText={`Cover image for ${title || "the article"}`}
          value={coverImage}
          onChange={setCoverImage}
          error={errors.coverImage}
        />
      </SectionCard>

      <SectionCard
        title="Publishing"
        description="A draft is never shown as published, so it has no publish date."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            id="news-status"
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(event) => handleStatusChange(event.target.value as NewsStatus)}
            error={errors.status}
          />

          <TextInput
            id="news-publish-date"
            label="Publish date"
            type="date"
            value={publishDate}
            onChange={(event) => setPublishDate(event.target.value)}
            error={errors.publishDate}
            disabled={isDraft}
            hint={isDraft ? "Set a publish date once the status is Published." : undefined}
          />
        </div>

        {isDraft ? (
          <p className="font-sans text-xs text-amber-200">
            This article is a draft. It stays hidden from the public site until you set the
            status to Published.
          </p>
        ) : null}
      </SectionCard>

      <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button type="submit" variant="primary" busy={saving}>
            {isEdit ? "Save changes" : "Create article"}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/admin/news")}>
            Cancel
          </Button>
        </div>

        {isEdit && isAdmin ? (
          <Button
            variant="ghost"
            onClick={() => setConfirmDelete(true)}
            className="text-red-300 hover:bg-red-500/15 hover:text-red-200"
          >
            Delete article
          </Button>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        destructive
        busy={deleting}
        title="Delete this article?"
        description={`${article?.title ?? "This article"} will be hidden from the website and moved to deleted. An administrator can restore it later.`}
        confirmLabel="Delete article"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </form>
  );
}
