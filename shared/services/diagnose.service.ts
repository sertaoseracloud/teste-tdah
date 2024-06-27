import { CosmosDbService } from "./cosmos.service";

export class DiagnosisService {
    constructor(private readonly cosmosDbService: CosmosDbService) {}
    public async getDiagnosis(userId: string) {
      const answers = await this.cosmosDbService.getAnswers(userId);
  
      const partAScores = answers.filter((a: { questionId: number; }) => a.questionId <= 6).map((a: { answer: string; }) => this.getScore(a.answer));
      const partBAnswers = answers.filter((a: { questionId: number; }) => a.questionId > 6).map((a: { answer: string; }) => this.getScore(a.answer));
  
      const partATotal = partAScores.reduce((sum: number, score: number) => sum + score, 0);
      const partBTotal = partBAnswers.reduce((sum: number, score: number) => sum + score, 0);
  
      const partADiagnosis = partAScores.filter((score: number) => score >= 3).length >= 4;
  
      const diagnosis = {
        partADiagnosis,
        partATotal,
        partBTotal,
        message: partADiagnosis ? 'Os sintomas são altamente compatíveis com TDAH. Uma investigação mais precisa deve ser feita.' : 'Os sintomas não são altamente compatíveis com TDAH. No entanto, é recomendável uma consulta médica para avaliação detalhada.'
      };
  
      return diagnosis;
    }
  
    private getScore(answer: string): number {
      switch (answer) {
        case 'Nunca':
          return 0;
        case 'Quase nunca':
          return 1;
        case 'De vez em quando':
          return 2;
        case 'Quase sempre':
          return 3;
        case 'Sempre':
          return 4;
        default:
          return 0;
      }
    }
  }