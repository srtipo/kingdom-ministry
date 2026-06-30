import { ICreateAttendance } from "@/src/core/modules/visits/interfaces/attendance.interface";
import { createAttendanceHandler } from "@/src/di/visits/container";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCreateAttendance({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const queryClient = useQueryClient();
  const { mutate: createAttendance, ...rest } = useMutation<
    void,
    Error,
    ICreateAttendance
  >({
    mutationFn: async (data: ICreateAttendance) => {
      return await createAttendanceHandler.execute(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({
        queryKey: ["visit-detail"],
      });
      queryClient.invalidateQueries({
        queryKey: ["attendance-history"],
      });
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });
  return { createAttendance, ...rest };
}
