import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { Modal } from "../modal";

interface InstanceNode {
  props?: { style?: unknown };
  children?: InstanceNode[] | null;
}

function hasKeyboardOffsetStyle(style: unknown, expected: number): boolean {
  if (!Array.isArray(style)) return false;
  return style.some(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      Object.keys(entry as object).length === 1 &&
      (entry as { bottom?: unknown }).bottom === expected,
  );
}

function collectInstancesWithKeyboardOffset(
  instance: InstanceNode | null,
  expected: number,
): InstanceNode[] {
  const results: InstanceNode[] = [];
  function walk(node: InstanceNode | null) {
    if (!node) return;
    if (hasKeyboardOffsetStyle(node.props?.style, expected)) {
      results.push(node);
    }
    if (Array.isArray(node.children)) {
      for (const child of node.children) walk(child);
    }
  }
  walk(instance);
  return results;
}

function getRoot(): InstanceNode {
  const root = screen.root as unknown as { instance?: InstanceNode };
  return root.instance ?? (screen.root as unknown as InstanceNode);
}

describe("Modal", () => {
  it("renders children when visible", async () => {
    await render(
      <Modal isVisible onClose={() => {}}>
        <Text>Modal body</Text>
      </Modal>,
    );
    expect(screen.getByText("Modal body")).toBeTruthy();
  });

  it("applies keyboard height as bottom offset via animated style", async () => {
    await render(
      <Modal isVisible onClose={() => {}}>
        <Text>Modal body</Text>
      </Modal>,
    );
    const matches = collectInstancesWithKeyboardOffset(getRoot(), 300);
    expect(matches.length).toBeGreaterThan(0);
  });
});
