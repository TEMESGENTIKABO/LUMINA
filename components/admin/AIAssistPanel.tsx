/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Tags,
  Languages,
  TrendingUp,
  X,
} from "lucide-react";
import { tiptapDocToPlainText, paragraphsToTiptapDoc } from "@/lib/tiptapDoc";

interface AIAssistPanelProps {
  title: string;
  dek: string;
  bodyJson: object;
  onSeoSuggestion: (seoTitle: string, seoDescription: string) => void;
  onTagSuggestion: (tagNames: string[]) => void;
  onTranslation: (titleAm: string, dekAm: string, bodyAmJson: object) => void;
}

interface ActionState {
  type: "seo" | "tags" | "translate" | null;
  status: "idle" | "loading" | "success" | "error";
  message?: string;
}

export function AIAssistPanel({
  title,
  dek,
  bodyJson,
  onSeoSuggestion,
  onTagSuggestion,
  onTranslation,
}: AIAssistPanelProps) {
  const [actionState, setActionState] = useState<ActionState>({
    type: null,
    status: "idle",
  });
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const bodyText = tiptapDocToPlainText(bodyJson);

  const validateContent = (required: string[]) => {
    const missing = required.filter((field) => {
      if (field === "title") return !title;
      if (field === "body") return !bodyText;
      if (field === "dek") return !dek;
      return false;
    });

    if (missing.length > 0) {
      setActionState({
        type: null,
        status: "error",
        message: `Please add ${missing.join(" and ")} first.`,
      });
      return false;
    }
    return true;
  };

  const handleAction = async (
    type: "seo" | "tags" | "translate",
    apiEndpoint: string,
    payload: Record<string, unknown>,
    successHandler: (data: any) => void,
  ) => {
    setActionState({ type, status: "loading" });
    setSuccessMessage("");

    try {
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || `Failed to generate ${type} suggestions`);

      successHandler(data);
      setActionState({ type, status: "success" });
      setSuccessMessage(
        `${type.charAt(0).toUpperCase() + type.slice(1)} suggestions generated successfully`,
      );

      // Auto-dismiss success message after 4 seconds
      setTimeout(() => {
        setActionState({ type: null, status: "idle" });
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      setActionState({
        type,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : `Failed to generate ${type} suggestions`,
      });
    }
  };

  const handleSeo = async () => {
    if (!validateContent(["title"])) return;

    await handleAction(
      "seo",
      "/api/admin/ai/suggest-seo",
      { title, dek, bodyText },
      (data) => onSeoSuggestion(data.seoTitle, data.seoDescription),
    );
  };

  const handleTags = async () => {
    if (!validateContent(["title"])) return;

    await handleAction(
      "tags",
      "/api/admin/ai/suggest-tags",
      { title, dek, bodyText },
      (data) => {
        setSuggestedTags(data.tags);
        onTagSuggestion(data.tags);
      },
    );
  };

  const handleTranslate = async () => {
    if (!validateContent(["title", "body"])) return;

    const bodyParagraphs = bodyText.split("\n\n");

    await handleAction(
      "translate",
      "/api/admin/ai/translate",
      { title, dek, bodyParagraphs },
      (data) =>
        onTranslation(
          data.title_am,
          data.dek_am,
          paragraphsToTiptapDoc(data.body_am),
        ),
    );
  };

  const getStatusIcon = () => {
    if (actionState.status === "loading")
      return <Loader2 className="w-4 h-4 animate-spin" />;
    if (actionState.status === "success")
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (actionState.status === "error")
      return <AlertCircle className="w-4 h-4 text-rose-500" />;
    return <Sparkles className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (actionState.status === "loading") return "text-amber-500";
    if (actionState.status === "success") return "text-emerald-500";
    if (actionState.status === "error") return "text-rose-500";
    return "text-indigo-400";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50/80 to-white border-b border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800 tracking-tight">
                AI Writing Assistant
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Enterprise-grade content intelligence
              </p>
            </div>
          </div>
          {actionState.status !== "idle" && (
            <div
              className={`flex items-center gap-2 text-xs font-medium ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <span className="capitalize">
                {actionState.status === "loading" && "Processing..."}
                {actionState.status === "success" && "Complete"}
                {actionState.status === "error" && "Error"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={handleSeo}
            disabled={actionState.status === "loading"}
            className="group relative flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:border-indigo-300 hover:shadow-sm"
          >
            <TrendingUp className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
              SEO Optimization
            </span>
            {actionState.type === "seo" && actionState.status === "loading" && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 ml-auto" />
            )}
          </button>

          <button
            type="button"
            onClick={handleTags}
            disabled={actionState.status === "loading"}
            className="group relative flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:border-indigo-300 hover:shadow-sm"
          >
            <Tags className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
              Tag Generation
            </span>
            {actionState.type === "tags" &&
              actionState.status === "loading" && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 ml-auto" />
              )}
          </button>

          <button
            type="button"
            onClick={handleTranslate}
            disabled={actionState.status === "loading"}
            className="group relative flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:border-indigo-300 hover:shadow-sm"
          >
            <Languages className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
              Amharic Translation
            </span>
            {actionState.type === "translate" &&
              actionState.status === "loading" && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 ml-auto" />
              )}
          </button>
        </div>

        {/* Status Messages */}
        <div className="min-h-[2.5rem]">
          {actionState.status === "error" && actionState.message && (
            <div className="flex items-start gap-2.5 p-3 bg-rose-50/80 border border-rose-200/60 rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-rose-700 leading-relaxed">
                {actionState.message}
              </p>
              <button
                onClick={() => setActionState({ type: null, status: "idle" })}
                className="ml-auto text-rose-400 hover:text-rose-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2.5 p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-lg animate-in fade-in slide-in-from-top-1 duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-emerald-700 font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {suggestedTags.length > 0 && actionState.status !== "error" && (
            <div className="flex items-start gap-2.5 p-3 bg-indigo-50/60 border border-indigo-200/60 rounded-lg">
              <Tags className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-600 font-medium mb-1.5">
                  Suggested Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-1 bg-white border border-indigo-200/60 rounded-md text-xs text-indigo-700 font-medium shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  Select matching tags below to apply them to your content
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Wand2 className="w-3 h-3 text-slate-400" />
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              AI-GENERATED DRAFTS — ALWAYS REVIEW BEFORE PUBLISHING
            </p>
          </div>
          <p className="text-[10px] text-slate-300 mt-0.5">
            Particularly verify Amharic translations for accuracy and cultural
            context
          </p>
        </div>
      </div>
    </div>
  );
}
