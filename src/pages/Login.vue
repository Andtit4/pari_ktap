<template>
  <section class="login_section pt-120 p3-bg">
    <div class="container-fluid">
      <div class="row justify-content-between align-items-center">
        <div class="col-6">
          <div class="login_section__thumb d-none d-lg-block">
            <img
              class="w-100"
              width="{720}"
              height="{900}"
              :src="login"
              alt="Image"
            />
          </div>
        </div>
        <div class="col-lg-6 col-xl-5">
          <div class="login_section__loginarea">
            <div class="row justify-content-start">
              <div class="col-xxl-10">
                <div class="pb-10 pt-8 mb-7 mt-12 mt-lg-0 px-4 px-sm-10">
                  <h3 class="mb-6 mb-md-8">Login</h3>
                  <p class="mb-10 mb-md-15">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Maecenas aliquet justo magna.
                  </p>
                  <div class="login_section__form">
                    <form>
                      <div class="mb-5 mb-md-6">
                        <input
                          class="n11-bg"
                          name="Input-1"
                          data-name="Input 1"
                          placeholder="Email"
                          type="email"
                          id="Input"
                        />
                      </div>
                      <div class="mb-5 mb-md-6">
                        <input
                          class="n11-bg"
                          name="Input-3"
                          data-name="Input 3"
                          placeholder="Password"
                          type="password"
                          id="Input-3"
                        />
                      </div>
                      <button
                        class="cmn-btn px-5 py-3 mb-6 w-100"
                        type="submit"
                      >
                        Sign Up Now
                      </button>
                    </form>
                  </div>
                  <div class="login_section__socialmedia text-center mb-6">
                    <span class="mb-6">Or continue with</span>
                    <div class="login_section__social d-center gap-3">
                      <router-link to="#" class="n11-bg px-3 py-2 rounded-5"
                        ><IconBrandFacebookFilled :size="24"
                      /></router-link>
                      <router-link to="#" class="n11-bg px-3 py-2 rounded-5"
                        ><IconBrandTwitterFilled :size="24"
                      /></router-link>
                      <router-link to="#" class="n11-bg px-3 py-2 rounded-5"
                        ><IconBrandGoogle :size="24"
                      /></router-link>
                    </div>
                  </div>
                  <span class="d-center gap-1"
                    >Create your account?
                    <router-link class="g1-color" to="/create-acount"
                      >Sing Up Now</router-link
                    ></span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import login from "@/assets/images/login.png";
import {
  IconBrandFacebookFilled,
  IconBrandGoogle,
  IconBrandTwitterFilled,
} from "@tabler/icons-vue";
</script>

<style scoped></style>
