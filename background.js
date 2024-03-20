// background.js
const UI_DELAY_FIX = 200;
const TARGET_TITLE = "ai-stealth-challenge.tiiny.site"
const TARGET_HOST = "https://ai-stealth-challenge.tiiny.site/"

// target tab and window ids.
let TAB_ID;
let WIN_ID;

/**
 * Activate Tab by update.
 * @param {number} tabId
 * @return {Promise<boolean>}
 */
async function setActiveTabById(tabId) {
    /**
     *
     * @type {chrome.tabs.UpdateProperties}
     */
    const updateProperties = {'active': true, autoDiscardable: false, highlighted: true};

    let result = false;
    try {
        await chrome.tabs.update(tabId, updateProperties, (tab) => {
            console.log("[setTabActive] update successful.  active=true");
            result = true;
        });
    } catch (e) {
        console.error('[setTabActive] ', e);
    }

    return Promise.resolve(result);

}

// prevents minimization
chrome.windows.onFocusChanged.addListener(function (windowId) {

    console.log("[windows.onFocusChanged] focus changed for id=%o", windowId);

    if (!WIN_ID) return;

    chrome.windows.getCurrent(async function (window) {

        console.log('[windows.onFocusChanged] prevent target win from minimize and loose focus, id=%o', WIN_ID);

        await chrome.windows.update(WIN_ID, {
            state: "normal",
            drawAttention: true
        })
    });
});

// prevent others tabs to deactivate the target window
chrome.tabs.onActivated.addListener(function (/*TabActiveInfo*/ activeInfo) {
    console.log("[chrome.tabs.onActivated]", activeInfo);
})

// just ensure the handlers are set in place.
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {

    const id = tabId;

    console.info('[chrome.tabs.onUpdated] tab id=%s', tabId, changeInfo, tab);

    if (changeInfo.status === 'complete') {

        // track the target demo window and tab ids.
        if (tab.title === TARGET_TITLE) {
            TAB_ID = tab.id;
            WIN_ID = tab.windowId;
        }

        chrome.tabs.onActivated.addListener(function (tab) {
            console.info('[chrome.tabs.onActivated] tabId=%o', tab.tabId, tab);
            // fix ui lag bug
            setTimeout(async function () {
                await setActiveTabById(TAB_ID);
            }, UI_DELAY_FIX);
        })
    }
})
