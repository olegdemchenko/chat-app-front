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
    markMessagesAsRead: (
      state,
      action: PayloadAction<{
        roomId: string;
        userId: string;
        messagesIds: Message["messageId"][];
      }>,
    ) => {
      const { roomId, userId, messagesIds } = action.payload;
      state.entities[roomId].messages = state.entities[roomId].messages.map(
        (message) =>
          messagesIds.includes(userId)
            ? message
            : { ...message, readBy: [...message.readBy, userId] },
      );
      state.entities[roomId].unreadMessagesCount -= messagesIds.length;
    },
    newMessage: (
      state,
      action: PayloadAction<{
        roomId: Room["roomId"];
        message: Message;
        unread: boolean;
      }>,
    ) => {
      const { roomId, message, unread } = action.payload;
      state.entities[roomId].messages.push(message);
      state.entities[roomId].messagesCount += 1;
      if (unread) {
        state.entities[roomId].unreadMessagesCount += 1;
      }
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        roomId: Room["roomId"];
        updatedMessage: Message;
      }>,
    ) => {
      const { roomId, updatedMessage } = action.payload;
      const updatedMessageIndex = state.entities[roomId].messages.findIndex(
        (message) => message.messageId === updatedMessage.messageId,
      );
      state.entities[roomId].messages[updatedMessageIndex] = updatedMessage;
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
  markMessagesAsRead,
  newMessage,
  updateMessage,
  deleteMessage,
} = roomsSlice.actions;

export const { selectAll: selectAllRooms } =
  roomsAdapter.getSelectors<RootState>((state) => state.rooms);
