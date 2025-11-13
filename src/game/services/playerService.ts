import { PlayerRepository } from '../repositories/playerRepository';
import { PlayerModel } from '../models/playerModel';

export class PlayerService {
  private repo = new PlayerRepository();

  async init(): Promise<void> {
    await this.repo.init();
  }

  async register(name: string, password: string): Promise<PlayerModel> {
    const existing = await this.repo.findByName(name);
    if (existing) {
      throw new Error('Player already exists');
    }

    const player = new PlayerModel(name, password);
    await this.repo.savePlayer(player);
    return player;
  }

  async addPoints(playerId: string, points: number): Promise<void> {
    const allPlayers = await this.repo.getAll();
    const player = allPlayers.find((p) => p.id === playerId);
    if (!player) throw new Error('Player not found');

    player.points += points;
    await this.repo.updatePlayer(player);
  }

  async getAll(): Promise<PlayerModel[]> {
    return this.repo.getAll();
  }
}
