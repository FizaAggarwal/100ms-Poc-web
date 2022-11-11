import { put } from "redux-saga/effects";

function* getRooms(action) {
  let data = yield fetch("http://localhost:4000/getRooms");
  data = yield data.json();
  yield put({
    type: "GET_ROOMS_SUCCESS",
    payload: { data },
  });
}

export default getRooms;
