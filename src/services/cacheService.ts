/**
 * Cache Service
 *
 * Implements memory caching with TTL to reduce Firestore requests and costs
 * Provides throttling and debouncing for API requests
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export interface CacheConfig {
  defaultTTL: number; // Default TTL in milliseconds
  maxEntries: number; // Maximum cache entries
}

class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private requestTimestamps = new Map<string, number>();
  private config: CacheConfig = {
    defaultTTL: 2 * 60 * 1000, // 2 minutes default
    maxEntries: 100,
  };

  /**
   * Get data from cache if valid, otherwise return null
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    const now = Date.now();

    // Check if cache entry is still valid
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    console.log(`💾 Cache HIT for key: ${key}`);
    return entry.data;
  }

  /**
   * Set data in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    // Clean up old entries if cache is full
    if (this.cache.size >= this.config.maxEntries) {
      this.cleanupExpiredEntries();

      // If still full, remove oldest entry
      if (this.cache.size >= this.config.maxEntries) {
        const oldestKey = this.cache.keys().next().value as string;
        if (oldestKey) {
          this.cache.delete(oldestKey);
        }
      }
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
    };

    this.cache.set(key, entry as CacheEntry<unknown>);
    console.log(`💾 Cache SET for key: ${key}, TTL: ${entry.ttl}ms`);
  }

  /**
   * Remove specific cache entry
   */
  remove(key: string): void {
    this.cache.delete(key);
    console.log(`💾 Cache REMOVED for key: ${key}`);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.requestTimestamps.clear();
    console.log("💾 Cache CLEARED");
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach((key) => this.cache.delete(key));

    if (expiredKeys.length > 0) {
      console.log(`💾 Cache cleaned up ${expiredKeys.length} expired entries`);
    }
  }

  /**
   * Check if a request should be throttled
   * Returns true if request should be blocked, false if allowed
   */
  shouldThrottleRequest(key: string, minInterval: number = 1000): boolean {
    const lastRequestTime = this.requestTimestamps.get(key);
    const now = Date.now();

    if (!lastRequestTime) {
      this.requestTimestamps.set(key, now);
      return false;
    }

    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < minInterval) {
      console.log(
        `🚫 Request THROTTLED for key: ${key}, ${timeSinceLastRequest}ms since last request`
      );
      return true;
    }

    this.requestTimestamps.set(key, now);
    return false;
  }

  /**
   * Create a debounced function that delays execution
   */
  debounce<TArgs extends unknown[]>(
    func: (...args: TArgs) => void,
    delay: number
  ): (...args: TArgs) => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: TArgs) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp <= entry.ttl) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      requestTimestamps: this.requestTimestamps.size,
    };
  }
}

// Singleton instance
export const cacheService = new CacheService();
export default cacheService;
