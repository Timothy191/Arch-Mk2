/**
 * Integration tests for @repo/rate-limiter
 *
 * Tests all three strategies (fixed-window, sliding-window, token-bucket)
 * with the MemoryStore to verify end-to-end rate limiting behavior.
 */
import { MemoryStore } from "../stores/memory.store";
import { FixedWindowStrategy } from "../strategies/fixed-window";
import { SlidingWindowStrategy } from "../strategies/sliding-window";
import { TokenBucketStrategy } from "../strategies/token-bucket";
import { RateLimiter } from "../index";
import type { IStore } from "../interfaces";

describe("rate-limiter-integration", () => {
  describe("with MemoryStore", () => {
    it("should allow requests within limit (fixed-window)", async () => {
      const store = new MemoryStore();
      const strategy = new FixedWindowStrategy();
      const limiter = new RateLimiter({
        store,
        strategy,
        limit: 5,
        windowMs: 60000,
      });

      for (let i = 0; i < 5; i++) {
        const result = await limiter.check("test-key");
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(4 - i);
      }
    });

    it("should block requests exceeding limit (fixed-window)", async () => {
      const store = new MemoryStore();
      const strategy = new FixedWindowStrategy();
      const limiter = new RateLimiter({
        store,
        strategy,
        limit: 3,
        windowMs: 60000,
      });

      for (let i = 0; i < 3; i++) {
        const result = await limiter.check("block-key");
        expect(result.allowed).toBe(true);
      }

      const blocked = await limiter.check("block-key");
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
    });

    it("should allow requests within limit (sliding-window)", async () => {
      const store = new MemoryStore();
      const strategy = new SlidingWindowStrategy();
      const limiter = new RateLimiter({
        store,
        strategy,
        limit: 3,
        windowMs: 60000,
      });

      for (let i = 0; i < 3; i++) {
        const result = await limiter.check("sliding-key");
        expect(result.allowed).toBe(true);
      }
    });

    it("should block requests exceeding limit (sliding-window)", async () => {
      const store = new MemoryStore();
      const strategy = new SlidingWindowStrategy();
      const limiter = new RateLimiter({
        store,
        strategy,
        limit: 2,
        windowMs: 60000,
      });

      await limiter.check("sliding-block");
      await limiter.check("sliding-block");
      const blocked = await limiter.check("sliding-block");
      expect(blocked.allowed).toBe(false);
    });

    it("should allow burst then throttle (token-bucket)", async () => {
      const store = new MemoryStore();
      const strategy = new TokenBucketStrategy();
      const limiter = new RateLimiter({
        store,
        strategy,
        limit: 5,
        windowMs: 60000,
      });

      // First 5 should be allowed
      for (let i = 0; i < 5; i++) {
        const result = await limiter.check("bucket-key");
        expect(result.allowed).toBe(true);
      }

      // 6th should be blocked
      const blocked = await limiter.check("bucket-key");
      expect(blocked.allowed).toBe(false);
      expect(blocked.retryAfter).toBeGreaterThan(0);
    });

    it("should handle multiple keys independently", async () => {
      const store = new MemoryStore();
      const strategy = new FixedWindowStrategy();
      const limiter = new RateLimiter({
        store,
        strategy,
        limit: 2,
        windowMs: 60000,
      });

      // Use key-1 twice
      await limiter.check("key-1");
      await limiter.check("key-1");
      expect((await limiter.check("key-1")).allowed).toBe(false);

      // key-2 should still have full limit
      expect((await limiter.check("key-2")).allowed).toBe(true);
      expect((await limiter.check("key-2")).allowed).toBe(true);
      expect((await limiter.check("key-2")).allowed).toBe(false);
    });

    it("should support custom key prefixes", async () => {
      const store = new MemoryStore();
      const strategy = new FixedWindowStrategy();
      const limiter = new RateLimiter({
        store,
        strategy,
        limit: 1,
        windowMs: 60000,
        keyPrefix: "custom-prefix:",
      });

      const result = await limiter.check("test");
      expect(result.allowed).toBe(true);
    });

    it("should set retryAfter for blocked requests", async () => {
      const store = new MemoryStore();
      const strategy = new FixedWindowStrategy();
      const limiter = new RateLimiter({
        store,
        strategy,
        limit: 1,
        windowMs: 60000,
      });

      await limiter.check("retry-key");
      const blocked = await limiter.check("retry-key");
      expect(blocked.allowed).toBe(false);
      expect(blocked.retryAfter).toBeGreaterThan(0);
      expect(blocked.retryAfter).toBeLessThanOrEqual(60);
    });

    it("should work with custom IStore implementation", async () => {
      // Test with a custom in-memory store
      const customStore: IStore = {
        get: jest.fn().mockResolvedValue(null),
        set: jest.fn().mockResolvedValue(undefined),
      };
      const strategy = new FixedWindowStrategy();
      const limiter = new RateLimiter({
        store: customStore,
        strategy,
        limit: 5,
        windowMs: 60000,
      });

      const result = await limiter.check("custom-store");
      expect(result.allowed).toBe(true);
      expect(customStore.get).toHaveBeenCalled();
      expect(customStore.set).toHaveBeenCalled();
    });
  });
});
