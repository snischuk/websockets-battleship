import type { RegRequestData } from '../../ws_server/types/types';
import { PlayerService } from '../services/playerService';

export class PlayerController {
  private static service = new PlayerService();

  static async init(): Promise<void> {
    await this.service.init();
  }

  static async handleRegistration(data: RegRequestData) {
    console.log('👤 PlayerController: processing registration', data);

    try {
      const player = await this.service.register(data.name, data.password);
      return {
        id: player.id,
        name: player.name,
        status: 'registered',
      };
    } catch (err: unknown) {
      return {
        id: null,
        name: data.name,
        status: 'error',
        errorText: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }
}
