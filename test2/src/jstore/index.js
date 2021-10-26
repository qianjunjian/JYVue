import Vue from 'vue'
import Vuex from './jvuex'

Vue.use(Vuex)

const sotre = new Vuex.Store({
    state: {
        counter: 0
    },
    mutations: {
        add(state) {
            state.counter++
        }
    },
    actions: {
        add({commit}) {
            setTimeout(() => {
                commit('add')
            }, 2000)
        }
    },
    getters: {
        doubleCounter: state => {
            return state.counter * 2
        }
    }
})

export default sotre
