import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import Container from "./Container";
import Aside from "./Aside";
import Label from "./Label";
import { Participant, Room } from "../../types";
import Search from "./Search";
import RoomsList from "./RoomsList/RoomsList";
import CurrentRoom from "./CurrentRoom";
import CreateRoom from "./CreateRoom";
import { ChatEvents } from "../../constants";

type ChatProps = {
  socket: Socket;
};

export type Results = {
  users: readonly Participant[];
  query: string;
};

const initialResults: Results = {
  users: [],
  query: "",
};

function Chat({ socket }: ChatProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<Room | null>(null);
  useEffect(() => {
    socket.emit(ChatEvents.getUserRooms, setRooms);
  }, []);

  const [searchResults, setSearchResults] = useState<Results>(initialResults);

  const handleEnterQuery = (query: string) => {
    if (query.length === 0) {
      setSearchResults(initialResults);
      return;
    }
    socket.emit(ChatEvents.findUsers, query, (users: Participant[]) => {
      setSearchResults({ query, users });
    });
  };

  const handleClearSearchResults = () => setSearchResults(initialResults);
  const handleSelectParticipant = (participant: Participant) => {
    const existingRoom = rooms.find(
      ({ participants }) => participants[0].userId === participant.userId,
    );
    if (existingRoom) {
      setNewRoom(null);
      setSelectedRoom(existingRoom);
    } else {
      setNewRoom({
        roomId: "newRoomId",
        participants: [participant],
      });
      setSelectedRoom(null);
    }
    handleClearSearchResults();
  };

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setNewRoom(null);
  };

  const handleCreateRoom = () => {
    socket.emit(
      ChatEvents.createRoom,
      newRoom?.participants[0].userId,
      (newRoomId: string) => {
        const createdRoom = {
          roomId: newRoomId,
          participants: [...newRoom!.participants],
        };
        setRooms([createdRoom, ...rooms]);
        setNewRoom(null);
        setSelectedRoom(createdRoom);
      },
    );
  };

  const handleDeleteRoom = (deletedRoomId: Room["roomId"]) => {
    socket.emit(ChatEvents.leaveRoom, deletedRoomId, () => {
      setRooms(rooms.filter(({ roomId }) => roomId !== deletedRoomId));
      setSelectedRoom(null);
    });
  };

  return (
    <Container>
      <>
        <Aside>
          <Label />
          <Search
            results={searchResults}
            onSubmit={handleEnterQuery}
            onClear={handleClearSearchResults}
            onSelect={handleSelectParticipant}
          />
          <RoomsList
            rooms={rooms}
            newRoom={newRoom}
            selectedRoom={selectedRoom}
            onSelect={handleSelectRoom}
            onDelete={handleDeleteRoom}
          />
        </Aside>
        {newRoom && (
          <CreateRoom
            secondParticipantId={newRoom.participants[0].userId}
            onCreate={handleCreateRoom}
          />
        )}
        {selectedRoom && <CurrentRoom room={selectedRoom} />}
      </>
    </Container>
  );

  // const navigate = useNavigate();
  // const [serviceConnecting, setServiceConnecting] = useState<boolean>(false);
  // const token = useSelector(selectCurrentUserToken);
  // const [serviceInstance] = useState(new ChatService());
  // const [text, setText] = useState<string>("");
  // const [debouncedText] = useDebounceValue(text, 100);
  // const [searchResults, setSearchResults] = useState<Results>(initialResults);
  // const [selectedContact, setSelectedContact] = useState<Participant | null>(
  //   null,
  // );
  // const [rooms, setRooms] = useState<Room[]>([]);
  // const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  // const handleDropSearchResults = () => {
  //   setSearchResults(initialResults);
  //   setText("");
  //   setSelectedContact(null);
  // };
  // const handleSelectContact = (contact: Participant) => {
  //   setSelectedContact(contact);
  //   setSelectedRoom(null);
  // };
  // const handleSelectRoom = (room: Room) => {
  //   setSelectedContact(null);
  //   setSelectedRoom(room);
  // };
  // const handleCreateNewRoom = async () => {
  //   const newRoomId = await serviceInstance.createRoom(
  //     selectedContact?.userId as Participant["userId"],
  //   );
  //   const newRoom = {
  //     roomId: newRoomId,
  //     participants: [selectedContact as Participant],
  //   };
  //   setRooms([newRoom, ...rooms]);
  //   setSearchResults({
  //     query: searchResults.query,
  //     users: searchResults.users.filter(
  //       ({ userId }) => userId !== selectedContact?.userId,
  //     ),
  //   });
  //   handleSelectRoom(newRoom);
  // };
  // const handleDeleteRoom = async (deletedRoomId: Room["roomId"]) => {
  //   await serviceInstance.deleteRoom(deletedRoomId);
  //   setRooms(rooms.filter(({ roomId }) => roomId !== deletedRoomId));
  //   setSelectedRoom(null);
  // };
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setServiceConnecting(true);
  //       await serviceInstance.connect(token!);
  //       const rooms = await serviceInstance.getRooms();
  //       setRooms(rooms);
  //     } catch (e) {
  //       const error = e as Error;
  //       if (error.message === "User token is invalid") {
  //         navigate("/login");
  //       }
  //       console.error(error);
  //     } finally {
  //       setServiceConnecting(false);
  //     }
  //   })();
  // }, []);
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const foundUsers = (await serviceInstance.findUsers(
  //         debouncedText,
  //       )) as ReadonlyArray<Participant>;
  //       const contactedUsers = rooms.reduce(
  //         (acc, { participants }) => [...acc, ...participants],
  //         [] as Participant[],
  //       );
  //       const notContactedUsers = _.differenceBy(
  //         foundUsers,
  //         contactedUsers,
  //         "userId",
  //       );
  //       setSearchResults({ users: notContactedUsers, query: debouncedText });
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   })();
  // }, [debouncedText]);
  // return (
  //   <Container>
  //     {serviceConnecting ? (
  //       <Backdrop isOpen />
  //     ) : (
  //       <>
  //         <Aside>
  //           <Label />
  //           <Search
  //             text={text}
  //             onChange={setText}
  //             onDropText={handleDropSearchResults}
  //           />
  //           <SearchResults
  //             results={searchResults}
  //             selectedContact={selectedContact}
  //             onSelect={handleSelectContact}
  //           />
  //           <RoomsList
  //             rooms={rooms}
  //             selectedRoom={selectedRoom}
  //             onSelect={handleSelectRoom}
  //             onDelete={handleDeleteRoom}
  //           />
  //         </Aside>
  //         {selectedRoom && <CurrentRoom room={selectedRoom} />}
  //         {selectedContact && (
  //           <CreateRoom
  //             secondParticipantId={selectedContact.userId}
  //             onCreate={handleCreateNewRoom}
  //           />
  //         )}
  //       </>
  //     )}
  //   </Container>
  // );
  return <div>chat</div>;
}

export default Chat;
