import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const sotre = new Vuex.Sotre({
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
    }
})

export default sotre
