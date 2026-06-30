import { IAttendance } from "@/src/core/modules/visits/interfaces/attendance.interface";
import { getAttendanceByVisitHandler } from "@/src/di/visits/container";
import { useQuery } from "@tanstack/react-query";

export function useGetAttendanceHistory(visitId: string) {
  return useQuery<IAttendance[], Error>({
    queryKey: ["attendance-history", visitId],
    queryFn: async () => await getAttendanceByVisitHandler.execute(visitId),
  });
}
