import {db} from "../lib/firebaseclient";


export default {
  /**
   * this function will be fired when the app is first time run,
   * and it will fetch first 5 posts, here i retrieve them in desc order,
   * until show last added post first.
   */
  charitiesFirstBatch: async function () {
    try {
      const data = await db
        .collection("charities")
        .orderBy("name", "desc")
        .limit(5)
        .get();

      let charities = [];
      let lastKey = "";
      data.forEach((doc) => {
        console.log("got a document (first batch): " + doc.data().photourl)
        charities.push({
          id: doc.id,
          photourl: doc.data().photourl
        });
        lastKey = doc.data().name;
      });

      return { charities, lastKey };
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * this function will be fired each time the user click on 'More Posts' button,
   * it receive key of last post in previous batch, then fetch next 5 posts
   * starting after last fetched post.  
   */
    charitiesNextBatch: async (key) => {
    try {
      const data = await db
        .collection("charities")
        .orderBy("name", "desc")
        .startAfter(key)
        .limit(5)
        .get();

      let charities = [];
      let lastKey = "";
      data.forEach((doc) => {
        console.log("got a document (consequent batch): " + doc.data().photourl)
        charities.push({
          id: doc.id,
          photourl: doc.data().photourl
        });
        lastKey = doc.data().name;
      });

      return { charities, lastKey };
    } catch (e) {
      console.log(e);
    }
  }
};
