import { GitHubStars } from "./ui/github-stars";

export function SiteFooter()
{
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-3">
          <GitHubStars repo="leonvanzyl/agentic-coding-starter-kit" />
          <p>© 2025 by Tidiane Diallo</p>
        </div>
      </div>
    </footer>
  );
}
