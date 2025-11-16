import { PlayerRepository } from '../repositories/playerRepository';
import { PlayerModel } from '../models/playerModel';

export class PlayerService {
  private repo = new PlayerRepository();

  async init(): Promise<void> {
    await this.repo.init();
  }

  async register(name: string, password: string): Promise<PlayerModel> {
    const isExist = await this.repo.findByName(name);
    if (isExist) throw new Error('Player already exists');

    const player = new PlayerModel({ name, password });
    await this.repo.savePlayer(player);
    return player;
  }

  async addPoints(playerId: string, points: number): Promise<void> {
    const allPlayers = await this.repo.getAll();
    const player = allPlayers.find((p) => p.idPlayer === playerId);
    if (!player) throw new Error('Player not found');

    player.points += points;
    await this.repo.updatePlayer(player);
  }

  async getAll(): Promise<PlayerModel[]> {
    return this.repo.getAll();
  }

  async getLeaderboard(): Promise<{ name: string; wins: number }[]> {
    const allPlayers = await this.repo.getAll();
    return allPlayers
      .map((p) => ({ name: p.name, wins: p.points }))
      .sort((a, b) => b.wins - a.wins);
  }
}
