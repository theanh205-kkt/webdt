import { useQuery } from "@tanstack/react-query";
import { getOne } from "../provider/dataProvider";

type useOneProps = {
  resource: string;
  id: number;
};

const useOne = ({ resource, id }: useOneProps) => {
  return useQuery({
    queryKey: [resource, id],
    queryFn: () => getOne({ resource, id }),
  });
};

export default useOne;
