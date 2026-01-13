import { generateObject, generateText, stepCountIs } from "ai";
import { inngest } from "../client";
import { z } from "zod";
import { openrouter } from "@/lib/openrouter";
import { FrameType } from "@/types/project";
import { ANALYSIS_PROMPT, GENERATION_SYSTEM_PROMPT } from "@/lib/prompt";
import prisma from "@/lib/prisma";
import { BASE_VARIABLES, THEME_LIST } from "@/lib/themes";
import { unsplashTool } from "../tool";

// Schema for individual screen
const ScreenSchema = z.object({
  id: z
    .string()
    .describe(
      "Unique identifier for the screen (e.g., 'home-dashboard', 'profile-settings', 'transaction-history'). Use kebab-case."
    ),
  name: z
    .string()
    .describe(
      "Short, descriptive name of the screen (e.g., 'Home Dashboard', 'Profile', 'Transaction History')"
    ),
  purpose: z
    .string()
    .describe(
      "One clear sentence explaining what this screen accomplishes for the user and its role in the app"
    ),
  visualDescription: z
    .string()
    .describe(
      "A dense, high-fidelity visual directive (like an image generation prompt). Describe the layout, specific data examples (e.g. 'Oct-Mar'), component hierarchy, and physical attributes (e.g. 'Chunky cards', 'Floating header','Floating action button', 'Bottom navigation',Header with user avatar)."
    ),
});

// Schema for COMPLETE app - enforces minimum 12 screens
const CompleteAppSchema = z.object({
  theme: z
    .string()
    .describe(
      "The specific visual theme ID (e.g., 'midnight', 'ocean-breeze', 'neo-brutalism')."
    ),
  appName: z
    .string()
    .describe("A catchy, memorable name for the app based on the user's request."),
  totalScreenCount: z
    .number()
    .min(12)
    .max(24)
    .describe("Total screens to generate. MUST be 18-20 for complete app."),
  screens: z
    .array(ScreenSchema)
    .min(12)
    .max(24)
    .describe(
      "MANDATORY 12-24 screens: 4 onboarding + 3 auth + 8-10 core features + 4-5 secondary screens."
    ),
});

// Schema for single/few screens (only used when explicitly requested)
const SingleScreenSchema = z.object({
  theme: z
    .string()
    .describe(
      "The specific visual theme ID (e.g., 'midnight', 'ocean-breeze', 'neo-brutalism')."
    ),
  screens: z
    .array(ScreenSchema)
    .min(1)
    .max(4)
    .describe("1-4 screens as explicitly requested by user."),
});

export const generateScreens = inngest.createFunction(
  { id: "generate-ui-screens" },
  { event: "ui/generate.screens" },
  async ({ event, step, publish }) => {
    const {
      userId,
      projectId,
      prompt,
      model,
      frames,
      theme: existingTheme,
    } = event.data;
    const CHANNEL = `user:${userId}`;
    const isExistingGeneration = Array.isArray(frames) && frames.length > 0;
    const selectedModel = model || "google/gemini-3-pro-preview";

    await publish({
      channel: CHANNEL,
      topic: "generation.start",
      data: {
        status: "running",
        projectId: projectId,
      },
    });

    //Analyze or plan
    const analysis = await step.run("analyze-and-plan-screens", async () => {
      await publish({
        channel: CHANNEL,
        topic: "analysis.start",
        data: {
          status: "analyzing",
          projectId: projectId,
        },
      });

      const contextHTML = isExistingGeneration
        ? frames
            .map(
              (frame: FrameType) =>
                `<!-- ${frame.title} -->\n${frame.htmlContent}`
            )
            .join("\n\n")
        : "";

      // Check if user explicitly wants just one or few screens
      const wantsSingleScreen = /\b(one screen|single screen|just one|only one|1 screen)\b/i.test(prompt);
      
      const analysisPrompt = isExistingGeneration
        ? `
          USER REQUEST: ${prompt}
          SELECTED THEME: ${existingTheme}

          EXISTING SCREENS (analyze for consistency, navigation, layout, design system):
          ${contextHTML}

         CRITICAL REQUIREMENTS - MAINTAIN DETAILED CONTEXT:
          - **Analyze ALL existing screens' layout, navigation patterns, and design system
          - **Extract the EXACT bottom navigation component structure, icons, and styling - MUST reuse identically
          - **Identify common components (cards, buttons, headers, spacing patterns) for exact reuse
          - **Maintain the same visual hierarchy, spacing scale, typography, and color usage
          - **Generate new screens that seamlessly blend - users should see perfect visual continuity
          - **Context awareness: Each new screen must reference and maintain consistency with ALL previous screens
          - **Design system: All screens must share the same design language and component patterns
        `.trim()
        : `
          USER REQUEST: ${prompt}

          =====================================================
          CRITICAL: YOU MUST GENERATE EXACTLY 18-20 SCREENS
          =====================================================
          
          This is a COMPLETE mobile app. You are generating the ENTIRE app, not just a preview.
          
          MANDATORY SCREEN STRUCTURE (18-20 screens total):
          
          1. ONBOARDING FLOW (4 screens - REQUIRED):
             - Screen 1: Splash/Welcome - App logo, tagline, "Get Started" button
             - Screen 2: Feature Intro 1 - First key feature explanation
             - Screen 3: Feature Intro 2 - Second key feature explanation  
             - Screen 4: Get Started - Final CTA, "Sign Up" / "Login" buttons
          
          2. AUTHENTICATION (3 screens - REQUIRED):
             - Screen 5: Login - Email/password, social login options
             - Screen 6: Sign Up - Registration form
             - Screen 7: Forgot Password - Email input for reset
          
          3. CORE FEATURES (8-10 screens - based on app type):
             - Screen 8: Home/Dashboard - Main app screen
             - Screen 9-15: All primary feature screens (lists, details, actions)
             - Think about EVERY feature the app would have
          
          4. SECONDARY FEATURES (4-5 screens - REQUIRED):
             - Profile screen
             - Settings screen
             - Search/Explore screen
             - Notifications screen
             - Help/About screen
          
          SET totalScreenCount TO: 18, 19, or 20
          
          DO NOT generate only 4 screens. That is WRONG.
          The schema REQUIRES minimum 12 screens. Generate 18-20.
        `.trim();

      // Use appropriate schema based on request type
      // - For existing generations (adding screens): use SingleScreenSchema (1-4 new screens)
      // - For single screen requests: use SingleScreenSchema
      // - For new complete apps: use CompleteAppSchema (12-24 screens)
      const schemaToUse = (isExistingGeneration || wantsSingleScreen) 
        ? SingleScreenSchema 
        : CompleteAppSchema;
      
      const { object } = await generateObject({
        model: openrouter.chat(selectedModel),
        schema: schemaToUse,
        system: ANALYSIS_PROMPT,
        prompt: analysisPrompt,
      });

      const themeToUse = isExistingGeneration ? existingTheme : object.theme;

      if (!isExistingGeneration) {
        await prisma.project.update({
          where: {
            id: projectId,
            userId: userId,
          },
          data: { theme: themeToUse },
        });
      }

      await publish({
        channel: CHANNEL,
        topic: "analysis.complete",
        data: {
          status: "generating",
          theme: themeToUse,
          totalScreens: object.screens.length,
          screens: object.screens,
          projectId: projectId,
        },
      });

      return { ...object, themeToUse };
    });

    // Actuall generation of each screens
    const generatedFrames: typeof frames = isExistingGeneration
      ? [...frames]
      : [];

    for (let i = 0; i < analysis.screens.length; i++) {
      const screenPlan = analysis.screens[i];
      const selectedTheme = THEME_LIST.find(
        (t) => t.id === analysis.themeToUse
      );

      //Combine the Theme Styles + Base Variable
      const fullThemeCSS = `
        ${BASE_VARIABLES}
        ${selectedTheme?.style || ""}
      `;

      // Get all previous existing or generated frames
      const allPreviousFrames = generatedFrames.slice(0, i);
      const previousFramesContext = allPreviousFrames
        .map((f: FrameType) => `<!-- ${f.title} -->\n${f.htmlContent}`)
        .join("\n\n");

      await step.run(`generated-screen-${i}`, async () => {
        const result = await generateText({
          model: openrouter.chat(selectedModel),
          system: GENERATION_SYSTEM_PROMPT,
          tools: {
            searchUnsplash: unsplashTool,
          },
          stopWhen: stepCountIs(5),
          prompt: `
          - Screen ${i + 1}/${analysis.screens.length}
          - Screen ID: ${screenPlan.id}
          - Screen Name: ${screenPlan.name}
          - Screen Purpose: ${screenPlan.purpose}

          VISUAL DESCRIPTION: ${screenPlan.visualDescription}

          EXISTING SCREENS CONTEXT (CRITICAL - MAINTAIN CONSISTENCY):
          ${previousFramesContext || "No previous screens - this is the first screen"}

          THEME VARIABLES (Reference ONLY - already defined in parent, do NOT redeclare these):
          ${fullThemeCSS}

        CRITICAL REQUIREMENTS - MAINTAIN DETAILED CONTEXT ACROSS ALL SCREENS:

        **CONTEXT MAINTENANCE (HIGHEST PRIORITY):**
        - **If previous screens exist:** You MUST extract and EXACTLY reuse their design patterns:
          - Copy the EXACT bottom navigation HTML structure, classes, and styling - do NOT recreate or modify it
          - Extract header components and reuse their exact styling (glassmorphism, spacing, layout)
          - Reuse card designs, button styles, spacing patterns from previous screens
          - Maintain the exact same visual hierarchy, spacing scale (4px, 8px, 16px, 24px, 32px), and color usage
          - Use the same icon sizes and styles (w-4, w-5, w-6, w-8)
          - Keep typography hierarchy consistent (text sizes, font weights)
        - **This screen MUST look like it belongs in the same app** - users should see seamless visual continuity
        - **Design System Consistency:** All screens share the same design language, components, and patterns

        **PROFESSIONAL DESIGN STANDARDS:**
        - Avoid "vibe coded UI" - no excessive purple gradients, neon colors, or cluttered layouts
        - Use clean, minimal design with generous whitespace (professional spacing)
        - Modern, purposeful aesthetics - subtle gradients only when meaningful
        - Clear visual hierarchy - primary actions prominent, secondary actions subtle
        - Use modern Lucide icons exclusively (outline style preferred)
        - Ensure minimum 44x44px touch targets for all interactive elements

        1. **Generate ONLY raw HTML markup for this mobile app screen using Tailwind CSS.**
          Use Tailwind classes for layout, spacing, typography, shadows, etc.
          Use theme CSS variables ONLY for color-related properties (bg-[var(--background)], text-[var(--foreground)], border-[var(--border)], ring-[var(--ring)], etc.)
        2. **All content must be inside a single root <div> that controls the layout.**
          - No overflow classes on the root.
          - All scrollable content must be in inner containers with hidden scrollbars: [&::-webkit-scrollbar]:hidden scrollbar-none
        3. **For absolute overlays (maps, bottom sheets, modals, etc.):**
          - Use \`relative w-full h-screen\` on the top div of the overlay.
        4. **For regular content:**
          - Use \`w-full h-full min-h-screen\` on the top div.
        5. **Do not use h-screen on inner content unless absolutely required.**
          - Height must grow with content; content must be fully visible inside an iframe.
        6. **For z-index layering:**
          - Ensure absolute elements do not block other content unnecessarily.
        7. **Output raw HTML only, starting with <div>.**
          - Do not include markdown, comments, <html>, <body>, or <head>.
        8. **Hardcode a style only if a theme variable is not needed for that element.**
        9. **Ensure iframe-friendly rendering:**
          - All elements must contribute to the final scrollHeight so your parent iframe can correctly resize.
        Generate the complete, production-ready HTML for this screen now
      `.trim(),
        });

        let finalHtml = result.text ?? "";
        const match = finalHtml.match(/<div[\s\S]*<\/div>/);
        finalHtml = match ? match[0] : finalHtml;
        finalHtml = finalHtml.replace(/```/g, "");

        //Create the frame
        const frame = await prisma.frame.create({
          data: {
            projectId,
            title: screenPlan.name,
            htmlContent: finalHtml,
          },
        });

        // Add to generatedFrames for next iteration's context
        generatedFrames.push(frame);

        await publish({
          channel: CHANNEL,
          topic: "frame.created",
          data: {
            frame: {
              ...frame,
              isLoading: false,
            },
            screenId: screenPlan.id,
            frameId: frame.id,
            projectId: projectId,
          },
        });

        return { success: true, frame: frame };
      });
    }

    await publish({
      channel: CHANNEL,
      topic: "generation.complete",
      data: {
        status: "completed",
        projectId: projectId,
      },
    });
  }
);
