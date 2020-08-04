import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const baseUrl = 'http://localhost:3000/'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    token: '',
    wishlist: [],
    totalPrice: null,
    message: '',
    categories: [],
    history: [],
    money: null,
    name: '',
    products: ''
  },
  mutations: {
    SET_PRODUCTS (state, payload) {
      state.products = payload
    },
    SET_LOGIN (state, payload) {
      state.isLogin = payload
    },
    SET_NAME (state, payload) {
      state.name = payload
    },
    SET_TOKEN (state, payload) {
      state.token = payload
    },
    UPDATE_WISHLIST (state, payload) {
      payload.disabled = true
      state.wishlist.push(payload)
    },
    UPDATE_QUANTITY (state, payload) {
      const index = state.wishlist.indexOf(payload.item)
      if (index !== -1) state.wishlist[index].quantity = payload.quantity
    },
    SET_TOTALPRICE (state, payload) {
      state.totalPrice = payload
    },
    SET_WISHLIST (state, payload) {
      state.wishlist = payload
    },
    SET_MESSAGE (state, payload) {
      state.message = payload
    },
    SET_CATEGORIES (state, payload) {
      state.categories = payload
    },
    SET_HISTORY (state, payload) {
      state.history = payload
    },
    DELETE_WISHLIST (state, payload) {
      const index = state.wishlist.indexOf(payload.item)
      if (index !== -1) state.wishlist.splice(index, 1)
    },
    SET_MONEY (state, payload) {
      state.money = payload
    }
  },
  actions: {
    login (context, payload) {
      return axios({
        url: baseUrl + 'users/login',
        method: 'POST',
        data: payload
      })
    },
    register (context, payload) {
      return axios({
        url: baseUrl + 'users/register',
        method: 'POST',
        data: payload
      })
    },
    fetchProducts (context, payload) {
      axios({
        url: baseUrl + 'products',
        method: 'GET'
      })
        .then(({ data }) => {
          context.commit('SET_PRODUCTS', data.Products)
        })
        .catch(err => {
          context.commit('SET_MESSAGE', err.response.data.msg)
          setTimeout(() => {
            context.commit('SET_MESSAGE', '')
          }, 3000)
        })
    },
    fetchCategory (context, payload) {
      axios({
        url: baseUrl + 'categories',
        method: 'GET'
      })
        .then(({ data }) => {
          context.commit('SET_CATEGORIES', data.Categories)
        })
        .catch(err => {
          context.commit('SET_MESSAGE', err.response.data.msg)
          setTimeout(() => {
            context.commit('SET_MESSAGE', '')
          }, 3000)
        })
    },
    fetchWishlist (context, payload) {
      return axios({
        url: baseUrl + 'transactions',
        method: 'GET',
        headers: {
          token: payload.token
        }
      })
    },
    addWishlist (context, payload) {
      return axios({
        url: baseUrl + 'transactions',
        method: 'POST',
        headers: {
          token: payload.token
        },
        data: {
          ProductId: payload.ProductId
        }
      })
    },
    checkOut (context, payload) {
      payload.listCheckOut.forEach(element => {
        element.quantity = parseInt(element.quantity)
        if (element.quantity > element.Product.stock) {
          return context.commit('SET_MESSAGE', 'Out Of Stock, dont exceed the products stock')
        }
      })
      if (!context.state.message) {
        axios({
          url: baseUrl + 'transactions/checkout',
          method: 'put',
          headers: {
            token: payload.token
          },
          data: {
            listCheckOut: payload.listCheckOut,
            totalPrice: context.state.totalPrice
          }
        })
          .then(({ data }) => {
            context.commit('SET_MESSAGE', data.message)
            context.commit('SET_WISHLIST', [])
            context.dispatch('fetchCategory')
            context.dispatch('fetchProducts')
            setInterval(() => {
              context.commit('SET_MESSAGE', '')
            }, 3000)
            localStorage.money = data.money
            context.commit('SET_MONEY', data.money)
          })
          .catch(err => {
            context.commit('SET_MESSAGE', err.response.data.msg)
            setTimeout(() => {
              context.commit('SET_MESSAGE', '')
            }, 3000)
          })
      }
      setTimeout(() => {
        context.commit('SET_MESSAGE', '')
      }, 3000)
    },
    checkOutHistory (context, payload) {
      axios({
        url: baseUrl + 'transactions/history',
        method: 'get',
        headers: {
          token: payload.token
        }
      })
        .then(({ data }) => {
          context.commit('SET_HISTORY', data.Transaction)
        })
        .catch(err => {
          context.commit('SET_MESSAGE', err.response.data.msg)
          setTimeout(() => {
            context.commit('SET_MESSAGE', '')
          }, 3000)
        })
    },
    deleteWishlist (context, payload) {
      return axios({
        url: baseUrl + 'transactions/' + parseInt(payload.item.id),
        method: 'delete',
        headers: {
          token: payload.token
        }
      })
    },
    topup (context, payload) {
      return axios({
        url: baseUrl + 'users/topup',
        method: 'put',
        headers: {
          token: payload.token
        },
        data: {
          money: payload.money
        }
      })
    }
  },
  modules: {
  }
})
