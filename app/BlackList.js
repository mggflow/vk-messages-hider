export default class BlackList {
    defName
    defHideType

    map

    constructor(defName = 'Unknown', defHideType = 'hide') {
        this.defName = defName
        this.defHideType = defHideType

        this.map = {}
    }

    set(peer, sel, name = this.defName, hideType = this.defHideType) {
        if (this.map[peer] === undefined) this.map[peer] = {}

        if (this.map[peer][sel] === undefined) this.map[peer][sel] = {
            name,
            hideType
        }
    }

    remove(peer, sel = null) {
        if (sel === null) {
            return delete this.map[peer]
        } else {
            if (this.map[peer] === undefined) return true
            return delete this.map[peer][sel]
        }
    }

    getInfo(peer, sel) {
        if (this.map[peer] === undefined) return null

        if (this.map[peer][sel] === undefined) return null

        return this.map[peer][sel]
    }

    getAll() {
        const all = []

        for (let peer in this.map) {
            for (let sel in this.map[peer]) {
                all.push({
                    peer,
                    sel,
                    info: this.map[peer][sel]
                })
            }
        }

        return all
    }

    export() {
        return {
            map: this.map
        }
    }

    import(state) {
        this.map = state['map'] ?? {}
    }
}