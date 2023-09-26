export default class ContentApp {
    settings

    constructor(settings, blackList) {
        this.settings = settings
        this.blackList = blackList

        this.onBlackListChanged = this.onBlackListChanged.bind(this)
        this.onMessagesChanged = this.onMessagesChanged.bind(this)
    }

    async init() {
        await this.fillBlackList()
        this.mute()

        await this.trackBackListState()
        this.trackMessagesChanged()
    }

    async fillBlackList() {
        const stored = await chrome.storage.sync.get(this.settings.map.blackListStateKey)
        const state = stored?.[this.settings.map.blackListStateKey] ?? {};

        this.blackList.import(state)
    }

    mute() {
        const params = (new URL(document.location)).searchParams;
        const sel = params.get("sel");

        const els = document.getElementsByClassName('im-mess-stack')

        for (let el of els) {
            const peer = el.getAttribute('data-peer')
            const info = this.blackList.getInfo(peer, sel)

            if (info === null) continue

            this.muteEl(el, info.hideType)
        }
    }

    muteEl(el, hideType) {
        switch (hideType) {
            case "blur":
                el.style['filter'] = 'blur(5px)'
                break;
            case "hide":
                for (let child of el.children) {
                    child.style['visibility'] = 'hidden'
                }
                el.style['border'] = 'dashed grey'
                break;
            case "disappear":
                el.style['display'] = 'none'
                break
            default:
                break;
        }
    }

    async onBlackListChanged() {
        await this.fillBlackList()
        this.mute()
    }

    async onMessagesChanged() {
        this.mute()
    }

    async trackBackListState() {
        await chrome.storage.onChanged.addListener((changes, namespace) => {
            for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
                if (key === this.settings.map.blackListStateKey) {
                    this.onBlackListChanged()
                    break
                }
            }
        });
    }

    trackMessagesChanged() {
        const observer = new MutationObserver(this.onMessagesChanged);
        observer.observe(document.querySelector('.im-page--chat-body'), {childList: true, subtree: true})
    }

}