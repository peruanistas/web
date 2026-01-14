import { useEffect, useState, useRef, useCallback } from 'react';
import SlotCounter from 'react-slot-counter';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const LG_BREAKPOINT = 868; // Tailwind lg breakpoint

interface UserStatsResponse {
  success: boolean;
  data: {
    users_count: number;
  };
}

export function UserCountBadge() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth >= LG_BREAKPOINT
  );
  const isMountedRef = useRef(true);

  // Track screen size to determine visibility
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsVisible(e.matches);
    };

    // Set initial value
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const fetchUserCount = useCallback(async (): Promise<number | null> => {
    // Don't fetch if unmounted
    if (!isMountedRef.current) return null;

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/user_stats`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user stats');
      }

      const data: UserStatsResponse = await response.json();

      if (!data.success) {
        throw new Error('API returned unsuccessful response');
      }

      return data.data.users_count;
    } catch (error) {
      console.error('Error fetching user count:', error);
      return null;
    }
  }, []);

  // Only fetch when visible
  useEffect(() => {
    if (!isVisible) return;

    isMountedRef.current = true;

    const fetchAndUpdate = async () => {
      const count = await fetchUserCount();

      if (!isMountedRef.current) return;

      if (count !== null) {
        setUserCount(count);
      }
      setIsLoading(false);
    };

    // Initial fetch
    fetchAndUpdate();

    // Poll every 2 seconds
    const intervalId = setInterval(fetchAndUpdate, 2000);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [fetchUserCount, isVisible]);

  // Don't render if not visible, loading, or fetch failed
  if (!isVisible || isLoading || userCount === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-md">
      {/* Live indicator dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
      </span>

      {/* Counter */}
      <span className="text-sm text-red-700 whitespace-nowrap">
        Somos{' '}
        <SlotCounter
          value={userCount}
          autoAnimationStart={true}
          duration={0.6}
          charClassName="font-bold"
          separatorClassName="font-bold"
          useMonospaceWidth={false}
        />
        {' '}peruanistas
      </span>
    </div>
  );
}
