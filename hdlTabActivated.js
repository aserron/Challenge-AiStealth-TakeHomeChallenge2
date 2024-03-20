/**
 * @type {(activeInfo: chrome.tabs.TabActiveInfo)=>void}
 */
export const hdlTabActivated = async function (activeInfo) {
    console.log(`[hdlActivated]: win_id=(%o}`, activeInfo.windowId, activeInfo.tabId);

    if (chrome.runtime.lastError) {
        console.warn('[hdlActivated] ', chrome.runtime.lastError)
    } else if (activeInfo.tabId === ID) {
        console.log("[hdlActivated] Found TAB=%o, skipping", ID);
    } else {
        console.log("[hdlActivated] TAB=%o, setting active back tab id:", ID);

        try {
            console.info('[hdlActivated]', tab);

            // fix bug
            setTimeout(async function () {
                await setActiveTabById(ID);
            }, 100);

        } catch (e) {
            console.error('[hdlActivated]', e)
        }
    }
}
