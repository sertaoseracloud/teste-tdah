import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { validate } from "class-validator";
import { CreateAnswerDto } from "../shared/dto/create-answer.dto";
import { jwtDecode  } from "jwt-decode";
import { CosmosClient } from "@azure/cosmos";
import { CosmosDbService } from "../shared/services/cosmos.service";
import { DiagnosisService } from "../shared/services/diagnose.service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    context.res = {
      status: 401,
      body: { message: "Unauthorized" }
    };
    return;
  }

  let userId: string;

  const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING)
  const { database } = await client.databases.createIfNotExists({ id: process.env.COSMOS_DB_NAME });
  const { container } = await database.containers.createIfNotExists({ id: process.env.COSMOS_DB_CONTAINER_NAME})
  const cosmos = new CosmosDbService(container)
  const diagnose = new DiagnosisService(cosmos)

  try {
    const decoded: any = jwtDecode(token);
    userId = decoded.oid;
  } catch (error) {
    context.res = {
      status: 401,
      body: { message: "Invalid token" }
    };
    return;
  }

  if (req.method === "POST") {
    const createAnswerDto = new CreateAnswerDto();
    createAnswerDto.questionId = req.body.questionId;
    createAnswerDto.answer = req.body.answer;
    createAnswerDto.userId = userId;

    const errors = await validate(createAnswerDto);

    if (errors.length > 0) {
      context.res = {
        status: 400,
        body: errors
      };
      return;
    }

    const result = await cosmos.addAnswer(createAnswerDto);
    context.res = {
      body: { message: 'Answer recorded successfully', result }
    };
  } else if (req.method === "GET") {
    const diagnosis = await diagnose.getDiagnosis(userId);
    context.res = {
      body: diagnosis
    };
  } else {
    context.res = {
      status: 405,
      body: { message: "Method Not Allowed" }
    };
  }

};

export default httpTrigger;