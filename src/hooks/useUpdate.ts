import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IProduct } from "../interface/type";
import { update } from "../provider/dataProvider";

type useCreateProps = {
  resource: string;
  id: number;
};

const useUpdate = ({ resource, id }: useCreateProps) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: IProduct) => update({ resource, variables, id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [resource],
      });
    },
  });
};

export default useUpdate;
