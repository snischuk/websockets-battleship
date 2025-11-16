import type { RegRequestData } from '../../ws_server/types/types';
import { PlayerService } from '../services/playerService';
import type { PlayerModel } from '../models/playerModel';

export class PlayerController {
  private static playerService = new PlayerService();

  static async handleRegistration(data: RegRequestData): Promise<PlayerModel> {
    return this.playerService.register(data.name, data.password);
  }

  static async handleLeaderboard(): Promise<{ name: string; wins: number }[]> {
    return this.playerService.getLeaderboard();
  }
}
