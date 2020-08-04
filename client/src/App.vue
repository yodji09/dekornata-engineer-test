<template>
  <v-app>
    <v-app-bar
      dense
      app
      color="white"
    >
      <v-app-bar-nav-icon class="white--text red" @click.prevent="drawer = !drawer" v-if="isLogin"></v-app-bar-nav-icon>
      <v-toolbar-title class="pr-5" style="padding-left: 100px; display:flex; flex-direction:row; justify-content: space-between; width:100vw;">
        <div style="padding-top:8px; margin: 10px">
          <router-link to="/" style="text-decoration:none">
            <span class="red--text font-weight-bold">Shopping</span>
            <span class="red--text">.In</span>
          </router-link>
        </div>
        <div style="display:flex; flex-direction:row; justify-content:space-around; width: 10vw">
          <v-btn icon v-if="!isLogin" style="margin:10px">
            <router-link to="/login">Login</router-link>
          </v-btn>
          <v-btn icon v-if="!isLogin" style="margin:10px">
            <router-link to="/register">Register</router-link>
          </v-btn>
        </div>
      </v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" style="background-color:#ff4f5a" v-if="isLogin" justify-center>
      <v-list-item-group
      active-class="deep-purple--text text--accent-4"
      >
        <v-layout column align-center>
          <v-flex class="mt-5" justify-center>
            <v-avatar color="red" size="100">
              <v-icon dark>mdi-account</v-icon>
            </v-avatar>
          </v-flex>
          <p class="white--text mt-5">Shopping.In</p>
          <p class="white--text mt-5">{{name}}</p>
          <p class="white--text mt-5">Money: {{money}}</p>
        </v-layout>
        <v-list-item @click.prevent="getHome">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item @click.prevent="getWishList">
          <v-list-item-icon>
            <v-icon>mdi-cart-arrow-down</v-icon>
          </v-list-item-icon>
          <v-list-item-title>WishList</v-list-item-title>
        </v-list-item>

        <!--<v-list-item @click.prevent="getHistory">
          <v-list-item-icon>
            <v-icon>mdi-clock</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Transactions History</v-list-item-title>
        </v-list-item>-->

        <v-list-item @click.prevent="getTopUp">
          <v-list-item-icon>
            <v-icon>mdi-cash</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Topup</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
              <v-icon>exit_to_app</v-icon>
          </v-list-item-icon>
          <v-list-item-title @click.prevent="logout">Log Out</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-navigation-drawer>

    <v-main class="content">
      <router-view></router-view>>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {

  },

  data () {
    return {
      drawer: false
    }
  },
  methods: {
    logout () {
      localStorage.clear()
      this.$store.commit('SET_LOGIN', false)
      if (this.$router.history.current.name !== 'Home') this.$router.push('/')
    },
    getHome () {
      this.$router.push('/')
    },
    getWishList () {
      this.$router.push('/wishlist')
    },
    //  getHistory () {
    //  this.$router.push('/history')
    //  },
    getTopUp () {
      this.$router.push('/topup')
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    money () {
      let values = this.$store.state.money
      if (values === null) {
        values = 0
      }
      if (values === 0) {
        return 'Rp. ' + values + ',-'
      }
      let rupiah = ''
      const valuesrev = values.toString().split('').reverse().join('')
      for (let i = 0; i < valuesrev.length; i++) {
        if (i % 3 === 0) rupiah = rupiah + valuesrev.substr(i, 3) + '.'
      }
      return 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('') + ',-'
    },
    name () {
      return this.$store.state.name
    }
  },
  created () {
    const payload = {
      token: localStorage.getItem('token')
    }
    if (localStorage.getItem('token')) {
      this.$store.commit('SET_NAME', localStorage.name)
      this.$store.commit('SET_LOGIN', true)
      this.$store.commit('SET_MONEY', parseInt(localStorage.money))
      if (this.$store.state.wishlist.length < 1) {
        this.$store.dispatch('fetchWishlist', payload)
          .then(({ data }) => {
            data.Wishlists.forEach(element => {
              element.disabled = true
            })
            this.$store.commit('SET_WISHLIST', data.Wishlists)
          })
          .catch(err => {
            this.$store.commit('SET_MESSAGE', err.response.data.msg)
            setTimeout(() => {
              this.$store.commit('SET_MESSAGE', '')
            }, 3000)
          })
      }
    }
    this.$store.dispatch('fetchCategory')
    this.$store.dispatch('fetchProducts')
  }
}
</script>

<style scoped>
  .content {
    background-color: #f3f7f9;
  }
</style>
