import test, { expect } from "@playwright/test";

import { openDevToolsTab, startTest } from "../helpers";
import {
  findPoints,
  openPauseInformationPanel,
  openPrintStatementsAccordionPane,
  togglePoint,
} from "../helpers/pause-information-panel";
import { addBreakpoint, removeBreakpoint } from "../helpers/source-panel";

const url = "doc_navigate.html";

test(`breakpoints-08: should be temporarily disabled`, async ({ page }) => {
  await startTest(page, url);
  await openDevToolsTab(page);

  // Add breakpoint and verify text in console
  await addBreakpoint(page, { lineNumber: 5, url });

  // Find the newly added point in the side panel
  await openPauseInformationPanel(page);
  await openPrintStatementsAccordionPane(page);
  const breakpoints = findPoints(page, "breakpoint", { lineNumber: 5 });
  await expect(await breakpoints.count()).toBe(1);
  const breakpoint = breakpoints.first();

  // Temporarily disable breakpoint and verify that it's still in the panel
  await togglePoint(page, breakpoint, false);
  await expect(await breakpoints.count()).toBe(1);

  // Re-enable breakpoint
  await togglePoint(page, breakpoint, true);

  // Delete the breakpoint and verify that it's no longer in the side panel
  await removeBreakpoint(page, { lineNumber: 5, url });
  await expect(await breakpoints.count()).toBe(0);
});