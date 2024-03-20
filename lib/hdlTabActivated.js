/**
 * @type {(activeInfo: chrome.tabs.TabActiveInfo)=>void}
 */
export const hdlTabActivated = async function (activeInfo) {
    console.log(`[hdlActivated]: win_id=(%o}`, activeInfo.windowId, activeInfo.tabId);

    if (chrome.runtime.lastError) {
        console.warn('[hdlActivated] ', chrome.runtime.lastError)
    } else if (activeInfo.tabId === TAB_ID) {
        console.log("[hdlActivated] Found TAB=%o, skipping", TAB_ID);
    } else {
        console.log("[hdlActivated] TAB=%o, setting active back tab id:", TAB_ID);

        try {
            console.info('[hdlActivated]', tab);

            // fix bug
            setTimeout(async function () {
                await setActiveTabById(TAB_ID);
            }, 100);

        } catch (e) {
            console.error('[hdlActivated]', e)
        }
    }
}
