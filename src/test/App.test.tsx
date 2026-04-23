import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";
import { invoke } from "@tauri-apps/api/core";

test("App renders Antigravity Pulse title", async () => {
  // get_audio_sessions が呼ばれた際に空配列を返すように設定
  (invoke as any).mockResolvedValue([]);

  render(<App />);
  const titleElement = screen.getByText(/Antigravity Pulse/i);
  expect(titleElement).toBeInTheDocument();
});

test("App renders correctly", async () => {
  (invoke as any).mockResolvedValue([]);
  render(<App />);
});
