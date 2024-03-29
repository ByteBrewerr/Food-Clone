import { FC } from "react";
import { BsCalendar2Date } from "react-icons/bs";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import "./singleFeedback.scss";
import userStore from "../../../../stores/userStore";
import { observer } from "mobx-react-lite";
import { usePopUp } from "../../../../hooks/usePopUp";
import Confirmation from "../../../../shared/modals/Confirmation/Confirmation";
import Overlay from "../../../../shared/modals/Overlay/Overlay";
import { getDatabase, ref, set } from "firebase/database";
import notify from "../../../../utils/notify";
import { Portal } from "@mui/material";

type SingleFeedbackProps = {
  date: string;
  name: string;
  comment: string;
  isPositive: boolean;
  img: string | null;
  orderNumber: number;
};

const SingleFeedback: FC<SingleFeedbackProps> = ({ date, name, comment, isPositive, img, orderNumber }) => {
  const { isPopUpVisible, handlePopUp } = usePopUp();
  const storedUid = localStorage.getItem("uid");
  const isFeedbackPage = window.location.pathname === "/feedback";
  const isAdminOrNotFeedbackPage = userStore.isAdmin || !isFeedbackPage;

  const handleDelete = async (isYes: boolean) => {
    if (isYes && isAdminOrNotFeedbackPage) {
      const db = getDatabase();
      const feedbackRef = ref(db, `feedbacks/${orderNumber}`);
      const userFeedbackRef = ref(db, `users/${storedUid}/orders/${orderNumber}/feedback`);
      try {
        await set(feedbackRef, null);
        await set(userFeedbackRef, null);
        notify("Успешно", "success");
      } catch (error) {
        notify("Ошибка", "error");
      }
    }
    handlePopUp();
  };
  return (
    <div className="singleFeedback">
      <div className="singleFeedbackInfo">
        <div>
          <BsCalendar2Date size={20} />
          <span>
            {date
              .split(",")
              .shift()
              ?.split("")
              .map((char) => {
                if (char == ":") return "/";
                return char;
              })}
          </span>
        </div>
        <div>
          {isPositive ? <AiFillLike size={20} color={"green"} /> : <AiFillDislike size={20} color={"red"} />}
          <span>{name}</span>
        </div>
      </div>
      <div className="singleFeedbackComment">
        {img && <img src={img} />}
        <span>{comment}</span>
      </div>
      {isAdminOrNotFeedbackPage && (
        <button className="deleteBtn" onClick={() => handlePopUp()}>
          Удалить
        </button>
      )}

      {isPopUpVisible && (
        <>
          <Portal>
            <Overlay handlePopup={handlePopUp}>
              <Confirmation text={"Вы действительно хотите удалить отзыв?"} onClick={handleDelete} />
            </Overlay>
          </Portal>
        </>
      )}
    </div>
  );
};

export default observer(SingleFeedback);
