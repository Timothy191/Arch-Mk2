/**
 * @jest-environment node
 */

const mockFrom = jest.fn();
const mockServiceRoleClient = { from: mockFrom };

jest.mock("@repo/supabase/service-role", () => ({
  createServiceRoleClient: jest.fn(() => mockServiceRoleClient),
}));

jest.mock("next/cache", () => ({
  cacheTag: jest.fn(),
  cacheLife: jest.fn(),
}));

function makeChain(response: any) {
  const chain: any = {
    then(resolve: Function) {
      return resolve(response);
    },
  };
  chain.select = () => chain;
  chain.eq = () => chain;
  chain.order = () => chain;
  chain.limit = () => chain;
  chain.single = () => chain;
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("portal lib/data/access-control", () => {
  describe("getAccessLogsForDepartment", () => {
    it("returns access logs with badge details", async () => {
      const mockLogs = [
        {
          id: "log-1",
          scanned_at: "2026-07-07T08:00:00Z",
          gate_location: "Main Gate",
          access_granted: true,
          denial_reason: null,
          access_type: "personnel",
          direction: "IN",
          badge: {
            qr_code: "QR-001",
            entity_type: "personnel",
            personnel: { first_name: "John", surname: "Doe" },
            visitor: null,
          },
        },
      ];

      mockFrom.mockReturnValue(makeChain({ data: mockLogs, error: null }));

      const { getAccessLogsForDepartment } = require("../access-control");
      const result = await getAccessLogsForDepartment("dept-1");

      expect(mockFrom).toHaveBeenCalledWith("access_logs");
      expect(result).toEqual(mockLogs);
    });

    it("returns empty array when data is null", async () => {
      mockFrom.mockReturnValue(makeChain({ data: null, error: null }));

      const { getAccessLogsForDepartment } = require("../access-control");
      const result = await getAccessLogsForDepartment("dept-1");

      expect(result).toEqual([]);
    });
  });

  describe("getBadgesForDepartment", () => {
    it("returns badges with related entities", async () => {
      const mockBadges = [
        {
          id: "badge-1",
          qr_code: "QR-001",
          entity_type: "personnel",
          is_active: true,
          personnel: { first_name: "John", surname: "Doe" },
        },
      ];

      mockFrom.mockReturnValue(makeChain({ data: mockBadges, error: null }));

      const { getBadgesForDepartment } = require("../access-control");
      const result = await getBadgesForDepartment("dept-1");

      expect(mockFrom).toHaveBeenCalledWith("badges");
      expect(result).toEqual(mockBadges);
    });
  });

  describe("getVisitorsForDepartment", () => {
    it("returns visitors", async () => {
      const mockVisitors = [
        {
          id: "vis-1",
          first_name: "Jane",
          surname: "Smith",
          company: "Acme Corp",
          status: "Checked In",
        },
      ];

      mockFrom.mockReturnValue(makeChain({ data: mockVisitors, error: null }));

      const { getVisitorsForDepartment } = require("../access-control");
      const result = await getVisitorsForDepartment("dept-1");

      expect(mockFrom).toHaveBeenCalledWith("visitors");
      expect(result).toEqual(mockVisitors);
    });
  });
});
