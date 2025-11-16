import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PlayerModel } from '../models/playerModel';

const DB_PATH = resolve(__dirname, '../../../database/database.json');

interface PlayerJSON {
  id: string;
  name: string;
  password: string;
  points: number;
}

interface Database {
  players: PlayerJSON[];
}

export class PlayerRepository {
  private players: PlayerModel[] = [];

  constructor() {}

  async init(): Promise<void> {
    try {
      let raw: string;

      try {
        raw = await readFile(DB_PATH, 'utf-8');
      } catch {
        const initialDatabase: Database = { players: [] };
        await writeFile(DB_PATH, JSON.stringify(initialDatabase, null, 2));
        raw = JSON.stringify(initialDatabase);
      }

      const parsedDatabase: Database = JSON.parse(raw);
      this.players = parsedDatabase.players.map(
        (p) =>
          new PlayerModel({
            name: p.name,
            password: p.password,
            idPlayer: p.id,
            points: p.points,
          }),
      );
    } catch (err) {
      console.error('Failed to load players:', err);
      throw err;
    }
  }

  private async save(): Promise<void> {
    const db: Database = {
      players: this.players.map((p) => ({
        id: p.idPlayer,
        name: p.name,
        password: p.password,
        points: p.points,
      })),
    };

    try {
      await writeFile(DB_PATH, JSON.stringify(db, null, 2));
    } catch (err) {
      console.error('Failed to save players:', err);
      throw err;
    }
  }

  async findByName(name: string): Promise<PlayerModel | undefined> {
    return this.players.find((p) => p.name === name);
  }

  async savePlayer(player: PlayerModel): Promise<void> {
    this.players.push(player);
    await this.save();
  }

  async updatePlayer(player: PlayerModel): Promise<void> {
    const index = this.players.findIndex((p) => p.idPlayer === player.idPlayer);
    if (index !== -1) {
      this.players[index] = player;
      await this.save();
    }
  }

  async getAll(): Promise<PlayerModel[]> {
    return this.players;
  }
}
