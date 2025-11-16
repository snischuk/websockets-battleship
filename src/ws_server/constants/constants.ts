export const ActionByType = {
  REG: 'reg',
  UPDATE_ROOM: 'update_room',
  UPDATE_WINNERS: 'update_winners',
  CREATE_ROOM: 'create_room',
  ADD_USER_TO_ROOM: 'add_user_to_room',
  CREATE_GAME: 'create_game',
  START_GAME: 'start_game',
  ADD_SHIPS: 'add_ships',
  TURN: 'turn',
  ATTACK: 'attack',
  RANDOM_ATTACK: 'randomAttack',
  FINISH: 'finish',
} as const;

export type ActionByType = (typeof ActionByType)[keyof typeof ActionByType];
