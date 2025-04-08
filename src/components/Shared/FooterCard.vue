<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { IconSettings, IconTrash } from "@tabler/icons-vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Switch } from "@headlessui/vue";
import salzburg from "@/assets/images/icon/sports-salzburg.png";

const enabled = ref(false);

const isCardExpanded = ref(false);
const activeItem = ref("Single");
const toggleCard = () => {
  isCardExpanded.value = !isCardExpanded.value;
};

const handleClick = (item: string) => {
  activeItem.value = item;
};
const items = ["Single", "Multiple", "System"];

const handleClickOutSide = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (isCardExpanded.value && !target.closest(".fixed_footer")) {
    isCardExpanded.value = false;
  }
};

onMounted(() => {
  document.body.addEventListener("click", handleClickOutSide);
});
onBeforeUnmount(() => {
  document.body.removeEventListener("click", handleClickOutSide);
});
</script>

<template>
  <div
    class="fixed_footer p3-bg rounded-5"
    :class="isCardExpanded ? 'expandedtexta' : 'expanded2'"
  >
    <div class="fixed_footer__head py-3 px-4">
      <div class="d-flex justify-content-between">
        <div class="fixed_footer__head-betslip d-flex align-items-center gap-2">
          <span class="fw-bold">Betslip</span>
          <span class="fixed_footer__head-n1">1</span>
          <button @click="toggleCard" class="footfixedbtn" type="button">
            <i
              class="ti ti-arrow-badge-down-filled n5-color fs-four fixediconstyle"
            ></i>
          </button>
        </div>
        <div
          class="fixed_footer__head-quickbet d-flex align-items-center gap-1"
        >
          <span class="fw-bold">Betslip Bet</span>
          <Switch v-model="enabled" as="template" v-slot="{ checked }">
            <button
              class="position-relative d-inline-flex h-6 w-11 align-items-center rounded-full border border-2"
            >
              <span
                :class="checked ? 'translate-x-5' : 'translate-x-1'"
                class="d-inline-block h-4 w-4 transform rounded-full bg-white transition"
              ></span>
            </button>
          </Switch>
        </div>
      </div>
    </div>
    <div class="fixed_footer__content position-relative">
      <TabGroup>
        <TabList class="tab-list">
          <Tab
            v-for="item in items"
            class="tab-item"
            :class="activeItem == item ? 'n11-bg' : ''"
            :key="item"
            @click="() => handleClick(item)"
          >
            <span class="tab-trigger cpoint">{{ item }}</span>
          </Tab>
        </TabList>
        <TabPanels class="tab-container n11-bg">
          <TabPanel class="">
            <div class="fixed_footer__content-live px-4 py-5 mb-5">
              <div
                class="d-flex align-items-center justify-content-between mb-4"
              >
                <div class="d-flex align-content-center gap-1">
                  <img :src="salzburg" width="{20}" height="{20}" alt="Icon" />
                  <span class="fs-seven cpoint">Salzburg</span>
                  <span class="fs-seven">vs.</span>
                  <span class="fs-seven cpoint">Union Berlin</span>
                </div>
                <span class="r1-color fs-seven">Live</span>
                <i class="ti ti-x n4-color cpoint"></i>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="fixed_footer__content-scr py-1 px-2 fs-seven"
                  >3.80</span
                >
                <div>
                  <span class="fs-seven d-block">over 132.5</span>
                  <span class="fs-nine d-block">Total (incl. overtime)</span>
                </div>
              </div>
            </div>
            <div class="fixed_footer__content-formarea px-4">
              <form>
                <div
                  class="border-four d-flex align-items-center justify-content-between pe-2 rounded-3 mb-4"
                >
                  <input
                    placeholder="Bet amount"
                    class="place-style"
                    type="text"
                  />
                  <button class="cmn-btn p-1 fs-seven fw-normal" type="button">
                    Max
                  </button>
                </div>
                <div
                  class="fixed_footer__content-selectammount d-flex align-items-center justify-content-between mb-4"
                >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active active"
                    >25</span
                  >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active"
                    >80</span
                  >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active"
                    >40</span
                  >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active"
                    >100</span
                  >
                </div>
                <div
                  class="fixed_footer__content-possible d-flex align-items-center justify-content-between gap-2 mb-7"
                >
                  <span class="fs-seven">Possible win</span>
                  <span class="fs-seven fw-bold">$300</span>
                </div>
                <button type="button" class="cmn-btn px-5 py-3 w-100 mb-4">
                  Place Bet
                </button>
                <button
                  type="button"
                  class="cmn-btn third-alt px-5 py-3 w-100 mb-6"
                >
                  Book
                </button>
              </form>
            </div>
            <div
              class="fixed_footer__content-bottom d-flex align-items-center justify-content-between"
            >
              <div class="right-border d-flex align-items-center gap-2">
                <IconTrash
                  height="20"
                  width="20"
                  class="n3-color fs-five cpoint"
                />
                <router-link to="#" class="n3-color fs-seven"
                  >Sign In & Bet</router-link
                >
              </div>
              <div
                class="right-border2 d-flex align-items-center justify-content-end gap-2"
              >
                <IconSettings
                  height="20"
                  width="20"
                  class="n3-color fs-five cpoint"
                />
                <router-link to="#" class="n3-color fs-seven"
                  >Settings</router-link
                >
              </div>
            </div>
          </TabPanel>
          <TabPanel class="">
            <div class="fixed_footer__content-live px-4 py-5 mb-5">
              <div
                class="d-flex align-items-center justify-content-between mb-4"
              >
                <div class="d-flex align-content-center gap-1">
                  <img :src="salzburg" width="{20}" height="{20}" alt="Icon" />
                  <span class="fs-seven cpoint">Salzburg</span>
                  <span class="fs-seven">vs.</span>
                  <span class="fs-seven cpoint">Union Berlin</span>
                </div>
                <span class="r1-color fs-seven">Live</span>
                <i class="ti ti-x n4-color cpoint"></i>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="fixed_footer__content-scr py-1 px-2 fs-seven"
                  >4.80</span
                >
                <div>
                  <span class="fs-seven d-block">over 182.5</span>
                  <span class="fs-nine d-block">Total (incl. overtime)</span>
                </div>
              </div>
            </div>
            <div class="fixed_footer__content-formarea px-4">
              <form>
                <div
                  class="border-four d-flex align-items-center justify-content-between pe-2 rounded-3 mb-4"
                >
                  <input
                    placeholder="Bet amount"
                    class="place-style"
                    type="text"
                  />
                  <button class="cmn-btn p-1 fs-seven fw-normal" type="button">
                    Max
                  </button>
                </div>
                <div
                  class="fixed_footer__content-selectammount d-flex align-items-center justify-content-between mb-4"
                >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active active"
                    >30</span
                  >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active"
                    >60</span
                  >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active"
                    >80</span
                  >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active"
                    >100</span
                  >
                </div>
                <div
                  class="fixed_footer__content-possible d-flex align-items-center justify-content-between gap-2 mb-7"
                >
                  <span class="fs-seven">Possible win</span>
                  <span class="fs-seven fw-bold">$400</span>
                </div>
                <button type="button" class="cmn-btn px-5 py-3 w-100 mb-4">
                  Place Bet
                </button>
                <button
                  type="button"
                  class="cmn-btn third-alt px-5 py-3 w-100 mb-6"
                >
                  Book
                </button>
              </form>
            </div>
            <div
              class="fixed_footer__content-bottom d-flex align-items-center justify-content-between"
            >
              <div class="right-border d-flex align-items-center gap-2">
                <IconTrash
                  height="20"
                  width="20"
                  class="n3-color fs-five cpoint"
                />
                <router-link to="#" class="n3-color fs-seven"
                  >Sign In & Bet</router-link
                >
              </div>
              <div
                class="right-border2 d-flex align-items-center justify-content-end gap-2"
              >
                <IconSettings
                  height="20"
                  width="20"
                  class="n3-color fs-five cpoint"
                />
                <router-link to="#" class="n3-color fs-seven"
                  >Settings</router-link
                >
              </div>
            </div>
          </TabPanel>
          <TabPanel class="">
            <div class="fixed_footer__content-live px-4 py-5 mb-5">
              <div
                class="d-flex align-items-center justify-content-between mb-4"
              >
                <div class="d-flex align-content-center gap-1">
                  <img :src="salzburg" width="{20}" height="{20}" alt="Icon" />
                  <span class="fs-seven cpoint">Salzburg</span>
                  <span class="fs-seven">vs.</span>
                  <span class="fs-seven cpoint">Union Berlin</span>
                </div>
                <span class="r1-color fs-seven">Live</span>
                <i class="ti ti-x n4-color cpoint"></i>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="fixed_footer__content-scr py-1 px-2 fs-seven"
                  >5.80</span
                >
                <div>
                  <span class="fs-seven d-block">over 232.5</span>
                  <span class="fs-nine d-block">Total (incl. overtime)</span>
                </div>
              </div>
            </div>
            <div class="fixed_footer__content-formarea px-4">
              <form>
                <div
                  class="border-four d-flex align-items-center justify-content-between pe-2 rounded-3 mb-4"
                >
                  <input
                    placeholder="Bet amount"
                    class="place-style"
                    type="text"
                  />
                  <button class="cmn-btn p-1 fs-seven fw-normal" type="button">
                    Max
                  </button>
                </div>
                <div
                  class="fixed_footer__content-selectammount d-flex align-items-center justify-content-between mb-4"
                >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active active"
                    >80</span
                  >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active"
                    >100</span
                  >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active"
                    >180</span
                  >
                  <span
                    class="fs-seven cpoint py-1 px-4 border-four rounded-2 clickable-active"
                    >200</span
                  >
                </div>
                <div
                  class="fixed_footer__content-possible d-flex align-items-center justify-content-between gap-2 mb-7"
                >
                  <span class="fs-seven">Possible win</span>
                  <span class="fs-seven fw-bold">$900</span>
                </div>
                <button type="button" class="cmn-btn px-5 py-3 w-100 mb-4">
                  Place Bet
                </button>
                <button
                  type="button"
                  class="cmn-btn third-alt px-5 py-3 w-100 mb-6"
                >
                  Book
                </button>
              </form>
            </div>
            <div
              class="fixed_footer__content-bottom d-flex align-items-center justify-content-between"
            >
              <div class="right-border d-flex align-items-center gap-2">
                <IconTrash
                  height="20"
                  width="20"
                  class="n3-color fs-five cpoint"
                />
                <router-link to="#" class="n3-color fs-seven"
                  >Sign In & Bet</router-link
                >
              </div>
              <div
                class="right-border2 d-flex align-items-center justify-content-end gap-2"
              >
                <IconSettings
                  height="20"
                  width="20"
                  class="n3-color fs-five cpoint"
                />
                <router-link to="#" class="n3-color fs-seven"
                  >Settings</router-link
                >
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>

<style scoped></style>
