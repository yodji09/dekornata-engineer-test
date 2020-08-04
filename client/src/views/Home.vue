<template>
  <v-app>
    <v-row>
      <v-col
        v-for="product in Products"
        :key="product.id"
        class="d-flex child-flex my-0"
        cols="4"
      >
        <Card :product="product"/>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
// @ is an alias to /src
import Card from '../components/card'

export default {
  name: 'Home',
  components: {
    Card
  },
  computed: {
    wishlist () {
      return this.$store.state.wishlist
    },
    Categories () {
      return this.$store.state.categories
    },
    Products () {
      return this.$store.state.products
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
    this.$store.dispatch('fetchProducts')
    this.$store.dispatch('fetchCategory')
  }
}
</script>
