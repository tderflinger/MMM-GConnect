let currentData = {};

Module.register("MMM-GConnect", {
  defaults: {
    loginName: null,
    password: null
  },
  start: function () {
    this.getData();
  },
  getScripts: function () {
    return [
      this.file("node_modules/preact/dist/preact.min.js"),
      this.file("node_modules/htm/dist/htm.js")
    ];
  },
  getDom: () => {
    const { h, render } = preact;
    const html = htm.bind(h);

    const GarminWidget = ({ diffDays, distance, time, hr }) => {
      const diffColor = diffDays > 3 ? "red" : "white";

      // taken from https://iconduck.com/icons/12253/running International Attribution License
      const RunningIcon = ({ size, paddingTop }) => {
        return html`<svg
          style="padding-top: ${paddingTop}px; width: ${size}px; height: ${size}px"
          fill="white"
          color="white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            d="M353.415,200l-30.981-57.855-60.717-20.239-.14.432L167.21,149.3A32.133,32.133,0,0,0,144,180.068V264h32V180.069l73.6-21.028-32.512,99.633-.155-.056-29.464,82.5a16.088,16.088,0,0,1-20.127,9.8L101.06,328.821,90.94,359.179l66.282,22.093A48,48,0,0,0,217.6,351.881l24.232-67.849,17.173,5.6,48.3,48.3A15.9,15.9,0,0,1,312,349.255V456h32V349.255a47.694,47.694,0,0,0-14.059-33.942l-48.265-48.264,26.783-82.077,19.269,34.683A24.011,24.011,0,0,0,348.707,232H432V200Z"
            class="ci-primary"
          />
          <path
            fill="var(--ci-primary-color, currentColor)"
            d="M286.828,109.707a36,36,0,1,0-12.916-27.619A35.851,35.851,0,0,0,286.828,109.707Z"
            class="ci-primary"
          />
        </svg>`;
      };

      // taken from https://iconduck.com/icons/117847/heart-love-like, MIT License
      const HeartIcon = () => {
        return html`<svg
          style="padding-top: 5px"
          fill="white"
          color="white"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m11.4454 20.7608-7.86923-8.1945c-2.21653-2.3081-2.07695-6.0927.30305-8.21701 2.36113-2.10748 5.94122-1.69824 7.80708.89242l.3137.43553.3137-.43553c1.8659-2.59066 5.4459-2.9999 7.8071-.89242 2.38 2.12431 2.5196 5.90891.303 8.21701l-7.8692 8.1945c-.3063.3189-.8029.3189-1.1092 0z"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>`;
      };

      // taken from: https://iconduck.com/icons/88028/clock-time-four-outline, Apache License
      const ClockIcon = () => {
        return html`<svg
          style="padding-top: 5px"
          fill="white"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="m12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10m5 11.9-.7 1.3-5.3-2.9v-5.3h1.5v4.4z"
          />
        </svg>`;
      };

      return html`<div style="margin-left: 1rem; margin-top: 4rem">
        <div
          style="display: flex; padding-top: 1rem; margin: 0; padding-bottom: 0"
        >
          <${RunningIcon} size=${38} paddingTop=${10} />
          <p
            style="font-size: 2rem; color: white; padding: 0; margin: 0; margin-left: 0.5rem"
          >
            Running
          </p>
        </div>
        <div style="display: inline-flex; gap: 1.5rem">
          <p
            style="font-size: 6rem; color: ${diffColor}; padding: 0; margin: 0"
          >
            ${diffDays}
          </p>
          <div style="margin-top: 1.9rem">
            <div style="display: flex">
              <${ClockIcon} />
              <p
                style="font-size: 1.2rem; color: white; padding: 0; margin: 0; margin-left: 0.5rem;"
              >
                ${time} min
              </p>
            </div>
            <div style="display: flex">
              <${RunningIcon} size=${24} paddingTop=${5} />
              <p
                style="font-size: 1.2rem; color: white; padding: 0; margin: 0; margin-left: 0.5rem;"
              >
                ${distance} km
              </p>
            </div>
            <div style="display: flex">
              <${HeartIcon} />
              <p
                style="font-size: 1.2rem; color: white; padding: 0; margin: 0; margin-left: 0.5rem;"
              >
                ${hr} bpm
              </p>
            </div>
          </div>
        </div>
      </div>`;
    };

    const divElement = document.createElement("div");

    render(
      html`<${GarminWidget}
        diffDays=${currentData.diff}
        hr=${currentData.lastActivityAvgHR}
        distance=${currentData.lastActivityDistance}
        time=${currentData.lastActivityTime}
        speed=${currentData.lastActivityAvgSpeed}
      />`,
      divElement
    );
    return divElement;
  },
  getData: function () {
    this.sendSocketNotification("GET_GARMIN_DATA", this.config);
    setInterval(() => {
      this.sendSocketNotification("GET_GARMIN_DATA", this.config);
    }, this.config.interval);
  },
  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "UPDATE_GARMIN_DATA":
        currentData = payload;
        break;
      default:
    }
    this.updateDom();
  }
});
