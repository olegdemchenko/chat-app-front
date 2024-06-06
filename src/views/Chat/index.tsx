import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import { selectCurrentUserToken } from "../../store/userSlice";
import ChatService from "../../services/chat";
import Container from "./Container";
import Aside from "./Aside";
import Label from "./Label";
import Search from "./Search";
import Backdrop from "../../components/Backdrop";
import { Participant } from "../../types";
import ContactsList from "./ContactsList";
import { useTranslation } from "react-i18next";

function Chat() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [serviceConnecting, setServiceConnecting] = useState<boolean>(false);
  const token = useSelector(selectCurrentUserToken);
  const [serviceInstance] = useState(new ChatService());

  const [text, setText] = useState<string>("");
  const [debouncedText] = useDebounceValue(text, 100);

  const [foundUsers, setFoundUsers] = useState<ReadonlyArray<Participant>>([]);

  const handleDropSearchResults = () => {
    setFoundUsers([]);
    setText("");
  };

  useEffect(() => {
    (async () => {
      try {
        setServiceConnecting(true);
        await serviceInstance.connect(token!);
      } catch (e) {
        const error = e as Error;
        if (error.message === "User token is invalid") {
          navigate("/login");
        }
        console.error(error);
      } finally {
        setServiceConnecting(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const results =
          debouncedText.length > 0
            ? ((await serviceInstance.findUsers(
                debouncedText,
              )) as ReadonlyArray<Participant>)
            : [];
        setFoundUsers(results);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [debouncedText]);

  return (
    <Container>
      {serviceConnecting ? (
        <Backdrop isOpen />
      ) : (
        <Aside>
          <Label />
          <Search
            text={text}
            onChange={setText}
            onDropText={handleDropSearchResults}
          />
          {debouncedText.length > 0 && (
            <ContactsList
              header={t("chat.searchResults")}
              emptyListPlaceholder={t("chat.noUsersFound", {
                searchText: debouncedText,
              })}
              contacts={foundUsers}
            />
          )}
        </Aside>
      )}
    </Container>
  );
}

export default Chat;
