"use client";

import { Component, type ReactNode } from "react";

/** If a section crashes in the browser, hide just that section, not the whole page. */
export class SectionBoundary extends Component<
  { children: ReactNode; name?: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(`[homepage] "${this.props.name ?? "section"}" crashed:`, error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
