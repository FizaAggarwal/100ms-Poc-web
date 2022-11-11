import { takeLatest } from "redux-saga/effects";
import createRoom from "./createRoom";
import endRoom from "./endRoom";
import getJoinToken from "./getJoinToken";
import getRooms from "./getRooms";

function* mySaga() {
  yield takeLatest("CREATE_ROOM_REQUEST", createRoom);
  yield takeLatest("GET_ROOMS_REQUEST", getRooms);
  yield takeLatest("GET_JOIN_ROOM_TOKEN", getJoinToken);
  yield takeLatest("END_ROOM", endRoom);
}

export default mySaga;
