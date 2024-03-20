// background.js
const UI_DELAY_FIX = 200;
const TARGET_TITLE = "ai-stealth-challenge.tiiny.site"
const TARGET_HOST = "https://ai-stealth-challenge.tiiny.site/"
let ID;

/**
 *
 * @param {number} tabId
 * @return {Promise<boolean>}
 */
async function setActiveTabById(tabId) {
    const updateProperties = {'active': true};
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

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {

    const id = tabId;

    console.info('[chrome.tabs.onUpdated] tab id=%s', tabId, changeInfo, tab);

    if (changeInfo.status === 'complete') {

        // track the target demo window.
        if (tab.title === TARGET_TITLE) {
            ID = tab.id;
        }

        chrome.tabs.onActivated.addListener(function (tab) {
            console.info('[chrome.tabs.onActivated]', tab);
            // fix ui lag bug
            setTimeout(async function () {
                await setActiveTabById(ID);
            }, UI_DELAY_FIX);
        })
    }
})
