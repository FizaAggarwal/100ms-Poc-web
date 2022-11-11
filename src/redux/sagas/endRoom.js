import { put } from "redux-saga/effects";

function* endRoom(action) {
  yield action.hmsActions.endRoom();
  const lock = false; // set to true to disallow rejoins
  const reason = "party is over";
  yield action.hmsActions.endRoom(lock, reason);
  yield put({
    type: "END_ROOM_SUCCESS",
  });
}

export default endRoom;
