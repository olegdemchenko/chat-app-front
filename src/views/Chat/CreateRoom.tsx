import React from "react";
import { Participant } from "../../types";

type CreateRoomProps = {
  secondParticipantId: Participant["userId"];
  onCreate: (secondParticipantId: Participant["userId"]) => void;
};

function CreateRoom({ secondParticipantId, onCreate }: CreateRoomProps) {
  return (
    <button onClick={() => onCreate(secondParticipantId)}>Create room</button>
  );
}

export default CreateRoom;
