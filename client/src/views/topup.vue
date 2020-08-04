<template>
  <v-app style="width:100vw; padding-top: 10px; max-height: 50vh">
    <div style="padding-left: 100px; margin: 20px">
      <p v-if="message" style="color: #ff4f5a">{{message}}</p>
      <v-form>
        <v-text-field clearable :rules="[v => v <= 100000000 || 'Cannot set value more than Rp. 100.000.000']" label="Total TopUp" type="number" v-model="topup" max="100000000"></v-text-field>
      </v-form>
      <v-btn style="text-align: center" @click.prevent="Payment"><v-icon>mdi-transfer</v-icon>TopUp</v-btn>
    </div>
    <div class="fill-height" align="center" justify="center">
      <v-img src="@/assets/2059.jpg"
      style="padding:20px;"
      >
      </v-img>
    </div>
  </v-app>
</template>

<script>
export default {
  name: 'topup',
  data () {
    return {
      topup: null,
      message: ''
    }
  },
  methods: {
    Payment () {
      const payload = {
        token: localStorage.token,
        money: this.topup
      }
      this.$store.dispatch('topup', payload)
        .then(({ data }) => {
          this.message = data.message
          localStorage.money = data.money
          this.$store.commit('SET_MONEY', data.money)
          this.topup = null
          setInterval(() => {
            this.message = ''
          }, 3000)
        })
        .catch(err => {
          this.$store.commit('SET_MESSAGE', err.response.data.msg)
          setTimeout(() => {
            this.$store.commit('SET_MESSAGE', '')
          }, 3000)
        })
    }
  }
}
</script>

<style>

</style>
