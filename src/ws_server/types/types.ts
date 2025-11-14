// ---------------- Player ----------------
export type WSMessageId = 0;

// ---------------- Requests ----------------
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
    ships: unknown[]; // Ship[]
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

// ---------------- Union Request ----------------
export type WSRequest =
  | RegRequest
  | CreateRoomRequest
  | AddUserToRoomRequest
  | AddShipsRequest
  | AttackRequest
  | RandomAttackRequest;

// ---------------- Base Request ----------------
export interface BaseRequest<T = unknown> {
  type: string;
  data: T;
  id: WSMessageId;
}

// ---------------- Responses ----------------

// -------- Player Response --------
export type RegResponseData = {
  name: string | null;
  index: number | string | null;
  error: boolean;
  errorText: string;
};

export type RegResponse = {
  type: 'reg';
  data: RegResponseData;
  id: WSMessageId;
};

// -------- Room Response --------
export type RoomUser = {
  name: string;
  index: number | string;
};

export type CreateRoomResponseData = {
  roomId?: number | string;
  roomUsers?: RoomUser[];
  error: boolean;
  errorText: string;
};

export type CreateRoomResponse = {
  type: 'create_room';
  data: CreateRoomResponseData;
  id: WSMessageId;
};

export type AddUserToRoomResponseData = {
  roomId?: number | string;
  roomUsers?: RoomUser[];
  error: boolean;
  errorText: string;
};

export type AddUserToRoomResponse = {
  type: 'add_user_to_room';
  data: AddUserToRoomResponseData;
  id: WSMessageId;
};

// -------- Ships Response --------
export type Ship = {
  position: { x: number; y: number };
  isHorizontal: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
  hits?: number;
  isSunk?: boolean;
};

export type StartGameResponse = {
  type: 'start_game';
  data: {
    ships: Ship[];
    currentPlayerIndex: number | string;
  };
  id: WSMessageId;
};

// -------- Game Response --------
export type AttackStatus = 'miss' | 'shot' | 'killed';

export type AttackResponse = {
  type: 'attack';
  data: {
    position: { x: number; y: number };
    currentPlayer: number | string;
    status: AttackStatus;
  };
  id: WSMessageId;
};

export type RandomAttackResponse = AttackResponse;

export type TurnResponse = {
  type: 'turn';
  data: {
    currentPlayer: number | string;
  };
  id: WSMessageId;
};

export type FinishResponse = {
  type: 'finish';
  data: {
    winPlayer: number | string;
  };
  id: WSMessageId;
};

// -------- Updates for all --------
export type PlayerScore = {
  name: string;
  points: number;
};

export type UpdateWinnersResponse = {
  type: 'update_winners';
  data: PlayerScore[];
  id: WSMessageId;
};

export type UpdateRoomResponse = {
  type: 'update_room';
  data: {
    roomId: number | string;
    roomUsers: RoomUser[];
  }[];
  id: WSMessageId;
};

// ---------------- Union Response ----------------
export type WSResponse =
  | RegResponse
  | CreateRoomResponse
  | AddUserToRoomResponse
  | StartGameResponse
  | AttackResponse
  | RandomAttackResponse
  | TurnResponse
  | FinishResponse
  | UpdateWinnersResponse
  | UpdateRoomResponse;

// ---------------- Base Response ----------------
export interface BaseResponse<T = unknown> {
  type: string;
  data: T;
  id: WSMessageId;
}
