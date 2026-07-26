import {
  AttendancePage,
} from "@/src/core/modules/visits/interfaces/attendance.interface";
import { getAttendanceByVisitHandler } from "@/src/di/visits/container";
import {
  InfiniteData,
  useInfiniteQuery,
} from "@tanstack/react-query";

export function useGetAttendanceHistory(visitId: string) {
  return useInfiniteQuery<
    AttendancePage,
    Error,
    InfiniteData<AttendancePage>,
    readonly unknown[],
    number
  >({
    queryKey: ["attendance-history", visitId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) =>
      await getAttendanceByVisitHandler.execute(visitId, pageParam),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + 1 : undefined,
  });
}
