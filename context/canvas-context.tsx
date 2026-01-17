/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeSubscriptionToken } from "@/app/action/realtime";
import { THEME_LIST, ThemeType } from "@/lib/themes";
import { FrameType } from "@/types/project";
import { POPULAR_FONTS, FontOption, DEFAULT_FONT } from "@/constant/fonts";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type LoadingStatusType =
  | "idle"
  | "running"
  | "analyzing"
  | "generating"
  | "completed";

interface CanvasContextType {
  theme?: ThemeType;
  setTheme: (id: string) => void;
  themes: ThemeType[];

  font?: FontOption;
  setFont: (id: string) => void;
  fonts: FontOption[];

  frames: FrameType[];
  setFrames: (frames: FrameType[]) => void;
  updateFrame: (id: string, data: Partial<FrameType>) => void;
  addFrame: (frame: FrameType) => void;

  selectedFrameId: string | null;
  selectedFrame: FrameType | null;
  setSelectedFrameId: (id: string | null) => void;

  loadingStatus: LoadingStatusType | null;
  setLoadingStatus: (status: LoadingStatusType | null) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({
  children,
  initialFrames,
  initialThemeId,
  hasInitialData,
  projectId,
}: {
  children: ReactNode;
  initialFrames: FrameType[];
  initialThemeId?: string;
  hasInitialData: boolean;
  projectId: string | null;
}) => {
  const [themeId, setThemeId] = useState<string>(
    initialThemeId || THEME_LIST[0].id
  );

  const [fontId, setFontId] = useState<string>(DEFAULT_FONT);

  const [frames, setFrames] = useState<FrameType[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType | null>(
    null
  );

  const [prevProjectId, setPrevProjectId] = useState(projectId);
  if (projectId !== prevProjectId) {
    setPrevProjectId(projectId);
    setLoadingStatus(hasInitialData ? "idle" : "running");
    setFrames(initialFrames);
    setThemeId(initialThemeId || THEME_LIST[0].id);
    setSelectedFrameId(null);
  }

  const theme = THEME_LIST.find((t) => t.id === themeId);
  const font = POPULAR_FONTS.find((f) => f.id === fontId) || POPULAR_FONTS.find((f) => f.id === DEFAULT_FONT);
  const selectedFrame =
    selectedFrameId && frames.length !== 0
      ? frames.find((f) => f.id === selectedFrameId) || null
      : null;

  //Update the LoadingState Inngest Realtime event
  const subscriptionResult = useInngestSubscription({
    refreshToken: fetchRealtimeSubscriptionToken,
  });
  const { freshData, error, state } = subscriptionResult;

  // Handle subscription errors gracefully
  useEffect(() => {
    if (error) {
      // Only log meaningful errors (with message, name, or string content)
      // Empty error objects are usually non-critical WebSocket connection issues
      // that the library handles automatically with retries
      if (
        typeof error === "string" ||
        (error && (error.message || error.name))
      ) {
        console.warn("[Realtime] Subscription error:", error);
      }
    }
  }, [error]);

  // Suppress empty WebSocket error objects from console
  // These are non-critical connection issues that the library handles with automatic retries
  useEffect(() => {
    const originalError = console.error;
    let errorInterceptor: typeof console.error;
    
    // Create error interceptor that only suppresses the specific empty WebSocket error pattern
    errorInterceptor = (...args: any[]) => {
      // Pattern: console.error({}) from WebSocket onerror handler
      // This happens when WebSocket connection fails but the error object is empty/non-serializable
      if (
        args.length === 1 &&
        typeof args[0] === "object" &&
        args[0] !== null &&
        Object.keys(args[0]).length === 0 &&
        args[0].constructor === Object
      ) {
        // Check call stack to confirm it's from WebSocket error handler
        // This is a safety check to avoid suppressing legitimate empty object errors
        try {
          const stack = new Error().stack || "";
          if (stack.includes("#ws.onerror") || stack.includes("WebSocket") || stack.includes("realtime")) {
            // Suppress this specific empty error - it's a non-critical connection issue
            // The @inngest/realtime library automatically retries connections
            return;
          }
        } catch {
          // If stack trace check fails, let the error through to be safe
        }
      }
      // Pass through all other errors
      originalError.apply(console, args);
    };

    // Intercept to suppress empty WebSocket errors
    console.error = errorInterceptor;

    return () => {
      console.error = originalError;
    };
  }, []);

  // Monitor subscription state for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && state === "error") {
      console.log("[Realtime] Subscription state:", state, error ? "with error" : "no error");
    }
  }, [state, error]);

  // Log subscription status for debugging (especially in production)
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      // Log subscription status to help debug WebSocket issues
      console.log("[Realtime] Subscription status:", {
        hasFreshData: !!freshData,
        dataLength: freshData?.length || 0,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      });
    }
  }, [freshData]);

  useEffect(() => {
    if (!freshData || freshData.length === 0) return;

    freshData.forEach((message) => {
      const { data, topic } = message;

      if (data.projectId !== projectId) return;

      switch (topic) {
        case "generation.start":
          const status = data.status;
          setLoadingStatus(status);
          break;
        case "analysis.start":
          setLoadingStatus("analyzing");
          break;
        case "analysis.complete":
          setLoadingStatus("generating");
          if (data.theme) setThemeId(data.theme);

          if (data.screens && data.screens.length > 0) {
            const skeletonFrames: FrameType[] = data.screens.map((s: any) => ({
              id: s.id,
              title: s.name,
              htmlContent: "",
              isLoading: true,
            }));
            setFrames((prev) => [...prev, ...skeletonFrames]);
          }
          break;
        case "frame.created":
          if (data.frame) {
            setFrames((prev) => {
              const newFrames = [...prev];
              // Match by frame.id (database ID) or frameId first, then fallback to screenId (kebab-case)
              const frameIdToMatch = data.frameId || data.frame.id;
              const idx = newFrames.findIndex(
                (f) => f.id === frameIdToMatch || f.id === data.screenId
              );
              if (idx !== -1) {
                newFrames[idx] = { ...data.frame, isLoading: false };
              } else {
                newFrames.push({ ...data.frame, isLoading: false });
              }
              return newFrames;
            });
          }
          break;
        case "generation.complete":
          setLoadingStatus("completed");
          setTimeout(() => {
            setLoadingStatus("idle");
          }, 100);
          break;
        default:
          break;
      }
    });
  }, [projectId, freshData]);

  const addFrame = useCallback((frame: FrameType) => {
    setFrames((prev) => [...prev, frame]);
  }, []);

  const updateFrame = useCallback((id: string, data: Partial<FrameType>) => {
    setFrames((prev) => {
      return prev.map((frame) =>
        frame.id === id ? { ...frame, ...data } : frame
      );
    });
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        theme,
        setTheme: setThemeId,
        themes: THEME_LIST,
        font,
        setFont: setFontId,
        fonts: POPULAR_FONTS,
        frames,
        setFrames,
        selectedFrameId,
        selectedFrame,
        setSelectedFrameId,
        updateFrame,
        addFrame,
        loadingStatus,
        setLoadingStatus,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used inside CanvasProvider");
  return ctx;
};
