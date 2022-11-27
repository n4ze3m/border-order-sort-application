import { type NextApiRequest, type NextApiResponse } from "next";


const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({sds:"sds"});
};

export default examples;
