import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from ".";
import { Participant, Room, Message } from "../types";

export const roomsAdapter = createEntityAdapter({
  selectId: (room: Room) => room.roomId,
});

const roomsSlice = createSlice({
  name: "rooms",
  initialState: roomsAdapter.getInitialState(),
  reducers: {
    addRooms: (state, action: PayloadAction<Room[]>) => {
      const modifiedRooms = action.payload.map((room) => ({
        ...room,
        messages: room.messages.reverse(),
      }));
      roomsAdapter.addMany(state, modifiedRooms);
    },
    addRoom: roomsAdapter.addOne,
    deleteRoom: roomsAdapter.removeOne,
    userJoined: (state, action: PayloadAction<Participant["userId"]>) => {
      state.ids.forEach((roomId) => {
        state.entities[roomId].participants.forEach((participant) => {
          if (participant.userId === action.payload) {
            participant.isOnline = true;
          }
        });
      });
    },
    userLeft: (state, action: PayloadAction<Participant["userId"]>) => {
      state.ids.forEach((roomId) => {
        state.entities[roomId].participants.forEach((participant) => {
          if (participant.userId === action.payload) {
            participant.isOnline = false;
          }
        });
      });
    },
    saveExtraMessages: (
      state,
      action: PayloadAction<{ roomId: Room["roomId"]; messages: Message[] }>,
    ) => {
      const { roomId, messages } = action.payload;
      state.entities[roomId].messages.unshift(...messages.reverse());
    },
    newMessage: (
      state,
      action: PayloadAction<{ roomId: Room["roomId"]; message: Message }>,
    ) => {
      const { roomId, message } = action.payload;
      state.entities[roomId].messages.push(message);
      state.entities[roomId].messagesCount += 1;
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        roomId: Room["roomId"];
        updatedMessage: Omit<Message, "author">;
      }>,
    ) => {
      const { roomId, updatedMessage } = action.payload;
      const updatedMessages = state.entities[roomId].messages.map((message) => {
        if (message.messageId === updatedMessage.messageId) {
          return { ...message, ...updatedMessage };
        }
        return message;
      });
      state.entities[roomId].messages = updatedMessages;
    },
    deleteMessage: (
      state,
      action: PayloadAction<{
        roomId: Room["roomId"];
        messageId: Message["messageId"];
      }>,
    ) => {
      const { roomId, messageId } = action.payload;
      const filteredMessages = state.entities[roomId].messages.filter(
        (message) => message.messageId !== messageId,
      );
      state.entities[roomId].messages = filteredMessages;
      state.entities[roomId].messagesCount -= 1;
    },
  },
});

export default roomsSlice.reducer;

export const {
  addRoom,
  deleteRoom,
  addRooms,
  userJoined,
  userLeft,
  saveExtraMessages,
  newMessage,
  updateMessage,
  deleteMessage,
} = roomsSlice.actions;

export const { selectAll: selectAllRooms } =
  roomsAdapter.getSelectors<RootState>((state) => state.rooms);
