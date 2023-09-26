(async () => {
    const contentAppSrc = chrome.runtime.getURL("app/ContentApp.js");
    const {default: VkMuteContentApp} = await import(contentAppSrc);

    const settingsSrc = chrome.runtime.getURL("app/Settings.js");
    const {default: Settings} = await import(settingsSrc);

    const blackListSrc = chrome.runtime.getURL("app/BlackList.js");
    const {default: BlackList} = await import(blackListSrc);

    const settings = new Settings()
    const blackList = new BlackList('Unknown', 'hide')

    const app = new VkMuteContentApp(settings, blackList)
    await app.init()
})()




