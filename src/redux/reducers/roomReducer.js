const initialState = {
  rooms: {},
  roomIds: [],
  joinToken: "",
};

const roomReducer = (state = initialState, action) => {
  const payload = action.payload;
  switch (action.type) {
    case "GET_ROOMS_SUCCESS":
      return {
        ...state,
        rooms: payload.data.rooms,
        roomIds: payload.data.roomIds,
      };
    case "CREATE_ROOM_SUCCESS":
      const obj = {};
      obj[payload.room.id] = payload.room;
      return {
        ...state,
        rooms: { ...state.rooms, ...obj },
        roomIds: [...state.roomIds, payload.room.id],
      };

    case "GET_JOIN_ROOM_TOKEN_SUCCESS":
      return {
        ...state,
        joinToken: payload.data.token,
      };

    default:
      return state;
  }
};

export default roomReducer;
