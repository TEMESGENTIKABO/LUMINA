import { Role } from "@prisma/client";

export function canAccessAdmin(role: Role): boolean {
  return role === "ADMIN" || role === "EDITOR" || role === "AUTHOR";
}

export function canManageAllArticles(role: Role): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canManageTaxonomy(role: Role): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canManageUsers(role: Role): boolean {
  return role === "ADMIN";
}

export function canManageSettings(role: Role): boolean {
  return role === "ADMIN";
}

export function getAllowedStatuses(role: Role): string[] {
  if (role === "ADMIN" || role === "EDITOR") {
    return ["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"];
  }
  // AUTHOR (and anyone else) can only draft or submit for review - never self-publish.
  return ["DRAFT", "IN_REVIEW"];
}

// Used by the boolean-published content types (Event, Topic, PhotoStory, Video,
// PodcastEpisode, DigitalEdition) - unlike Article's 5-state workflow, these use
// a simple draft/published boolean, but the same principle applies: only
// EDITOR/ADMIN may set published=true directly.
export function canPublishDirectly(role: Role): boolean {
  return role === "ADMIN" || role === "EDITOR";
}
