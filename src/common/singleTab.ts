/*
export const initSingleTab = () => {
  const CHANNEL_NAME = 'single-tab-app';
  const TAB_ID = Date.now().toString() + Math.random().toString(36).slice(2);

  let isDuplicate = false;

  const channel = new BroadcastChannel(CHANNEL_NAME);

  channel.postMessage({
    type: 'CHECK',
    tabId: TAB_ID,
  });

  channel.onmessage = (event) => {
    const data = event.data;

    if (data.type === 'CHECK' && data.tabId !== TAB_ID) {
      channel.postMessage({
        type: 'ALIVE',
        tabId: TAB_ID,
      });
    }

    if (data.type === 'ALIVE' && data.tabId !== TAB_ID) {
      if (!isDuplicate) {
        isDuplicate = true;

        document.body.innerHTML = `
          <div style="
            height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:column;
            font-family:Arial,sans-serif;
            background:#f8f8f8;
          ">
            <h2>This application is already open in another tab.</h2>
            <p>Please use the existing tab.</p>
          </div>
        `;

        throw new Error('Duplicate Tab');
      }
    }
  };
};
*/


/*
const LOCK_KEY = "POS_SINGLE_TAB_LOCK";
const HEARTBEAT_KEY = "POS_SINGLE_TAB_HEARTBEAT";
const CHANNEL = "POS_SINGLE_TAB_CHANNEL";

export const initSingleTab = () => {
  // Skip login page if needed
  if (window.location.pathname.toLowerCase().includes("login")) {
    return;
  }

  const TAB_ID = crypto.randomUUID();

  const channel = new BroadcastChannel(CHANNEL);

  let isDuplicate = false;

  const showDuplicatePage = () => {
    if (isDuplicate) return;

    isDuplicate = true;

    clearInterval(heartbeat);

    channel.close();

    document.documentElement.innerHTML = `
      <head>
        <title>Duplicate Tab</title>
      </head>
      <body style="
        margin:0;
        display:flex;
        justify-content:center;
        align-items:center;
        height:100vh;
        font-family:Arial,sans-serif;
        background:#fff;
      ">
        <div style="text-align:center">
          <h2>This application is already open in another tab.</h2>
          <p>Please use the existing tab.</p>
        </div>
      </body>
    `;

    window.stop();
  };

  // Existing lock
  const owner = localStorage.getItem(LOCK_KEY);

  if (owner && owner !== TAB_ID) {
    showDuplicatePage();
    return;
  }

  // Become owner
  localStorage.setItem(LOCK_KEY, TAB_ID);

  // Heartbeat
  const heartbeat = setInterval(() => {
    if (!isDuplicate) {
      localStorage.setItem(HEARTBEAT_KEY, Date.now().toString());
    }
  }, 1000);

  // Ask other tabs
  channel.postMessage({
    type: "CHECK",
    tabId: TAB_ID,
  });

  channel.onmessage = (e) => {
    const msg = e.data;

    if (msg.type === "CHECK" && msg.tabId !== TAB_ID) {
      channel.postMessage({
        type: "ALIVE",
        tabId: TAB_ID,
      });
    }

    if (msg.type === "ALIVE" && msg.tabId !== TAB_ID) {
      showDuplicatePage();
    }
  };

  // Storage listener
  window.addEventListener("storage", (e) => {
    if (
      e.key === LOCK_KEY &&
      e.newValue &&
      e.newValue !== TAB_ID
    ) {
      showDuplicatePage();
    }
  });

  // Cleanup
  window.addEventListener("beforeunload", () => {
    clearInterval(heartbeat);

    if (localStorage.getItem(LOCK_KEY) === TAB_ID) {
      localStorage.removeItem(LOCK_KEY);
      localStorage.removeItem(HEARTBEAT_KEY);
    }

    channel.close();
  });
};
*/
const LOCK_KEY = "POS_SINGLE_TAB_LOCK";
const HEARTBEAT_KEY = "POS_SINGLE_TAB_HEARTBEAT";
const CHANNEL = "POS_SINGLE_TAB_CHANNEL";

export const initSingleTab = () => {

  // Only enable duplicate-tab protection for localhost / IP / machine name
  const host = window.location.hostname.toLowerCase();

  const allowedDomains = [
    "deehub.connectcloud365.com",
    "dts.connectcloud365.com",
  ];

  const isLocalOrNetwork =
    host === "localhost" ||
    host === "127.0.0.1" ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ||
    !host.includes(".") ||
    allowedDomains.includes(host);

  if (!isLocalOrNetwork) {
    return;
  }

  const TAB_ID =
    window.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const channel = new BroadcastChannel(CHANNEL);

  let isDuplicate = false;
  let heartbeat = null;

  const showDuplicatePage = () => {
    if (isDuplicate) return;

    isDuplicate = true;

    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }

    channel.close();

    // Do NOT replace body or document.
    // Keep React #root intact.
    const duplicatePage = document.createElement("div");

    duplicatePage.id = "duplicate-tab-page";

    duplicatePage.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Arial, sans-serif;
      background: #fff;
    `;

    duplicatePage.innerHTML = `
      <div style="
        text-align:center;
        color:#111;
      ">
        <h2 style="
          color:#111;
          font-weight:600;
        ">
          This application is already open in another tab.
        </h2>

        <p style="
          color:#222;
          font-weight:400;
        ">
          Please use the existing tab.
        </p>
      </div>
    `;

    document.body.appendChild(duplicatePage);

    window.stop();
  };

  const owner = localStorage.getItem(LOCK_KEY);
  const lastHeartbeat = localStorage.getItem(HEARTBEAT_KEY);

  // Check existing lock
  if (owner && owner !== TAB_ID) {

    const heartbeatTime = lastHeartbeat
      ? parseInt(lastHeartbeat, 10)
      : 0;

    const HEARTBEAT_TIMEOUT = 3000;

    const isOwnerAlive =
      heartbeatTime > 0 &&
      Date.now() - heartbeatTime < HEARTBEAT_TIMEOUT;

    if (isOwnerAlive) {
      // Existing tab is active
      showDuplicatePage();
      return;
    }

    // Existing lock is stale
    localStorage.removeItem(LOCK_KEY);
    localStorage.removeItem(HEARTBEAT_KEY);
  }

  // Become owner
  localStorage.setItem(LOCK_KEY, TAB_ID);

  // Start heartbeat
  heartbeat = setInterval(() => {
    if (!isDuplicate) {
      localStorage.setItem(
        HEARTBEAT_KEY,
        Date.now().toString()
      );
    }
  }, 1000);

  // Ask other tabs
  channel.postMessage({
    type: "CHECK",
    tabId: TAB_ID,
  });

  channel.onmessage = (e) => {
    const msg = e.data;

    if (msg.type === "CHECK" && msg.tabId !== TAB_ID) {
      channel.postMessage({
        type: "ALIVE",
        tabId: TAB_ID,
      });
    }

    if (msg.type === "ALIVE" && msg.tabId !== TAB_ID) {
      showDuplicatePage();
    }
  };

  // Storage listener
  window.addEventListener("storage", (e) => {
    if (
      e.key === LOCK_KEY &&
      e.newValue &&
      e.newValue !== TAB_ID
    ) {
      showDuplicatePage();
    }
  });

  // Cleanup
  window.addEventListener("beforeunload", () => {
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }

    if (localStorage.getItem(LOCK_KEY) === TAB_ID) {
      localStorage.removeItem(LOCK_KEY);
      localStorage.removeItem(HEARTBEAT_KEY);
    }

    channel.close();
  });
};