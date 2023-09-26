export default class Settings {
    map

    constructor() {
        this.map = {
            addBlackRuleBtnId: 'addBlackRuleBtn',
            removeBlackRuleBtnClass: 'remove-black-rule',
            blackListStateKey: 'blackListState',
            rulesViewId: 'rulesView',
            nameInputId: 'nameInput',
            peerInputId: 'peerInput',
            selInputId: 'selInput',
            hideTypeSelectId: 'hideTypeSelect'
        }
    }

    import(state) {
        this.map = state['map'] ?? {}
    }

    export() {
        return {
            map: this.map
        }
    }
}