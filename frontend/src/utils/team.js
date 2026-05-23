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
