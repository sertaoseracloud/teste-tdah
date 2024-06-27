import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { questions } from "../shared/questions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    if (req.method === "GET") {
        context.res = {
            body: questions
        };
      } else {
        context.res = {
          status: 405,
          body: { message: "Method Not Allowed" }
        };
      }

};

export default httpTrigger;