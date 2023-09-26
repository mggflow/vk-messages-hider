import BlackList from "../app/BlackList.js";
import Settings from "../app/Settings.js";

export default class PopupApp {
    settings

    blackList

    constructor(settings = new Settings()) {
        this.settings = settings


        this.onAddBlackRule = this.onAddBlackRule.bind(this)
        this.onRemoveBlackRule = this.onRemoveBlackRule.bind(this)
    }

    async init() {
        await this.makeBlackList()
        this.renderBlackRules()

        this.clickAddBlackRule()
        this.clickRemoveBlackRule()
    }

    async onAddBlackRule() {
        const peer = document.getElementById(this.settings.map.peerInputId).value
        const sel = document.getElementById(this.settings.map.selInputId).value
        const name = document.getElementById(this.settings.map.nameInputId).value
        const hideType = document.getElementById(this.settings.map.hideTypeSelectId).value

        this.blackList.set(peer, sel, name, hideType)

        await this.onChangeBlackListState();
    }

    async onRemoveBlackRule(e) {
        const sel = e.target.getAttribute('data-sel')
        const peer = e.target.getAttribute('data-peer')

        this.blackList.remove(peer, sel)

        await this.onChangeBlackListState();
    }

    renderBlackRules() {
        const blackRules = this.blackList.getAll()
        const rulesView = document.getElementById(this.settings.map.rulesViewId)

        rulesView.innerHTML = ''
        for (let rule of blackRules) {
            rulesView.insertAdjacentHTML('beforeend', this.genRuleView(rule))
        }
    }

    async makeBlackList() {
        this.blackList = new BlackList('Unknown', 'hide')

        const stored = await chrome.storage.sync.get(this.settings.map.blackListStateKey)
        const state = stored?.[this.settings.map.blackListStateKey] ?? {};

        this.blackList.import(state)
    }

    clickAddBlackRule() {
        document.getElementById(this.settings.map.addBlackRuleBtnId).addEventListener('click', this.onAddBlackRule)
    }

    clickRemoveBlackRule() {
        const btns = document.getElementsByClassName(this.settings.map.removeBlackRuleBtnClass)
        for (let btn of btns) {
            btn.removeEventListener('click', this.onRemoveBlackRule)
            btn.addEventListener('click', this.onRemoveBlackRule)
        }
    }

    genRuleView(rule) {
        return (
            '<div id="toast-default" class="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">\n' +
            '    <div class="ml-3 text-sm font-normal">' + rule.info.name + '</div>\n' +
            '    <button data-sel="' + rule.sel + '" data-peer="' + rule.peer + '" type="button" class="' + this.settings.map.removeBlackRuleBtnClass + ' ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">\n' +
            '        <span class="sr-only">Close</span>\n' +
            '        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">\n' +
            '            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>\n' +
            '        </svg>\n' +
            '    </button>\n' +
            '</div>\n')
    }

    async onChangeBlackListState() {
        const state = this.blackList.export()
        await chrome.storage.sync.set({[this.settings.map.blackListStateKey]: state});

        this.renderBlackRules()
        this.clickRemoveBlackRule()
    }
}