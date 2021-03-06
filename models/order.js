import moment from "moment";

class Order {
  constructor(id, items, totalAmount, date) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
  }

  // The get syntax binds an object property to a function that will be called when that property is looked up.
  get readableDate() {
    return moment(this.date).format("MMMM Do YYYY, hh:mm");
  }

  // get readableDate() {
  //   return this.date.toLocaleDateString("en-EN", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // }
}

export default Order;
