<script setup>
definePageMeta({
  title: "Dashboard",
  middleware: "auth",
});

useSeoMeta({ title: "Dashboard" });

import {
  IconUsers,
  IconHourglassEmpty,
  IconFileDescription,
  IconBackpack,
} from "@tabler/icons-vue";

const { get } = useApi();
const { user, isManagerHrd, isSuperadmin, isAdminHrd } = useAuth();
const dashboardData = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await get("/dashboard");
    dashboardData.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const statusPegawaiSeries = computed(() => {
  if (!dashboardData.value || !dashboardData.value.statistik) return [0, 0, 0];
  const s = dashboardData.value.statistik;
  return [Number(s.kontrak || 0), Number(s.tetap || 0), Number(s.magang || 0)];
});

const genderPegawaiSeries = computed(() => {
  if (!dashboardData.value || !dashboardData.value.statistik) return [0, 0];
  const s = dashboardData.value.statistik;
  return [Number(s.pria || 0), Number(s.wanita || 0)];
});

const statusPegawaiOptions = {
  chart: { type: "donut", height: 200 },
  labels: ["PKWT", "PKWTT", "Magang"],
  colors: [
    "rgba(84, 128, 199, 1)",
    "rgba(43, 80, 142, 1)",
    "rgba(254, 126, 0, 1)",
  ],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
};

const genderPegawaiOptions = {
  chart: { type: "donut", height: 200 },
  labels: ["Laki-laki", "Perempuan"],
  colors: ["rgba(43, 80, 142, 1)", "rgba(254, 126, 0, 1)"],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
};

const totalStatistik = computed(() => {
  if (!dashboardData.value) return [];
  const s = dashboardData.value.statistik;
  return [
    {
      title: "Total Pegawai",
      value: s.totalPegawai,
      backgroundColor: "linear-gradient(180deg, #549CE3 0%, #4A7BB2 100%)",
    },
    {
      title: "Total Pegawai Kontrak",
      value: s.kontrak,
      backgroundColor: "linear-gradient(180deg, #EACE5C 0%, #D4A94D 100%)",
    },
    {
      title: "Total Pegawai Tetap",
      value: s.tetap,
      backgroundColor: "linear-gradient(180deg, #20BF91 0%, #1DA17D 100%)",
    },
    {
      title: "Peserta Magang",
      value: s.magang,
      backgroundColor: "linear-gradient(180deg, #F48968 0%, #CD795D 100%)",
    },
  ];
});
</script>

<template>
  <div class="row g-3">
    <!-- SUPERADMIN & ADMIN HRD: hanya greeting -->
    <div v-if="isSuperadmin() || isAdminHrd()" class="col-12">
      <div class="card">
        <div class="card-body text-center py-5">
          <h2 class="mb-2">
            Selamat Datang {{ user?.nama || "Pengguna" }} -
            {{ user?.role || "-" }}
          </h2>
          <p class="text-secondary">Anda masuk sebagai {{ user?.role }}</p>
        </div>
      </div>
    </div>

    <!-- MANAGER HRD: dashboard penuh -->
    <template v-if="isManagerHrd()">
      <div class="col-md-3">
        <div class="card bg-dark h-100 position-relative">
          <div class="card-body">
            <div class="text-center">
              <img
                src="@/assets/images/greeting-img.svg"
                alt=""
                class="img-fluid mb-4"
              />
            </div>
            <h3 class="card-title text-white">
              {{ dashboardData?.greeting || "Selamat Datang" }} di Aplikasi
              Kepegawaian
            </h3>
            <p class="text-white fw-lighter fst-italic">
              "Fokuskan tujuan yang ingin didapat, jangan biarkan faktor lain
              menghalangi tujuan Anda"
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <div class="row g-3">
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div v-if="loading" class="text-center py-4">
                  Memuat data...
                </div>
                <div v-else class="row g-3">
                  <div
                    class="col-md-6 col-lg-3"
                    v-for="(item, index) in totalStatistik"
                    :key="index"
                  >
                    <div class="row align-items-center">
                      <div class="col-auto">
                        <div
                          class="d-flex rounded-circle"
                          :style="{
                            width: '56px',
                            height: '56px',
                            background: item.backgroundColor,
                          }"
                        >
                          <IconUsers
                            v-if="index === 0"
                            :stroke="2"
                            class="m-auto text-white"
                          />
                          <IconHourglassEmpty
                            v-else-if="index === 1"
                            :stroke="2"
                            class="m-auto text-white"
                          />
                          <IconFileDescription
                            v-else-if="index === 2"
                            :stroke="2"
                            class="m-auto text-white"
                          />
                          <IconBackpack
                            v-else
                            :stroke="2"
                            class="m-auto text-white"
                          />
                        </div>
                      </div>
                      <div class="col">
                        <h3 class="fs-2 mb-1">{{ item.value }}</h3>
                        <p class="text-secondary fw-light mb-0">
                          {{ item.title }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title">
                  Total Pegawai Berdasarkan Status Kontrak
                </h3>
                <ClientOnly>
                  <apexchart
                    type="donut"
                    height="200"
                    :options="statusPegawaiOptions"
                    :series="statusPegawaiSeries"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title">Total Pegawai Berdasarkan Gender</h3>
                <ClientOnly>
                  <apexchart
                    type="donut"
                    height="200"
                    :options="genderPegawaiOptions"
                    :series="genderPegawaiSeries"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Data Pegawai Terbaru</h3>
              </div>
              <div class="table-responsive card-body p-0">
                <table class="table table-vcenter table-striped card-table">
                  <thead>
                    <tr>
                      <th class="w-1">No</th>
                      <th>NIP</th>
                      <th>Nama Lengkap</th>
                      <th>Tanggal Masuk</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in dashboardData?.pegawaiTerbaru ||
                      []"
                      :key="item.id"
                      :class="{ 'table-danger': item.status === 'Nonaktif' }"
                    >
                      <td class="text-center">{{ index + 1 }}</td>
                      <td>{{ item.nip }}</td>
                      <td>
                        <div class="d-flex align-items-center gap-1">
                          <img
                            :src="
                              item.foto
                                ? `/images/pegawai/${item.foto}`
                                : '/favicon.png'
                            "
                            alt=""
                            style="width: 32px; height: 32px"
                            class="rounded-pill"
                          />
                          <p class="mb-0">{{ item.nama }}</p>
                        </div>
                      </td>
                      <td>
                        {{
                          item.tanggal_masuk
                            ? new Date(item.tanggal_masuk).toLocaleDateString(
                                "id-ID",
                              )
                            : "-"
                        }}
                      </td>

                      <td>
                        <span
                          :class="
                            item.status === 'Aktif'
                              ? 'badge bg-success-lt'
                              : 'badge bg-danger-lt'
                          "
                        >
                          {{ item.status }}
                        </span>
                      </td>

                      <td>
                        <NuxtLink
                          :to="`/pegawai/${item.id}`"
                          class="btn btn-primary btn-sm"
                          >Detail</NuxtLink
                        >
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Fallback jika role tidak dikenali -->
    <div
      v-if="!isManagerHrd() && !isSuperadmin() && !isAdminHrd()"
      class="col-12"
    >
      <div class="card">
        <div class="card-body text-center py-5">
          <h2 class="mb-2">
            Selamat Datang {{ user?.nama || "Pengguna" }} -
            {{ user?.role || "-" }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>
