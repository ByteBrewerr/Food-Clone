import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import orderStore from "../../stores/ordersStore";
import { observer } from "mobx-react-lite";
import "./orderDetailsPage.scss";
import Contacts from "../../components/profile/SingleOrderDetails/Contacts/Contacts";
import Details from "../../components/profile/SingleOrderDetails/Details/Details";
import Address from "../../components/profile/SingleOrderDetails/Address/Address";
import Cart from "../../components/profile/SingleOrderDetails/Cart/Cart";
import { usePopUp } from "../../hooks/usePopUp";
import FeedbackPopup from "../../components/profile/FeedbackPopup/FeedbackPopup";
import ReactDOM from "react-dom";
import Overlay from "../../shared/modals/Overlay/Overlay";

const OrderDetailsPage = () => {
  const { orderNumber } = useParams();
  const { orders, fetchOrders } = orderStore;
  const { isPopUpVisible, handlePopUp } = usePopUp();

  const portalContainer = document.getElementById("portal-container");

  if (!portalContainer) {
    alert("no portal");
    return null;
  }

  const order = orders.find((order) => order.number.toString() == orderNumber);

  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (!orders.length && storedUid) {
      fetchOrders(storedUid);
    }
  }, []);

  if (!order) {
    return null;
  }

  return (
    <>
      <div className="orderDetailsContent">
        <Details payment={order.payment} number={order.number} date={order.date} />
        <Contacts name={order.contacts.name} phone={order.contacts.number} />
        <Address house={order.address.house} street={order.address.street} />
        <Cart products={order.products} />
        <button onClick={() => handlePopUp()}>Оставить отзыв</button>
      </div>
      {isPopUpVisible &&
        ReactDOM.createPortal(
          <Overlay handlePopup={handlePopUp}>
            <FeedbackPopup />
          </Overlay>,
          portalContainer
        )}
    </>
  );
};

export default observer(OrderDetailsPage);