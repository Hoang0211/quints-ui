import { createRef, forwardRef, type AnchorHTMLAttributes } from "react";
import { render, screen, within } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Breadcrumb, type BreadcrumbProps } from "./Breadcrumb";

function renderBreadcrumb(props: BreadcrumbProps = {}) {
  return render(
    <Breadcrumb {...props}>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Button</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb>,
  );
}

describe("Breadcrumb", () => {
  it("renders a navigation landmark labelled Breadcrumb", () => {
    renderBreadcrumb();
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getByRole("list").tagName).toBe("OL");
  });

  it("accepts a custom aria-label", () => {
    renderBreadcrumb({ "aria-label": "You are here" });
    expect(screen.getByRole("navigation", { name: "You are here" })).toBeInTheDocument();
  });

  it("renders links and marks the current page", () => {
    renderBreadcrumb();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs");
    expect(screen.getByText("Button")).toHaveAttribute("aria-current", "page");
  });

  it("inserts a hidden separator between items only", () => {
    const { container } = renderBreadcrumb();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);

    const separators = container.querySelectorAll(".q-breadcrumb__separator");
    expect(separators).toHaveLength(2);
    separators.forEach((separator) => {
      expect(separator).toHaveAttribute("aria-hidden", "true");
      expect(separator.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("renders a custom separator", () => {
    const { container } = renderBreadcrumb({ separator: "/" });
    const separators = container.querySelectorAll(".q-breadcrumb__separator");
    expect(separators[0]).toHaveTextContent("/");
    expect(separators[0].querySelector("svg")).not.toBeInTheDocument();
  });

  it("skips separators for conditionally omitted items", () => {
    const showDocs = false;
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        {showDocs && (
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item>
          <Breadcrumb.Page>Button</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );
    expect(container.querySelectorAll(".q-breadcrumb__separator")).toHaveLength(1);
  });

  it("defaults to the md size and applies the given size", () => {
    const { rerender } = renderBreadcrumb();
    expect(screen.getByRole("navigation").className).toContain("q-breadcrumb--md");

    rerender(
      <Breadcrumb size="sm">
        <Breadcrumb.Item>
          <Breadcrumb.Page>Home</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );
    expect(screen.getByRole("navigation").className).toContain("q-breadcrumb--sm");
  });

  it("merges link props onto a router link with asChild", () => {
    const RouterLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
      (props, ref) => <a ref={ref} data-router="true" {...props} />,
    );
    RouterLink.displayName = "RouterLink";

    render(
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild className="custom">
            <RouterLink href="/docs">Docs</RouterLink>
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("data-router", "true");
    expect(link).toHaveAttribute("href", "/docs");
    expect(link.className).toBe("q-breadcrumb__link custom");
  });

  it("renders an ellipsis with screen reader text for collapsed items", () => {
    render(
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Ellipsis data-testid="ellipsis" />
        </Breadcrumb.Item>
      </Breadcrumb>,
    );
    const ellipsis = screen.getByTestId("ellipsis");
    expect(ellipsis).toHaveTextContent("More pages");
    expect(within(ellipsis).getByText("…")).toHaveAttribute("aria-hidden", "true");
  });

  it("merges a consumer className after the generated classes", () => {
    render(
      <Breadcrumb className="custom">
        <Breadcrumb.Item className="custom-item">
          <Breadcrumb.Link href="/" className="custom-link">
            Home
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );
    expect(screen.getByRole("navigation").className).toBe("q-breadcrumb q-breadcrumb--md custom");
    expect(screen.getByRole("listitem").className).toBe("q-breadcrumb__item custom-item");
    expect(screen.getByRole("link").className).toBe("q-breadcrumb__link custom-link");
  });

  it("forwards refs to the nav, item, link, and page elements", () => {
    const navRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLLIElement>();
    const linkRef = createRef<HTMLAnchorElement>();
    const pageRef = createRef<HTMLSpanElement>();
    render(
      <Breadcrumb ref={navRef}>
        <Breadcrumb.Item ref={itemRef}>
          <Breadcrumb.Link ref={linkRef} href="/">
            Home
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Page ref={pageRef}>Docs</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );

    expect(navRef.current?.tagName).toBe("NAV");
    expect(itemRef.current).toBeInstanceOf(HTMLLIElement);
    expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement);
    expect(pageRef.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Ellipsis />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Page>Button</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
