import { ActionByType } from '../constants/constants';

export type WSMessageId = 0;

// ---------------- Player ----------------
export type RegRequestData = {
  name: string;
  password: string;
};

export type RegRequest = {
  type: typeof ActionByType.REG;
  data: RegRequestData;
  id: WSMessageId;
};

export type RegResponseData = {
  name: string | null;
  index: number | string | null;
  error: boolean;
  errorText: string;
};

export type RegResponse = {
  type: typeof ActionByType.REG;
  data: RegResponseData;
  id: WSMessageId;
};

export type PlayerScore = {
  name: string;
  wins: number;
};

export type UpdateWinnersResponse = {
  type: typeof ActionByType.UPDATE_WINNERS;
  data: PlayerScore[];
  id: WSMessageId;
};

// ---------------- Room ----------------
export type RoomUser = { name: string; index: number | string };

export type CreateRoomRequest = {
  type: typeof ActionByType.CREATE_ROOM;
  data: '';
  id: WSMessageId;
};

export type CreateRoomResponseData = {
  roomId?: number | string;
  roomUsers?: RoomUser[];
  error: boolean;
  errorText: string;
};

export type CreateRoomResponse = {
  type: typeof ActionByType.CREATE_ROOM;
  data: CreateRoomResponseData;
  id: WSMessageId;
};

export type AddUserToRoomRequestData = { indexRoom: number | string };
export type AddUserToRoomRequest = {
  type: typeof ActionByType.ADD_USER_TO_ROOM;
  data: AddUserToRoomRequestData;
  id: WSMessageId;
};

export type AddUserToRoomResponseData = {
  roomId?: number | string;
  roomUsers?: RoomUser[];
  error: boolean;
  errorText: string;
};

export type AddUserToRoomResponse = {
  type: typeof ActionByType.ADD_USER_TO_ROOM;
  data: AddUserToRoomResponseData;
  id: WSMessageId;
};

export type CreateGameResponseData = {
  idGame: number | string;
  idPlayer: number | string;
};
export type CreateGameResponse = {
  type: typeof ActionByType.CREATE_GAME;
  data: CreateGameResponseData;
  id: WSMessageId;
};

export type UpdateRoomResponseData = {
  roomId: number | string;
  roomUsers: RoomUser[];
};
export type UpdateRoomResponse = {
  type: typeof ActionByType.UPDATE_ROOM;
  data: UpdateRoomResponseData[];
  id: WSMessageId;
};

// ---------------- Ships ----------------
export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export type ShipPosition = { x: number; y: number };

export type Ship = {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: ShipType;
};

export type AddShipsRequestData = {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
};
export type AddShipsRequest = {
  type: typeof ActionByType.ADD_SHIPS;
  data: AddShipsRequestData;
  id: WSMessageId;
};

export type StartGameResponseData = {
  ships: Ship[];
  currentPlayerIndex: number | string;
};
export type StartGameResponse = {
  type: typeof ActionByType.START_GAME;
  data: StartGameResponseData;
  id: WSMessageId;
};

// ---------------- Game ----------------
export type AttackRequestData = {
  gameId: number | string;
  x: number;
  y: number;
  indexPlayer: number | string;
};
export type AttackRequest = {
  type: typeof ActionByType.ATTACK;
  data: AttackRequestData;
  id: WSMessageId;
};

export type AttackStatus = 'miss' | 'shot' | 'killed';

export type AttackResponseData = {
  position: ShipPosition;
  currentPlayer: number | string;
  status: AttackStatus;
};
export type AttackResponse = {
  type: typeof ActionByType.ATTACK;
  data: AttackResponseData;
  id: WSMessageId;
};

export type RandomAttackRequestData = {
  gameId: number | string;
  indexPlayer: number | string;
};
export type RandomAttackRequest = {
  type: typeof ActionByType.RANDOM_ATTACK;
  data: RandomAttackRequestData;
  id: WSMessageId;
};

export type RandomAttackResponse = {
  type: typeof ActionByType.RANDOM_ATTACK;
  data: AttackResponseData;
  id: WSMessageId;
};

export type TurnResponseData = { currentPlayer: number | string };
export type TurnResponse = {
  type: typeof ActionByType.TURN;
  data: TurnResponseData;
  id: WSMessageId;
};

export type FinishResponseData = { winPlayer: number | string };
export type FinishResponse = {
  type: typeof ActionByType.FINISH;
  data: FinishResponseData;
  id: WSMessageId;
};

// ---------------- Union Types ----------------
export type WSRequest =
  | RegRequest
  | CreateRoomRequest
  | AddUserToRoomRequest
  | AddShipsRequest
  | AttackRequest
  | RandomAttackRequest;

export type WSResponse =
  | RegResponse
  | UpdateWinnersResponse
  | CreateRoomResponse
  | AddUserToRoomResponse
  | CreateGameResponse
  | UpdateRoomResponse
  | StartGameResponse
  | AttackResponse
  | RandomAttackResponse
  | TurnResponse
  | FinishResponse;
