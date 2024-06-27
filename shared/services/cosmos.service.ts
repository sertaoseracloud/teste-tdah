import { Container } from "@azure/cosmos";
import { CreateAnswerDto } from "../dto/create-answer.dto";

export class CosmosDbService {
    constructor(private readonly container: Container) {}
  
    public async addAnswer(answer: CreateAnswerDto) {
      const { resource } = await this.container.items.create(answer);
      return resource;
    }
  
    public async getAnswers(userId: string) {
      const { resources } = await this.container.items.query({
        query: "SELECT * FROM c WHERE c.userId = @userId",
        parameters: [{ name: "@userId", value: userId }]
      }).fetchAll();
      return resources;
    }
  }
  