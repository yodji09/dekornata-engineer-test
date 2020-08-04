<template>
  <div style="background-color: #f3f7f9; display: flex; flex-direction:rows; height:89vh; width:100vw; flex-warp:warp; padding-top: 1vh;">
    <v-main style="width: 50vw; padding-left:20px">
      <v-container
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            width="100%"
          >
              <p class="px-10" style="font-weight:700; font-size:40px; color: #ff4f5a">Welcome to The Greatest Ecommerce Ever, Shopping.In</p>
              <v-toolbar
                color="lightgrey"
                flat
              >
                <v-toolbar-title style="color: #ff4f5a;">Login Page</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @keyup.native.enter.prevent="login()">
                  <v-text-field
                    label="E-mail"
                    name="Email"
                    prepend-icon="email"
                    type="text"
                    id="email"
                    v-model="emailLogin"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="lock"
                    :type="type"
                    v-model="passwordLogin"
                  ><v-icon slot="append" @click.prevent="showPassword()">mdi-{{icon}}</v-icon>
                  </v-text-field>
                </v-form>
              </v-card-text>
              <div class="text-center">
                <v-snackbar
                  v-model="snackbar"
                  :timeout="timeout"
                >
                  {{ message }}
                  <v-btn
                    color="blue"
                    text
                    @click.prevent="snackbar = false"
                  >
                    Close
                  </v-btn>
                </v-snackbar>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <p style="margin:10px">Doesn't have an account? click <router-link to="/register">here</router-link> </p>
                <v-btn @click.prevent="login()" style="background-color:#385a64">Login</v-btn>
              </v-card-actions>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-main style="padding: 5px 0 0 0;">
      <v-img
        src="@/assets/3255317.jpg"
        max-width="50vw"
        class="fill-height elevation-16"
      >
      </v-img>
    </v-main>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      emailLogin: '',
      passwordLogin: '',
      icon: 'eye-off',
      fillingEmail: 'envelope',
      type: 'password',
      message: '',
      snackbar: false,
      timeout: 2000
    }
  },
  methods: {
    showPassword () {
      this.type === 'password' ? this.type = 'text' : this.type = 'password'
      this.icon === 'eye-off' ? this.icon = 'eye' : this.icon = 'eye-off'
    },
    login () {
      const payload = {
        email: this.emailLogin.toLowerCase(),
        password: this.passwordLogin
      }
      this.$store.dispatch('login', payload)
        .then(({ data }) => {
          console.log(data)
          localStorage.setItem('token', data.acces_token)
          localStorage.setItem('name', data.name)
          localStorage.setItem('money', data.money)
          this.$store.commit('SET_NAME', data.name)
          this.$store.commit('SET_MONEY', data.money)
          this.$store.commit('SET_TOKEN', data.acces_token)
          this.$store.commit('SET_LOGIN', true)
          this.$router.push('/')
        })
        .catch(err => {
          this.message = err.response.data.msg
          this.snackbar = true
        })
    }
  },
  created () {
    if (localStorage.token) {
      const payload = {
        token: localStorage.getItem('token')
      }
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
          })
      }
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>
