import { put } from "redux-saga/effects";

function* getJoinToken(action) {
  let { roomId, user } = action.payload;
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    roomId: roomId,
    user: user,
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  let data = yield fetch("http://localhost:4000/joinRoomToken", requestOptions);
  data = yield data.json();
  const joinToken = data.token;
  const config = {
    userName: user,
    authToken: joinToken,
    settings: {
      isAudioMuted: true,
      isVideoMuted: true,
    },
  };
  yield action.hmsActions.join(config);
  yield put({
    type: "GET_JOIN_ROOM_TOKEN_SUCCESS",
    payload: { data },
  });
}

export default getJoinToken;
