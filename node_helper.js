const NodeHelper = require("node_helper");
const { GarminConnect } = require("garmin-connect");
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

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

const getTcxLSPath = (modulePath) => {
  const arch = process.arch;
  const platform = process.platform;

  const binPath = path.join(modulePath, "bin");
  let fileName;

  if (platform === "linux" && arch === "arm64") {
    fileName = "tcx-ls-linux-arm64";
  }
  if (platform === "linux" && arch === "x64") {
    fileName = "tcx-ls-linux-x86_64";
  }
  if (platform === "darwin" && arch === "arm64") {
    fileName = "tcx-ls-macos-arm64";
  }
  if (platform === "darwin" && arch === "x64") {
    fileName = "tcx-ls-macos-x86_64";
  }
  if (platform === "win32") {
    fileName = "tcx-ls-windows-x86_64.exe";
  }

  if (!fileName) {
    throw new Error(`Unsupported platform/arch: ${platform}/${arch}`);
  }

  return path.join(binPath, fileName);
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
        const showMap = payload?.showMap || false;

        if (showMap) {
          const mapTilerKey = payload?.mapTilerKey;
          await GCClient.downloadOriginalActivityData({ activityId: activities[0].activityId }, `${this.path}/data`, 'tcx');

          const tcxLsPath = getTcxLSPath(this.path);
          const tcxPath = path.join(this.path, 'data', `${activities[0].activityId}.tcx`);
          const jsonPath  = path.join(this.path, 'data', `${activities[0].activityId}.json`);

          exec(`${tcxLsPath} ${tcxPath} --geojson ${jsonPath}`, (error, _, stderr) => {
              if (error) {
                console.error(`Error executing tcx-ls: ${error}`);
                return;
              }
              if (stderr) console.error(`Command stderr: ${stderr}`);

              // Read the generated JSON file
              const jsonFilePath = `${this.path}/data/${activities[0].activityId}.json`;
              if (!fs.existsSync(jsonFilePath)) {
                console.error(`GeoJSON file not found: ${jsonFilePath}`);
                return;
              }

              try {
                const geoJsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

                self.sendSocketNotification("UPDATE_GARMIN_DATA", {
                  diff,
                  lastActivityDistance,
                  lastActivityTime,
                  lastActivityAvgSpeed,
                  lastActivityAvgHR,
                  activityType,
                  mapTilerKey,
                  geoJsonData,
                  showMap,
                });
            } catch (parseError) {
              console.error(`Error reading or parsing JSON file: ${parseError}`);
            }
          });
         } else {
          self.sendSocketNotification("UPDATE_GARMIN_DATA", {
            diff,
            lastActivityDistance,
            lastActivityTime,
            lastActivityAvgSpeed,
            lastActivityAvgHR,
            activityType,
            showMap,
          });
        }

        break;
      default:
        console.error("Switch item {} is missing", notification);
    }
  },
});
