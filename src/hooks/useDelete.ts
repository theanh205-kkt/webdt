import { useMutation, useQueryClient } from "@tanstack/react-query";
import { remove } from "../provider/dataProvider";

type useDeleteProps = {
  resource: string;
};

const useDelete = ({ resource }: useDeleteProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => remove({ resource, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resource],
      });
    },
  });
};

export default useDelete;
