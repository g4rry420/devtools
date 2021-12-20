import { UIState } from "ui/state";
import { LayoutState } from "ui/state/layout";
import { LayoutAction } from "ui/actions/layout";
import { getRecordingId } from "ui/utils/environment";
import { asyncStore } from "../utils/prefs";
import { trackEvent } from "ui/utils/telemetry";

const syncInitialLayoutState: LayoutState = {
  showCommandPalette: false,
  selectedPrimaryPanel: "events",
  viewMode: "non-dev",
  showVideoPanel: true,
  showEditor: true,
};

export async function getInitialLayoutState(): Promise<LayoutState> {
  const recordingId = getRecordingId();

  // If we're in the library, there are no preferences to fetch.
  if (!recordingId) {
    return syncInitialLayoutState;
  }

  const replaySessions = await asyncStore.replaySessions;
  const session = replaySessions[recordingId!];

  if (!session) {
    return syncInitialLayoutState;
  }

  const { viewMode, showVideoPanel, showEditor, selectedPrimaryPanel } = syncInitialLayoutState;

  const initialViewMode = session.viewMode || viewMode;
  trackEvent(initialViewMode == "dev" ? "layout.default_devtools" : "layout.default_viewer");

  return {
    ...syncInitialLayoutState,
    viewMode: initialViewMode,
    selectedPrimaryPanel: session.selectedPrimaryPanel || selectedPrimaryPanel,
    showVideoPanel: "showVideoPanel" in session ? session.showVideoPanel : showVideoPanel,
    showEditor: "showEditor" in session ? session.showEditor : showEditor,
  };
}

export default function update(state = syncInitialLayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case "set_show_command_palette": {
      return {
        ...state,
        showCommandPalette: action.value,
      };
    }

    case "set_selected_primary_panel": {
      return { ...state, selectedPrimaryPanel: action.panel };
    }

    case "set_view_mode": {
      return { ...state, viewMode: action.viewMode };
    }

    case "set_show_video_panel": {
      return { ...state, showVideoPanel: action.showVideoPanel };
    }

    case "set_show_editor": {
      return { ...state, showEditor: action.showEditor };
    }

    default: {
      return state;
    }
  }
}

export const getShowCommandPalette = (state: UIState) => state.layout.showCommandPalette;
export const getSelectedPrimaryPanel = (state: UIState) => state.layout.selectedPrimaryPanel;
export const getViewMode = (state: UIState) => state.layout.viewMode;
export const getShowVideoPanel = (state: UIState) => state.layout.showVideoPanel;
export const getShowEditor = (state: UIState) => state.layout.showEditor;