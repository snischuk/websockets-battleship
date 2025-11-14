import type { RegRequestData } from '../../ws_server/types/types';
import { PlayerService } from '../services/playerService';
import type { PlayerModel } from '../models/playerModel';

export class PlayerController {
  private static playerService = new PlayerService();

  static async handleRegistration(data: RegRequestData): Promise<PlayerModel> {
    console.log('👤 PlayerController: processing registration', data);

    const player = await this.playerService.register(data.name, data.password);
    return player;
  }
}
