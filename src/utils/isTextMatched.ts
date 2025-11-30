export default function isTextMatched(
  tag: string | undefined,
  match: string
): boolean {
  if (tag !== undefined && match !== "") {
    if (tag.toLocaleLowerCase() === match.toLocaleLowerCase()) {
      return true;
    }
    return false;
  }
  return false;
}
