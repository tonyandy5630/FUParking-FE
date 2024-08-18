import { deleteVehicleTypeAPI } from "@/api/vehicleType";
import MyDeleteButton from "@/components/DeleteButton";
import { ListVehicleTypeResponse } from "@/types/vehicleType.type";
import { Button } from "@mui/material";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

export default function DeleteVehicleType({
  id,
  refetch,
  setIsPending,
  disable,
}: {
  id: string;
  refetch: (
    options?: RefetchOptions
  ) => Promise<
    QueryObserverResult<AxiosResponse<ListVehicleTypeResponse, any>, Error>
  >;
  setIsPending: (isPending: boolean) => void;
  disable: boolean;
}) {
  const deleteVehicleTypeMutation = useMutation({
    mutationKey: ["/types"],
    mutationFn: (id: string) => deleteVehicleTypeAPI(id),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const onDelete = async () => {
    try {
      await deleteVehicleTypeMutation.mutateAsync(id, {
        onSuccess: (data) => {
          toast.success("Vehicle type deleted successfully");
          refetch();
          setIsPending(false);
        },
      });
    } catch (error) {
      setIsPending(false);
    }
  };

  return (
    <>
      <MyDeleteButton onDelete={onDelete}>DELETE</MyDeleteButton>
    </>
  );
}
