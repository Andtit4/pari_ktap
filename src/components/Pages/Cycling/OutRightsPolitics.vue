<template>
  <section class="top_matches">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12 gx-0 gx-sm-4">
          <div class="top_matches__main pt-20">
            <div class="row w-100 pt-md-5 mb-7 mb-md-0">
              <div class="col-12 pe-0">
                <div
                  class="top_matches__title d-flex align-items-center gap-sm-2 mb-4 mb-md-5"
                >
                  <IconCalendarEvent class="fs-three" height="31" width="31" />
                  <h3>Outrights Politics</h3>
                  <IconArrowBadgeUp
                    class="fs-four mt-1 cpoint"
                    height="24"
                    width="24"
                  />
                </div>
                <div class="top_matches__content">
                  <div
                    class="top_matches__winnercard p-4 p-sm-5 p-md-6 rounded-3 p2-bg"
                  >
                    <div
                      class="top_matches__winnercard-title d-flex align-items-center gap-2 mb-5 mb-md-6"
                    >
                      <img
                        :src="cyclingBig"
                        width="{30}"
                        height="{30}"
                        alt="Icon"
                      />
                      <div class="top_matches__winnercard-obi">
                        <span class="mb-3 n4-color">Jan 1, 2024, 10:00</span>
                        <h5>Milan - San Remo - Winner</h5>
                      </div>
                    </div>
                    <div class="row gy-2">
                      <div class="col-sm-6 col-xl-4">
                        <div class="top_matches__winnercard-sctn w-100">
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>van der Poel, Mathieu</span>
                            <span>4.5</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>Pogacar, Tadej</span>
                            <span>7.5</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3"
                          >
                            <span>Evenepoel, Remco</span>
                            <span>19.0</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-xl-4">
                        <div class="top_matches__winnercard-sctn w-100">
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>Van Aert, Wout</span>
                            <span>6.5</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>Mohoric, Matej</span>
                            <span>8.0</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3"
                          >
                            <span>de Lie, Arnaud</span>
                            <span>23.0</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-sm-6 col-xl-4">
                        <div class="top_matches__winnercard-sctn w-100">
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>Ganna, Filippo</span>
                            <span>6.5</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3 mb-2"
                          >
                            <span>Pedersen, Mads</span>
                            <span>8.0</span>
                          </div>
                          <div
                            class="top_matches__winnercard-singe d-flex align-items-center justify-content-between n11-bg rounded-2 py-2 px-3"
                          >
                            <span>Miliband, David</span>
                            <span>23.0</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-12">
                        <div
                          class="top_matches__winnercard-singe d-flex align-items-center justify-content-center n11-bg rounded-2 py-1 px-3 mb-2 gap-2 mt-2"
                        >
                          <span class="cpoint">Show more</span>
                          <i class="ti ti-arrow-badge-down cpoint mt-1"></i>
                        </div>
                      </div>
                    </div>
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
import { IconArrowBadgeUp, IconCalendarEvent } from "@tabler/icons-vue";
import cyclingBig from "@/assets/images/icon/cycling-big.png";
</script>

<style scoped></style>
