const NodeHelper = require("node_helper");
const { GarminConnect } = require("garmin-connect");

const getLastActivityDate = (activities) => {
  const lastActivity = activities[0];
  const lastStartTimeLocal = lastActivity.startTimeLocal;
  return lastStartTimeLocal;
};

const getDiffActivityDate = (activityDate) => {
  const activityDateDate = new Date(activityDate);
  const today = new Date();
  const diff = Math.round((today - activityDateDate) / (1000 * 60 * 60 * 24));
  return diff;
};

module.exports = NodeHelper.create({
  start: function () {
    console.info("MMM-GConnect started!");
  },
  socketNotificationReceived: async function (notification, payload) {
    const self = this;
    switch (notification) {
      case "GET_GARMIN_DATA":
        const GCClient = new GarminConnect();
        await GCClient.login(payload.loginName, payload.password);
        const activities = await GCClient.getActivities(0, 1);
        const lastActivityDate = getLastActivityDate(activities);
        const lastActivityDistance =
          Math.round((activities[0].distance / 1000) * 100) / 100;
        const lastActivityTime =
          Math.round((activities[0].duration / 60) * 100) / 100;
        const lastActivityAvgSpeed =
          Math.round(activities[0].averageSpeed * 100) / 100;
        const lastActivityAvgHR =
          Math.round(activities[0].averageHR * 100) / 100;
        const diff = getDiffActivityDate(lastActivityDate);
        const activityType = activities[0].activityName;
        self.sendSocketNotification("UPDATE_GARMIN_DATA", {
          diff,
          lastActivityDistance,
          lastActivityTime,
          lastActivityAvgSpeed,
          lastActivityAvgHR,
          activityType,
        });
        break;
      default:
        console.error("Switch item {} is missing", notification);
    }
  },
});
