/// <reference path="node_modules/@types/service_worker_api/index.d.ts" />

/**
 *
 * @param {CallableFunction} fn
 * @return {Promise<CallableFunction>}
 */
async function defer(fn) {
    return new Promise((resolve) => {
        setTimeout((cb) => {
            return resolve(cb())
        }, UI_DELAY_FIX, fn);
    });
}

function isAllowedTitle(title) {
    const allowed = [
        TARGET_TITLE,
        'chrome-extension://bdeihigdkcnekgbjggkcficjlcnfhjkn/index.html'
    ]
    return allowed.includes(title);
}


// background.js
const UI_DELAY_FIX = 200;
const TARGET_TITLE = "ai-stealth-challenge.tiiny.site"
const TARGET_HOST = "https://ai-stealth-challenge.tiiny.site/"

// target tab and window ids.
let TAB_ID;
let WIN_ID;

// track last processed win
let previousWinId;

// target original window minimized state.
let isOriginalMinimized = false;

// last target window options.
let win_opt;

// the background window we create with just a dummy about page.
/**
 * @type {chrome.windows.Window | undefined}
 */
let ABOUT;


/**
 *
 * @param {number} tab
 * @param window
 */
const sendTabBackgroundWin = async (tabId) => {

    const tab = await chrome.tabs.get(tabId);
    const prevWindowId = tab.windowId;

    if (prevWindowId !== WIN_ID) return;


    try {
        const prev = await chrome.windows.get(prevWindowId)
        previousWinId = prev.id;

    } catch (e) {
        console.error(e);
        return;
    }

    await chrome.tabs.create({windowId: prevWindowId, url: 'about:blank'})

    await chrome.tabs.move(tabId, {windowId: ABOUT.id, index: 100000})
    await chrome.tabs.update(tabId, {active: true})


    await chrome.windows.update(prevWindowId, {state: 'minimized'});


}

/**
 *
 * @param {number} winId
 * @return {Promise<void>}
 */
const restoreTabOriginalWin = async (winId) => {

    const tab = await chrome.tabs.get(TAB_ID);

    const tabId = tab.id;
    const prevWindowId = WIN_ID;

    if (prevWindowId !== winId) return;
    if (!tabId) return;

    await chrome.tabs.move(tabId, {windowId: prevWindowId, index: 100000})
    await chrome.tabs.update(tabId, {active: true})


    await chrome.tabs
        .query({url: 'about:blank', windowId: WIN_ID})
        .then(tabs => tabs.map(tab => chrome.tabs.remove(tab.id)))

    await chrome.windows.update(WIN_ID, {focused: true})

}


/**
 *
 * @param {number} tabId
 * @param winId
 */
const moveTabIntoWin = async (tabId, winId = 0) => {

    let tab = await chrome.tabs.get(tabId);

    let newWindow = ABOUT;
    let originalWinId = tab.windowId;

    if (!tab) return;

    return chrome.tabs
        .move(tabId, {windowId: newWindow.id, index: 100000})
        .then(movedTab => {
            return chrome.tabs.update(movedTab.id, {active: true})
        })
}

async function setActiveWindowById(winId) {

    console.info('[setWindowActive] id=%o', winId);

    /**
     * @type {chrome.windows.UpdateInfo}
     */
    const updateProperties = {
        focused: false,
        state: "normal",
        drawAttention: true
    };

    let result = false;
    try {
        let tab = await chrome.windows.update(
            winId,
            updateProperties
        );
        result = true;
    } catch (e) {
        console.warn('[setWindowActive] ERROR id=%o', winId, e);

    }

    return result
        ? Promise.resolve(result)
        : Promise.reject(result);

}

async function createWithTabId(tabId = 0) {
    return chrome.windows.create({
        tabId: tabId,
        focused: false,
        state: "normal",
        left: 500
    })
}

async function removeAboutWin() {
    if (ABOUT) {
        try {
            await chrome.windows.remove(ABOUT.id)
        } catch (e) {
            console.warn(`can not remove win`, ABOUT)
        } finally {
            ABOUT = undefined;
        }
    }
}

async function removeAboutTabs() {
    return chrome.tabs
        .query({url: 'about:blank'})
        .then(tabs => tabs.map(tab => chrome.tabs.remove(tab.id)))
        .then(results => {
            console.info('closed about tabs', results)
        })
}

async function createAboutWindow() {

    await removeAboutTabs();


    await removeAboutWin();

    ABOUT = await chrome.windows.create({
        url: "about:blank",
        state: "normal",
        focused: false,
        top: 0,
        left: 100,
        width: 50,
        height: 800
    });

    self.ABOUT = ABOUT;


    return Promise.resolve(ABOUT);
}


/* LifeCycle */

chrome.runtime.onInstalled.addListener(async (details) => {
    console.info('[chrome.runtime.onInstalled] tab id=%o', details);
})

// main logic.
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {

    const id = tabId;

    console.info('[chrome.tabs.onUpdated] tab id=%s', tabId, changeInfo, tab);

    if (changeInfo.status === 'complete') {

        // track the target demo window and tab ids.
        if (isAllowedTitle(tab.title)) {

            try {
                const win = await chrome.windows.get(tab.windowId);
            } catch (e) {
                console.error(e);
                return;
            }


            TAB_ID = tab.id;
            WIN_ID = tab.windowId;

            self.TAB_ID = tab.id;
            self.WIN_ID = tab.windowId;

            self.TAB = tab;

            ABOUT = await createAboutWindow();

            console.log(ABOUT);
        }

    }
})


// prevents minimization
chrome.windows.onFocusChanged.addListener(async function (windowId) {

    console.info("[windows.onFocusChanged] focus changed for windowId=%o and target=%o", windowId, WIN_ID);


    if (WIN_ID === undefined) return;

    /**
     * @type {chrome.windows.Window}
     */
    const w = await chrome.windows.getCurrent();
    const last = await chrome.windows.getLastFocused();


    const isMinimized = windowId === chrome.windows.WINDOW_ID_NONE;
    const isTarget = WIN_ID === w.id;


    // restore tab to the original window when restoring window.
    if (isOriginalMinimized && isTarget) {
        return await restoreTabOriginalWin(WIN_ID)
    }


    if (isTarget && !win_opt) {
        win_opt = {...w};
        return
    }

    // update target window opt.
    if (!isMinimized && isTarget && !!w) {
        win_opt = {...w};
        return;
    }

    if (!isMinimized) {
        previousWinId = windowId;
    }

    if (!win_opt) {
        console.warn('no win_opt', win_opt)
        return;
    }

    const {alwaysOnTop, ...up} = win_opt;

    const focused = win_opt.focused ?? false;

    console.info(win_opt)


    if (isTarget || last.id === previousWinId) {

        isOriginalMinimized = true;

        // return await moveTabIntoWin(TAB_ID)        

        let res = false;
        try {
            await sendTabBackgroundWin(TAB_ID);
            return res;
        } catch (e) {
            console.warn(`cant move tab id`, TAB_ID)
        }
    }

    // minimized or changed focus: restore window
    if (isTarget || last.id === previousWinId) {

        console.info('update window:', win_opt)

        let r1 = false;


        try {
            r1 = await setActiveWindowById(WIN_ID);
        } catch (e) {
            console.warn('[onFocusChanged] cant update', e);
        }


        let c = 0;
        while (!r1 && !!chrome.runtime.lastError) {

            console.log(`[onFocusChanged] loop ${c++} `, r1);

            try {
                await chrome.windows.update(WIN_ID, {
                    ...up,
                    focused: true
                });
                r1 = true;
            } catch (e) {
                console.warn('can not update window id:', WIN_ID)
            }
        }
        return;

    } else {
        console.warn('this should not happen', windowId, w);
    }


});

// shortcut.
self.rw = restoreTabOriginalWin;
