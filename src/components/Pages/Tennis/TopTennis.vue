<template>
  <section className="top_matches">
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 gx-0 gx-sm-4">
          <div className="top_matches__main pt-20">
            <div className="row w-100 pt-md-5">
              <div className="col-12">
                <div
                  className="top_matches__title d-flex align-items-center gap-2 mb-4 mb-md-5"
                >
                  <img :src="king" width="{32}" height="{32}" alt="Icon" />
                  <h3>Top Soccer</h3>
                </div>
                <div className="top_matches__content">
                  <div
                    className="top_matches__cmncard p2-bg p-4 rounded-3 mb-4"
                    v-for="{
                      id,
                      football,
                      titletwo,
                      times,
                      clubone,
                      clubtwo,
                      clubNameOne,
                      clubNameTwo,
                      chart,
                      star,
                    } in soccerMatch"
                    :key="id"
                  >
                    <div className="row gx-0 gy-xl-0 gy-7">
                      <div className="col-xl-5 col-xxl-4">
                        <div className="top_matches__clubname">
                          <div
                            className="top_matches__cmncard-right d-flex align-items-start justify-content-between pb-4 mb-4 gap-4 "
                          >
                            <div className="d-flex align-items-center gap-1">
                              <img
                                :src="football"
                                width="{16}"
                                height="{16}"
                                alt="Icon"
                              />
                              <span className="fs-eight cpoint">
                                {{ titletwo }}
                              </span>
                            </div>
                            <div
                              className="d-flex align-items-center gap-4 pe-xl-15 flex-nowrap flex-xl-wrap"
                            >
                              <span className="fs-eight cpoint">
                                {{ times }}
                              </span>
                            </div>
                          </div>
                          <div
                            className="top_matches__cmncard-left d-flex align-items-center justify-content-between pe-xl-10"
                          >
                            <div>
                              <div
                                className="d-flex align-items-center gap-2 mb-4"
                              >
                                <img
                                  :src="clubone"
                                  width="{24}"
                                  height="{24}"
                                  alt="Icon"
                                />
                                <span className="fs-seven cpoint">
                                  {{ clubNameOne }}
                                </span>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  :src="clubtwo"
                                  width="{24}"
                                  height="{24}"
                                  alt="Icon"
                                />
                                <span className="fs-seven cpoint">
                                  {{ clubNameTwo }}
                                </span>
                              </div>
                            </div>
                            <div
                              className="d-flex align-items-center gap-4 position-relative pe-xl-15"
                            >
                              <span
                                className="v-line lg d-none d-xl-block"
                              ></span>
                              <div className="d-flex flex-column gap-5">
                                <img
                                  className="cpoint"
                                  :src="chart"
                                  width="{16}"
                                  height="{16}"
                                  alt="Icon"
                                />
                                <img
                                  className="cpoint"
                                  :src="star"
                                  width="{16}"
                                  height="{16}"
                                  alt="Icon"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-7 col-xxl-8 d-xl-flex">
                        <div
                          className="top_matches__clubdata top_matches__clubdatatwo"
                        >
                          <div className="table-responsive">
                            <table className="table mb-0 pb-0">
                              <thead>
                                <tr className="text-center">
                                  <th scope="col">
                                    <span className="fs-eight"> Winner </span>
                                  </th>
                                  <th scope="col">
                                    <span className="fs-eight">
                                      First set-winner
                                    </span>
                                  </th>
                                  <th scope="col">
                                    <span className="fs-eight">
                                      Second set-winner
                                    </span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="pt-4">
                                    <div
                                      className="top_matches__innercount d-flex align-items-center gap-2 "
                                    >
                                      <div
                                        className="top_matches__innercount-item clickable-active py-1 px-8 rounded-3 n11-bg"
                                      >
                                        <span
                                          className="fs-seven text-center d-block mb-2"
                                        >
                                          1
                                        </span>
                                        <span className="fw-bold d-block">
                                          1.5
                                        </span>
                                      </div>
                                      <div
                                        className="top_matches__innercount-item clickable-active py-1 px-8 rounded-3 n11-bg"
                                      >
                                        <span
                                          className="fs-seven text-center d-block mb-2"
                                        >
                                          2
                                        </span>
                                        <span className="fw-bold d-block">
                                          3.8
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="pt-4">
                                    <div
                                      className="top_matches__innercount d-flex align-items-center gap-2 "
                                    >
                                      <div
                                        className="top_matches__innercount-item clickable-active py-1 px-8 rounded-3 n11-bg"
                                      >
                                        <span
                                          className="fs-seven text-center d-block mb-2"
                                        >
                                          1
                                        </span>
                                        <span className="fw-bold d-block">
                                          1.39
                                        </span>
                                      </div>
                                      <div
                                        className="top_matches__innercount-item clickable-active py-1 px-8 rounded-3 n11-bg"
                                      >
                                        <span
                                          className="fs-seven text-center d-block mb-2"
                                        >
                                          2
                                        </span>
                                        <span className="fw-bold d-block">
                                          2.85
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="pt-4">
                                    <div
                                      className="top_matches__innercount d-flex align-items-center gap-2 "
                                    >
                                      <div
                                        className="top_matches__innercount-item clickable-active py-1 px-8 rounded-3 n11-bg"
                                      >
                                        <span
                                          className="fs-seven text-center d-block mb-2"
                                        >
                                          1
                                        </span>
                                        <span className="fw-bold d-block">
                                          3.45
                                        </span>
                                      </div>
                                      <div
                                        className="top_matches__innercount-item clickable-active py-1 px-8 rounded-3 n11-bg"
                                      >
                                        <span
                                          className="fs-seven text-center d-block mb-2"
                                        >
                                          2
                                        </span>
                                        <span className="fw-bold d-block">
                                          1.39
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <hr
                          className=" w-100 mt-8 d-none d-xl-block n4-color"
                        />
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
import { soccerMatch } from "../../../assets/data/tabOne";
import king from "@/assets/images/icon/king.png";
</script>

<style scoped></style>
