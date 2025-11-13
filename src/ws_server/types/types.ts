// ---------------- Player ----------------
export type WSMessageId = 0;

export type RegRequestData = {
  name: string;
  password: string;
};

export type RegRequest = {
  type: 'reg';
  data: RegRequestData;
  id: WSMessageId;
};

// ---------------- Room ----------------
export type CreateRoomRequest = {
  type: 'create_room';
  data: '';
  id: WSMessageId;
};

export type AddUserToRoomRequest = {
  type: 'add_user_to_room';
  data: { indexRoom: number | string };
  id: WSMessageId;
};

// ---------------- Ships ----------------
export type AddShipsRequest = {
  type: 'add_ships';
  data: {
    gameId: number | string;
    ships: unknown[];
    indexPlayer: number | string;
  };
  id: WSMessageId;
};

// ---------------- Game ----------------
export type AttackRequest = {
  type: 'attack';
  data: {
    gameId: number | string;
    x: number;
    y: number;
    indexPlayer: number | string;
  };
  id: WSMessageId;
};

export type RandomAttackRequest = {
  type: 'randomAttack';
  data: {
    gameId: number | string;
    indexPlayer: number | string;
  };
  id: WSMessageId;
};

// ---------------- Union ----------------
export type WSRequest =
  | RegRequest
  | CreateRoomRequest
  | AddUserToRoomRequest
  | AddShipsRequest
  | AttackRequest
  | RandomAttackRequest;

// ---------------- Base Message ----------------
export interface BaseMessage<T = unknown> {
  type: string;
  data: T;
  id: WSMessageId;
}
