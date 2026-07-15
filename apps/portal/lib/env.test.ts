/**
 * Tests for Runtime Environment Validation (lib/env.ts).
 *
 * Strategy:
 *   - The module caches validated env in an internal singleton (`_env`).
 *   - `resetEnv()` clears that cache between tests.
 *   - We import fresh each test to get a clean reference, then call resetEnv().
 *   - process.env is carefully saved/restored in afterEach.
 */

import { env, resetEnv, getEnvErrors } from "@/lib/env";

/**
 * Helper to set env vars that TypeScript considers read-only (e.g. NODE_ENV).
 * Uses delete + defineProperty to bypass the readonly restriction.
 */
function setEnvVar(name: string, value: string | undefined): void {
  const env = process.env as Record<string, string | undefined>;
  if (value === undefined) {
    delete env[name];
  } else {
    env[name] = value;
  }
}

describe("env validation", () => {
  // Snapshot of env vars we touch
  const ENV_KEYS = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_KEY",
    "DATABASE_URL",
    "PORT",
    "NODE_ENV",
    "REDIS_URL",
    "OLLAMA_URL",
    "OLLAMA_DEFAULT_MODEL",
    "OPENAI_API_KEY",
    "OPENAI_MODEL",
    "ENABLE_LOAD_ADAPTIVE_TEST",
    "DISABLE_RATE_LIMIT",
    "CI",
    "INNGEST_EVENT_KEY",
    "OTEL_SERVICE_NAME",
    "PORTAL_VERSION",
  ] as const;

  const TEST_SUPABASE_URL = "https://example.supabase.co";
  const TEST_SUPABASE_ANON_KEY = "test-anon-key";

  const saved: Record<string, string | undefined> = {};

  beforeAll(() => {
    for (const key of ENV_KEYS) {
      saved[key] = process.env[key];
    }
  });

  afterEach(() => {
    // Restore env vars via helper to handle readonly properties
    for (const key of ENV_KEYS) {
      setEnvVar(key, saved[key]);
    }
    resetEnv();
  });

  it("throws when public Supabase credentials are missing", () => {
    for (const key of ENV_KEYS) {
      setEnvVar(key, undefined);
    }
    // Clear the DISABLE_RATE_LIMIT that setupTests.ts sets
    setEnvVar("DISABLE_RATE_LIMIT", undefined);

    resetEnv();
    expect(() => {
      void env.PORT;
    }).toThrow(/Invalid environment variables/i);
  });

  it("provides defaults when non-supabase env vars are missing", () => {
    for (const key of ENV_KEYS) {
      setEnvVar(key, undefined);
    }

    // Required public Supabase vars for validation
    setEnvVar("NEXT_PUBLIC_SUPABASE_URL", TEST_SUPABASE_URL);
    setEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", TEST_SUPABASE_ANON_KEY);

    // Clear the DISABLE_RATE_LIMIT that setupTests.ts sets
    setEnvVar("DISABLE_RATE_LIMIT", undefined);

    resetEnv();

    expect(env.OLLAMA_URL).toBe("http://localhost:11434");
    expect(env.OLLAMA_DEFAULT_MODEL).toBe("gemma4:latest");
    expect(env.PORT).toBe(3000);
    expect(env.NODE_ENV).toBe("development");
    expect(env.OTEL_SERVICE_NAME).toBe("arch-portal");
    expect(env.PORTAL_VERSION).toBe("1.0.0");
    expect(env.CI).toBe(false);
    expect(env.DISABLE_RATE_LIMIT).toBe(false);
  });

  it("picks up custom env var values", () => {
    setEnvVar("NEXT_PUBLIC_SUPABASE_URL", TEST_SUPABASE_URL);
    setEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", TEST_SUPABASE_ANON_KEY);
    setEnvVar("PORT", "8080");
    setEnvVar("NODE_ENV", "production");
    setEnvVar("OTEL_SERVICE_NAME", "my-custom-service");
    resetEnv();

    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe(TEST_SUPABASE_URL);
    expect(env.PORT).toBe(8080);
    expect(env.NODE_ENV).toBe("production");
    expect(env.OTEL_SERVICE_NAME).toBe("my-custom-service");
  });

  it("coerces PORT to a number", () => {
    setEnvVar("NEXT_PUBLIC_SUPABASE_URL", TEST_SUPABASE_URL);
    setEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", TEST_SUPABASE_ANON_KEY);
    setEnvVar("PORT", "4000");
    resetEnv();

    expect(env.PORT).toBe(4000);
    expect(typeof env.PORT).toBe("number");
  });

  it("transforms feature flag strings to booleans", () => {
    setEnvVar("NEXT_PUBLIC_SUPABASE_URL", TEST_SUPABASE_URL);
    setEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", TEST_SUPABASE_ANON_KEY);
    setEnvVar("ENABLE_LOAD_ADAPTIVE_TEST", "true");
    setEnvVar("DISABLE_RATE_LIMIT", "true");
    setEnvVar("CI", "true");
    resetEnv();

    expect(env.ENABLE_LOAD_ADAPTIVE_TEST).toBe(true);
    expect(env.DISABLE_RATE_LIMIT).toBe(true);
    expect(env.CI).toBe(true);
  });

  it("treats non-true feature flags as false", () => {
    setEnvVar("NEXT_PUBLIC_SUPABASE_URL", TEST_SUPABASE_URL);
    setEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", TEST_SUPABASE_ANON_KEY);
    setEnvVar("ENABLE_LOAD_ADAPTIVE_TEST", "0");
    setEnvVar("DISABLE_RATE_LIMIT", "FALSE");
    setEnvVar("CI", undefined);
    resetEnv();

    expect(env.ENABLE_LOAD_ADAPTIVE_TEST).toBe(false);
    expect(env.DISABLE_RATE_LIMIT).toBe(false);
    expect(env.CI).toBe(false);
  });

  it("resetEnv clears cached values so new env vars take effect", () => {
    setEnvVar("NEXT_PUBLIC_SUPABASE_URL", TEST_SUPABASE_URL);
    setEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", TEST_SUPABASE_ANON_KEY);

    setEnvVar("PORT", undefined);
    resetEnv();
    expect(env.PORT).toBe(3000);

    setEnvVar("PORT", "9999");
    resetEnv();

    expect(env.PORT).toBe(9999);
  });

  it("getEnvErrors returns null when validation passes", () => {
    setEnvVar("NEXT_PUBLIC_SUPABASE_URL", TEST_SUPABASE_URL);
    setEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", TEST_SUPABASE_ANON_KEY);
    resetEnv();
    // Access env to trigger parsing
    const _ = env.PORT;
    expect(getEnvErrors()).toBeNull();
    void _;
  });

  it("reads optional vars as undefined when not set", () => {
    setEnvVar("NEXT_PUBLIC_SUPABASE_URL", TEST_SUPABASE_URL);
    setEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", TEST_SUPABASE_ANON_KEY);

    setEnvVar("REDIS_URL", undefined);
    setEnvVar("OPENAI_API_KEY", undefined);
    resetEnv();

    expect(env.REDIS_URL).toBeUndefined();
    expect(env.OPENAI_API_KEY).toBeUndefined();
  });
});
