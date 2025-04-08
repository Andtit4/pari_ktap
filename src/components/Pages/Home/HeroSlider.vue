<template>
  <section class="hero_area pb-5">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-sm-4">
          <div class="hero_area__main">
            <div class="row w-100">
              <div class="col-12">
                <div class="live-playing">
                  <div class="hero_area__topslider swiper-wrapper">
                    <swiper
                      class="slider_hero"
                      loop
                      :speed="5000"
                      :autoplay="{
                        delay: 0,
                      }"
                      :modules="[Autoplay]"
                      :breakpoints="{
                        0: {
                          slidesPerView: 1,
                        },
                        480: {
                          slidesPerView: 1.5,
                          spaceBetween: 20,
                        },
                        575: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        991: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        1499: {
                          slidesPerView: 3,
                          spaceBetween: 24,
                        },
                        1799: {
                          slidesPerView: 3.5,
                          spaceBetween: 24,
                        },
                      }"
                    >
                      <swiper-slide>
                        <div
                          class="hero_area__topslider-card swiper-slide p-4 p-md-6"
                        >
                          <div
                            class="hero_area__topslider-cardtop d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="d-flex align-items-center gap-2">
                              <IconBallFootball size="24" class="n5-color" />
                              <span class="fs-seven n5-color cpoint">
                                Premier league
                              </span>
                            </div>
                            <span class="fs-seven n5-color cpoint">
                              Feb 2, 00:00
                            </span>
                          </div>
                          <div
                            class="hero_area__topslider-cardbody d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="hero_area__topslider-flag">
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="chealse"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                            <div class="hero_area__topslider-vs">
                              <span class="fw-bold n5-color">VS</span>
                            </div>
                            <div
                              class="hero_area__topslider-flag text-end d-flex flex-column justify-content-end align-items-end"
                            >
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="liverpool"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                          </div>
                          <div
                            class="hero_area__topslider-cardfooter d-flex align-items-center justify-content-between gap-4"
                          >
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">1</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">X</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">2</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                          </div>
                        </div>
                      </swiper-slide>
                      <swiper-slide>
                        <div
                          class="hero_area__topslider-card swiper-slide p-4 p-md-6"
                        >
                          <div
                            class="hero_area__topslider-cardtop d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="d-flex align-items-center gap-2">
                              <IconBallFootball size="24" class="n5-color" />
                              <span class="fs-seven n5-color cpoint">
                                Premier league
                              </span>
                            </div>
                            <span class="fs-seven n5-color cpoint">
                              Feb 2, 00:00
                            </span>
                          </div>
                          <div
                            class="hero_area__topslider-cardbody d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="hero_area__topslider-flag">
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="chealse"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                            <div class="hero_area__topslider-vs">
                              <span class="fw-bold n5-color">VS</span>
                            </div>
                            <div
                              class="hero_area__topslider-flag text-end d-flex flex-column justify-content-end align-items-end"
                            >
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="liverpool"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                          </div>
                          <div
                            class="hero_area__topslider-cardfooter d-flex align-items-center justify-content-between gap-4"
                          >
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">1</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">X</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">2</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                          </div>
                        </div>
                      </swiper-slide>
                      <swiper-slide>
                        <div
                          class="hero_area__topslider-card swiper-slide p-4 p-md-6"
                        >
                          <div
                            class="hero_area__topslider-cardtop d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="d-flex align-items-center gap-2">
                              <IconBallFootball size="24" class="n5-color" />
                              <span class="fs-seven n5-color cpoint">
                                Premier league
                              </span>
                            </div>
                            <span class="fs-seven n5-color cpoint">
                              Feb 2, 00:00
                            </span>
                          </div>
                          <div
                            class="hero_area__topslider-cardbody d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="hero_area__topslider-flag">
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="chealse"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                            <div class="hero_area__topslider-vs">
                              <span class="fw-bold n5-color">VS</span>
                            </div>
                            <div
                              class="hero_area__topslider-flag text-end d-flex flex-column justify-content-end align-items-end"
                            >
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="liverpool"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                          </div>
                          <div
                            class="hero_area__topslider-cardfooter d-flex align-items-center justify-content-between gap-4"
                          >
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">1</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">X</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">2</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                          </div>
                        </div>
                      </swiper-slide>
                      <swiper-slide>
                        <div
                          class="hero_area__topslider-card swiper-slide p-4 p-md-6"
                        >
                          <div
                            class="hero_area__topslider-cardtop d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="d-flex align-items-center gap-2">
                              <IconBallFootball size="24" class="n5-color" />
                              <span class="fs-seven n5-color cpoint">
                                Premier league
                              </span>
                            </div>
                            <span class="fs-seven n5-color cpoint">
                              Feb 2, 00:00
                            </span>
                          </div>
                          <div
                            class="hero_area__topslider-cardbody d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="hero_area__topslider-flag">
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="chealse"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                            <div class="hero_area__topslider-vs">
                              <span class="fw-bold n5-color">VS</span>
                            </div>
                            <div
                              class="hero_area__topslider-flag text-end d-flex flex-column justify-content-end align-items-end"
                            >
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="liverpool"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                          </div>
                          <div
                            class="hero_area__topslider-cardfooter d-flex align-items-center justify-content-between gap-4"
                          >
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">1</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">X</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">2</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                          </div>
                        </div>
                      </swiper-slide>
                      <swiper-slide>
                        <div
                          class="hero_area__topslider-card swiper-slide p-4 p-md-6"
                        >
                          <div
                            class="hero_area__topslider-cardtop d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="d-flex align-items-center gap-2">
                              <IconBallFootball size="24" class="n5-color" />
                              <span class="fs-seven n5-color cpoint">
                                Premier league
                              </span>
                            </div>
                            <span class="fs-seven n5-color cpoint">
                              Feb 2, 00:00
                            </span>
                          </div>
                          <div
                            class="hero_area__topslider-cardbody d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="hero_area__topslider-flag">
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="chealse"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                            <div class="hero_area__topslider-vs">
                              <span class="fw-bold n5-color">VS</span>
                            </div>
                            <div
                              class="hero_area__topslider-flag text-end d-flex flex-column justify-content-end align-items-end"
                            >
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="liverpool"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                          </div>
                          <div
                            class="hero_area__topslider-cardfooter d-flex align-items-center justify-content-between gap-4"
                          >
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">1</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">X</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">2</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                          </div>
                        </div>
                      </swiper-slide>
                      <swiper-slide>
                        <div
                          class="hero_area__topslider-card swiper-slide p-4 p-md-6"
                        >
                          <div
                            class="hero_area__topslider-cardtop d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="d-flex align-items-center gap-2">
                              <IconBallFootball size="24" class="n5-color" />
                              <span class="fs-seven n5-color cpoint">
                                Premier league
                              </span>
                            </div>
                            <span class="fs-seven n5-color cpoint">
                              Feb 2, 00:00
                            </span>
                          </div>
                          <div
                            class="hero_area__topslider-cardbody d-flex align-items-center justify-content-between mb-4 mb-md-6"
                          >
                            <div class="hero_area__topslider-flag">
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="chealse"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                            <div class="hero_area__topslider-vs">
                              <span class="fw-bold n5-color">VS</span>
                            </div>
                            <div
                              class="hero_area__topslider-flag text-end d-flex flex-column justify-content-end align-items-end"
                            >
                              <div class="hero_area__topslider-flagbox mb-2">
                                <img
                                  width="{40}"
                                  height="{40}"
                                  :src="liverpool"
                                  alt="icon"
                                />
                              </div>
                              <h6 class="cpoint">Chealsea</h6>
                            </div>
                          </div>
                          <div
                            class="hero_area__topslider-cardfooter d-flex align-items-center justify-content-between gap-4"
                          >
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">1</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">X</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                            <div
                              class="hero_area__topslider-cfitem d-flex align-items-center gap-4 py-2 justify-content-center w-100 p2-bg cpoint"
                            >
                              <span class="fs-eight n5-color">2</span>
                              <span class="fw-bold fs-eight">1.87</span>
                            </div>
                          </div>
                        </div>
                      </swiper-slide>
                    </swiper>
                  </div>
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
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IconBallFootball } from "@tabler/icons-vue";
import chealse from "@/assets/images/icon/chealse.png";
import liverpool from "@/assets/images/icon/liverpool.png";
</script>

<style scoped></style>
