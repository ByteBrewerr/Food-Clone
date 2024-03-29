import { makeAutoObservable, runInAction } from "mobx";
import { OrderType } from "../types/orderType";
import { getDatabase, onValue, ref } from "firebase/database";
import notify from "../utils/notify";

class OrderStore {
  orders: OrderType[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  fetchOrders = async (uid: string) => {
    this.isLoading = true;
    try {
      const database = getDatabase();
      const userOrdersRef = ref(database, `users/${uid}/orders`);
      await onValue(userOrdersRef, async (snapshot) => {
        const data = await snapshot.val();
        if (data) {
          const arrayData = Object.values(data) as OrderType[];
          runInAction(() => {
            this.orders = arrayData;
            this.isLoading = false;
          });
        } else {
          this.isLoading = false;
        }
      });
    } catch (error) {
      notify("Ошибка загрузки истории заказов", "error");
    }
  };

  setLoading = (loading: boolean) => {
    this.isLoading = loading;
  };
}

const orderStore = new OrderStore();

export default orderStore;
