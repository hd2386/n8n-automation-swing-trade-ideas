import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">HD Signals</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered swing trading signals delivered daily to your inbox.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/subscribe" className="hover:text-foreground">
                  Subscribe
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold">Disclaimer</h4>
            <p className="text-xs text-muted-foreground">
              This service provides technical analysis signals for informational
              purposes only. Trading involves risk and may result in capital
              loss. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 HD Signals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
