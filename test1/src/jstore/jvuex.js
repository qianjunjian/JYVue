let Vue

class Store {
    constructor(options) {
        this._mutations = options.mutations
        this._actions = options.actions

        this._vm = new Vue({
            data() {
                return {
                    $$state: options.state
                }
            }
        })

        this.commit = this.commit.bind(this)
        this.dispatch = this.dispatch.bind(this)
    }

    get state() {
        return this._vm._data.$$state
    }

    set state(v) {
        console.error('请使用reaplaceState()去修改状态');
    }

    commit(type, payload) {
        const entry = this._mutations[type]
        if (!entry) {
            console.error('error');
            return 
        }
        entry(this.state, payload)
    }

    dispatch(type, payload) {
        const entry = this._actions[type]
        if (!entry) {
            console.error('error');
            return 
        }
        return entry(this, payload)
    }
}

const install = function(_Vue) {
    Vue = _Vue

    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store;
            }
        },
    })
}

export default {
    Store,
    install
}