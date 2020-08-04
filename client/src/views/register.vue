<template>
  <div style="background-color: #f3f7f9; display: flex; flex-direction:rows; height:89vh; width:100vw; flex-warp:warp; padding-top: 1vh;">
    <v-main style="width: 50vw; padding-left:15px">
      <v-img
        src="@/assets/4781.jpg"
        max-width="50vw"
        class="fill-height elevation-16"
      >
      </v-img>
    </v-main>
    <v-main style="padding: 5px 25px 0 0;">
      <v-container
        fluid
      >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
        >
          <p style="font-weight:700; font-size:40px; color: #ff4f5a">Create Shopping.In Account,<br> it's Free</p>
            <v-toolbar
              flat
            >
              <v-toolbar-title style="color: #ff4f5a;">Welcome! Join us to shop your life</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form @keyup.native.enter.prevent="login">
              <v-flex>
                <v-text-field
                  label="Full Name"
                  name="Name"
                  :rules="nameRules"
                  prepend-icon="person"
                  type="text"
                  v-model="name"
                  id="name-regis"
                  color= "#ff4f5a"
                ></v-text-field>

                <v-text-field
                  v-model="email"
                  name="Email"
                  prepend-icon="email"
                  :rules="emailRules"
                  label="E-mail"
                  id="email-regis"
                  required
                ></v-text-field>
              </v-flex>

                <v-text-field
                  label="Password"
                  name="password"
                  :rules="passwordRules"
                  prepend-icon="lock"
                  :type="type"
                  v-model="password"
                  id="password-register"
                ><v-icon slot="append" @click.prevent="showPassword">mdi-{{icon}}</v-icon>
                </v-text-field>
                <v-text-field
                  id="confirmpass-register"
                  label="Confirm Password"
                  name="password"
                  prepend-icon="lock"
                  :rules="confirmRules"
                  :type="type"
                  v-model="confirmPassword"
                ><v-icon slot="append" @click.prevent="showPassword">mdi-{{icon}}</v-icon>
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
              <v-btn @click.prevent="registerUser" style="background-color:#385a64; color: #ffffff;">create</v-btn>
            </v-card-actions>
        </v-col>
      </v-row>
    </v-container>
    </v-main>
  </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      type: 'password',
      icon: 'eye-off',
      requiredEmail: '',
      baseUrl: 'https://shielded-bastion-44955.herokuapp.com/',
      message: '',
      requiredPassword: '',
      requiredConfirm: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length > 7) || 'Password at least 8 at length',
        v => (v && /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d#$@!%&*?]{8,50}$/.test(v)) || 'Password must containt at least one number, one lower case and one upper case'
      ],
      confirmRules: [
        v => !!v || 'Confirm password is required',
        v => (v && v === this.password) || 'Password doesn\'t match'
      ],
      nameRules: [
        v => !!v || 'Name is required'
      ],
      snackbar: false,
      timeout: 2000
    }
  },
  methods: {
    showPassword () {
      this.type === 'password' ? this.type = 'text' : this.type = 'password'
      this.icon === 'eye-off' ? this.icon = 'eye' : this.icon = 'eye-off'
    },
    registerUser () {
      const payload = {
        name: this.name,
        email: this.email.toLowerCase(),
        password: this.password,
        confirmPassword: this.confirmPassword
      }
      this.$store.dispatch('register', payload)
        .then(({ data }) => {
          const payloadLogin = {
            email: this.email.toLowerCase(),
            password: this.password
          }
          return this.$store.dispatch('login', payloadLogin)
        })
        .then(({ data }) => {
          localStorage.setItem('token', data.acces_token)
          localStorage.setItem('name', data.name)
          localStorage.setItem('money', data.money)
          this.$store.commit('SET_NAME', data.name)
          this.$store.commit('SET_MONEY', data.money)
          this.$store.commit('SET_TOKEN', data.acces_token)
          this.$store.commit('SET_LOGIN', true)
          this.message = 'succes creating and account, redirecting to home'
          this.snackbar = true
          setTimeout(() => {
            this.$router.push('/')
          }, 3000)
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
