import { getTeamProfile } from "../config/teamProfiles";

export function teamMemberSlug(member) {
  if (member?.slug) return member.slug;
  return String(member?.name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function teamProfilePath(member) {
  const slug = teamMemberSlug(member);
  return slug ? `/team-members/${slug}` : "/team-members";
}

/** Name shown on team cards (full name; profile page can use greetingName). */
export function teamCardDisplayName(member) {
  const slug = teamMemberSlug(member);
  const extended = getTeamProfile(slug);
  if (extended?.cardName) return extended.cardName;
  return String(member?.name || "").trim();
}

/** Role shown on team cards (shorter than profile-page title when set). */
export function teamCardDisplayPosition(member) {
  const slug = teamMemberSlug(member);
  const extended = getTeamProfile(slug);
  if (extended?.cardPosition) return extended.cardPosition;
  return member?.position || "";
}
