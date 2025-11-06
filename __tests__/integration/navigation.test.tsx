import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import OTTHomeScreen from "@/app/(tabs)";
import DetailsScreen from "@/app/ott/details";
import PlayerScreen from "@/app/ott/player";

// Mock useTVEventHandler at the very top (before any imports)
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");

  // Create a custom mock that includes useTVEventHandler
  const customRN = Object.create(RN);
  customRN.useTVEventHandler = jest.fn();

  return customRN;
});

// Mock expo-router at the top level
const mockPush = jest.fn();
const mockBack = jest.fn();
const mockSetOptions = jest.fn();
const mockRouter = { push: mockPush, back: mockBack };
const mockNavigation = { setOptions: mockSetOptions };
let mockSearchParams = { id: "bbb-hls" };

jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => mockRouter),
  useLocalSearchParams: jest.fn(() => mockSearchParams),
  useNavigation: jest.fn(() => mockNavigation),
}));

describe("Integration: Home → Details → Player Navigation Flow", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockSetOptions.mockClear();
    mockSearchParams = { id: "bbb-hls" };
  });

  it("should navigate from Home to Details when catalog item is pressed", async () => {
    const { getByTestId } = render(<OTTHomeScreen />);

    // Wait for catalog to load
    await waitFor(() => {
      expect(getByTestId("catalog-list")).toBeTruthy();
    });

    // Find and press the first catalog item by ID
    const firstItem = getByTestId("catalog-item-bbb-hls");
    fireEvent.press(firstItem);

    // Verify navigation was called with correct params
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/ott/details",
      params: { id: "bbb-hls" },
    });
  });

  it("should navigate from Details to Player when Play button is pressed", async () => {
    const { getByTestId } = render(<DetailsScreen />);

    // Wait for details to render
    await waitFor(() => {
      expect(getByTestId("details-title")).toBeTruthy();
    });

    // Press the Play button
    const playButton = getByTestId("play-button");
    fireEvent.press(playButton);

    // Verify navigation to player
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/ott/player",
      params: { id: "bbb-hls" },
    });
  });

  it("should render Player screen with correct video", async () => {
    const { getByTestId } = render(<PlayerScreen />);

    // Verify player title is rendered
    await waitFor(() => {
      expect(getByTestId("player-title")).toBeTruthy();
    });

    // Verify video player exists
    expect(getByTestId("video-player")).toBeTruthy();
  });

  it("should navigate back from Details when Back button is pressed", async () => {
    const { getByTestId } = render(<DetailsScreen />);

    await waitFor(() => {
      expect(getByTestId("back-button")).toBeTruthy();
    });

    const backButton = getByTestId("back-button");
    fireEvent.press(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it("should show playing status in Player screen overlay", async () => {
    const { getByTestId, getByText } = render(<PlayerScreen />);

    // Verify player title is shown
    await waitFor(() => {
      expect(getByTestId("player-title")).toBeTruthy();
    });

    // Initial state should show "Playing" status
    expect(getByText("▶ Playing")).toBeTruthy();

    // Verify video player exists
    expect(getByTestId("video-player")).toBeTruthy();
  });

  it("should navigate back to Details when video ends", async () => {
    const { getByTestId } = render(<PlayerScreen />);

    // Wait for video player to render
    await waitFor(() => {
      expect(getByTestId("video-player")).toBeTruthy();
    });

    // Simulate video end event
    const videoPlayer = getByTestId("video-player");
    const onEndProp = videoPlayer.props.onEnd;

    // Call the onEnd callback
    if (onEndProp) {
      onEndProp();
    }

    // Verify navigation back was called
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
