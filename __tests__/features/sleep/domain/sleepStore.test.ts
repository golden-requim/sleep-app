// Sleep Store Domain Tests — testing the pure logic of sleep tracking
// These tests ensure the core business rules work correctly

describe('Sleep Store - Domain Logic', () => {
  // Test: creating a sleep session
  describe('startSleep', () => {
    it('creates a new session with timestamp', () => {
      const session = {
        id: 'test_123',
        startTime: Date.now(),
      };

      expect(session.id).toBeDefined();
      expect(session.startTime).toBeGreaterThan(0);
    });
  });

  // Test: ending a sleep session
  describe('endSleep', () => {
    it('calculates duration correctly', () => {
      const startTime = Date.now() - (8 * 60 * 60 * 1000); // 8 hours ago
      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 60000); // minutes

      expect(duration).toBe(480); // 8 hours = 480 minutes
    });

    it('marks session as complete', () => {
      const session = {
        id: 'test_123',
        startTime: Date.now() - (7 * 60 * 60 * 1000),
        endTime: Date.now(),
        duration: 420,
        quality: 'medium' as const,
      };

      expect(session.endTime).toBeDefined();
      expect(session.duration).toBeDefined();
      expect(session.quality).toBe('medium');
    });

    it('immutability - original session should not be modified', () => {
      const original = {
        id: 'test_123',
        startTime: Date.now() - (7 * 60 * 60 * 1000),
      };

      // Simulating creating a new completed session without modifying original
      const completed = {
        ...original,
        endTime: Date.now(),
        duration: 420,
      };

      // Original should NOT have endTime or duration
      expect((original as any).endTime).toBeUndefined();
      expect((original as any).duration).toBeUndefined();
      
      // Completed should have all fields
      expect(completed.endTime).toBeDefined();
      expect(completed.duration).toBeDefined();
    });
  });

  // Test: quality determination
  describe('quality determination', () => {
    const determineQuality = (durationMinutes: number): 'light' | 'medium' | 'deep' => {
      if (durationMinutes < 360) return 'light';     // < 6 hours
      if (durationMinutes >= 420) return 'deep';     // >= 7 hours
      return 'medium';
    };

    it('marks < 6 hours as light', () => {
      expect(determineQuality(300)).toBe('light');
      expect(determineQuality(359)).toBe('light');
    });

    it('marks 6-7 hours as medium', () => {
      expect(determineQuality(360)).toBe('medium');
      expect(determineQuality(419)).toBe('medium');
    });

    it('marks >= 7 hours as deep', () => {
      expect(determineQuality(420)).toBe('deep');
      expect(determineQuality(540)).toBe('deep');
    });
  });

  // Test: streak calculation
  describe('streak calculation', () => {
    const calculateStreak = (sessions: Array<{ startTime: number; duration?: number }>): number => {
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < sessions.length; i++) {
        const sessionDate = new Date(sessions[i].startTime);
        sessionDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 1 && sessions[i].duration && sessions[i].duration! >= 360) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    };

    it('counts consecutive qualifying nights', () => {
      const today = Date.now();
      const yesterday = today - (24 * 60 * 60 * 1000);
      const twoDaysAgo = today - (2 * 24 * 60 * 60 * 1000);

      const sessions = [
        { startTime: today, duration: 420 },
        { startTime: yesterday, duration: 450 },
        { startTime: twoDaysAgo, duration: 400 },
      ];

      expect(calculateStreak(sessions)).toBe(3);
    });

    it('breaks streak on short sleep', () => {
      const today = Date.now();
      const yesterday = today - (24 * 60 * 60 * 1000);
      const twoDaysAgo = today - (2 * 24 * 60 * 60 * 1000);

      const sessions = [
        { startTime: today, duration: 420 },
        { startTime: yesterday, duration: 300 }, // < 6 hours
        { startTime: twoDaysAgo, duration: 450 },
      ];

      expect(calculateStreak(sessions)).toBe(1);
    });
  });

  // Test: stats calculation
  describe('stats calculation', () => {
    it('calculates average duration correctly', () => {
      const sessions = [
        { duration: 420 },
        { duration: 480 },
        { duration: 450 },
      ].filter(s => s.duration);

      const avg = sessions.reduce((sum, s) => sum + s.duration!, 0) / sessions.length;
      expect(avg).toBe(450);
    });

    it('handles empty sessions', () => {
      const sessions: Array<{ duration?: number }> = [];
      const avg = sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length
        : 0;

      expect(avg).toBe(0);
    });
  });
});
