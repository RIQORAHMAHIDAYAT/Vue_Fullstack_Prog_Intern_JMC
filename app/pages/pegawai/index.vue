<script setup>
definePageMeta({
  title: "Data Pegawai",
  layout: false,
  middleware: "auth",
});

useSeoMeta({ title: "Data Pegawai" });

import {
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
  IconFileDescription,
  IconCloudDownload,
} from "@tabler/icons-vue";

const { get, put, del } = useApi();
const { user, hasModuleAccess } = useAuth();

const canCRUD = computed(() => hasModuleAccess('modul_pegawai', 'create'));

onMounted(async () => {
  if (!hasModuleAccess('modul_pegawai')) {
    return navigateTo("/dashboard");
  }

  await fetchData();
});

onActivated(async () => {
  if (hasModuleAccess('modul_pegawai')) {
    await fetchData();
  }
});

const data = ref([]);
const loading = ref(true);
const pagination = ref(null);
const search = ref("");
const filterStatus = ref("");
const filterJenisKontrak = ref("");
const masaKerjaMin = ref("");
const masaKerjaMax = ref("");
const page = ref(1);
const selected = ref([]);

const jabatanMulti = ref([]);
const jabatanList = ref([
  { id: 1, nama: "Manager", tipe: "jabatan" },
  { id: 2, nama: "Staf", tipe: "jabatan" },
  { id: 3, nama: "Magang", tipe: "jabatan" },
]);

const filteredJabatanList = computed(() => {
  if (
    !jabatanList.value ||
    !Array.isArray(jabatanList.value) ||
    jabatanList.value.length === 0
  )
    return [];

  const hanyaJabatan = jabatanList.value.filter(
    (j) => j && j.tipe && String(j.tipe).trim().toLowerCase() === "jabatan",
  );

  const unik = [];
  const map = new Map();
  for (const item of hanyaJabatan) {
    if (item && item.nama && !map.has(item.nama)) {
      map.set(item.nama, true);
      unik.push(item);
    }
  }
  return unik;
});

async function fetchData() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.set("page", String(page.value));
    params.set("limit", "10");
    if (search.value) params.set("search", search.value);
    if (jabatanMulti.value.length > 0)
      params.set("jabatan", jabatanMulti.value.join(","));
    if (filterStatus.value) params.set("status", filterStatus.value);
    if (filterJenisKontrak.value)
      params.set("jenis_kontrak", filterJenisKontrak.value);
    if (masaKerjaMin.value) params.set("masa_kerja_min", masaKerjaMin.value);
    if (masaKerjaMax.value) params.set("masa_kerja_max", masaKerjaMax.value);

    const res = await get(`/pegawai?${params.toString()}`);
    data.value = res.data;
    pagination.value = res.pagination;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

watch(
  [
    search,
    jabatanMulti,
    filterStatus,
    filterJenisKontrak,
    masaKerjaMin,
    masaKerjaMax,
    page,
  ],
  fetchData,
);

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toggleSelect(id) {
  if (!canCRUD.value) return;
  const idx = selected.value.indexOf(id);
  if (idx === -1) selected.value.push(id);
  else selected.value.splice(idx, 1);
}

function toggleAll() {
  if (!canCRUD.value) return;
  if (selected.value.length === data.value.length) {
    selected.value = [];
  } else {
    selected.value = data.value.map((d) => d.id);
  }
}

async function deleteItem(id) {
  if (!canCRUD.value) return;
  if (!confirm("Hapus data ini?")) return;
  try {
    await del(`/pegawai/${id}`);
    await fetchData();
  } catch (err) {
    alert(err.message);
  }
}

async function batchStatus(status) {
  if (!canCRUD.value) return;
  if (selected.value.length === 0)
    return alert("Pilih pegawai terlebih dahulu");
  try {
    await put("/pegawai/status", { ids: selected.value, status });
    selected.value = [];
    await fetchData();
  } catch (err) {
    alert(err.message);
  }
}

function downloadPDF(id) {
  window.open(`/api/export/pegawai/${id}.pdf`, "_blank");
}

const formatMasaKerja = (row) => {
  if (!row.masa_kerja_tahun && row.masa_kerja_tahun !== 0) return "-";
  return `${row.masa_kerja_tahun} th ${row.masa_kerja_bulan || 0} bln`;
};
</script>

<template>
  <NuxtLayout name="default">
    <template #actions>
      <NuxtLink v-if="canCRUD" to="/pegawai/form" class="btn btn-primary">
        <IconPlus stroke="3" size="20" />Tambah
      </NuxtLink>
    </template>
    <div class="card">
      <div class="card-header">
        <div class="d-flex gap-2 ms-auto flex-wrap">
          <div class="d-flex align-items-center gap-1">
            <span class="text-nowrap">Masa Kerja</span>
            <input
              type="number"
              v-model="masaKerjaMin"
              class="form-control"
              style="width: 60px"
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              v-model="masaKerjaMax"
              class="form-control"
              style="width: 60px"
              placeholder="Max"
            />
          </div>

          <div class="dropdown" style="width: 180px">
            <button
              class="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex align-items-center justify-content-between"
              type="button"
              id="dropdownJabatan"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style="
                height: 38px;
                background-color: #fff;
                border: 1px solid #ced4da;
              "
            >
              <span class="text-truncate">
                {{
                  jabatanMulti.length > 0
                    ? filteredJabatanList
                        .filter((j) => jabatanMulti.includes(String(j.id)))
                        .map((j) => j.nama)
                        .join(", ")
                    : "Pilih Jabatan"
                }}
              </span>
            </button>
            <ul
              class="dropdown-menu p-2 w-100"
              aria-labelledby="dropdownJabatan"
              @click.stop
              style="max-height: 250px; overflow-y: auto"
            >
              <li v-for="j in filteredJabatanList" :key="j.id" class="mb-1">
                <label
                  class="dropdown-item d-flex align-items-center gap-2 rounded style-pointer m-0"
                >
                  <input
                    type="checkbox"
                    :value="String(j.id)"
                    v-model="jabatanMulti"
                    class="form-check-input m-0"
                  />
                  <span>{{ j.nama }}</span>
                </label>
              </li>
              <li
                v-if="filteredJabatanList.length === 0"
                class="text-muted text-center py-2"
              >
                Tidak ada data
              </li>
            </ul>
          </div>

          <select
            v-model="filterJenisKontrak"
            class="form-select"
            style="width: 140px"
          >
            <option value="">Semua Kontrak</option>
            <option value="PKWT">PKWT (Kontrak)</option>
            <option value="PKWTT">PKWTT (Tetap)</option>
            <option value="Magang">Magang</option>
          </select>
          <select
            v-model="filterStatus"
            class="form-select"
            style="width: 140px"
          >
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
          <div class="input-group" style="width: 200px">
            <input
              type="text"
              v-model="search"
              class="form-control"
              placeholder="Cari Nama/NIP..."
            />
            <button class="btn" type="button"><IconSearch stroke="2" /></button>
          </div>
        </div>
      </div>

      <div
        v-if="selected.length > 0 && canCRUD"
        class="card-body border-bottom py-2"
      >
        <div class="d-flex gap-2 align-items-center">
          <span>{{ selected.length }} terpilih</span>
          <button class="btn btn-sm btn-success" @click="batchStatus('Aktif')">
            Aktifkan
          </button>
          <button
            class="btn btn-sm btn-warning"
            @click="batchStatus('Nonaktif')"
          >
            Nonaktifkan
          </button>
        </div>
      </div>

      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5">
                <input
                  v-if="canCRUD"
                  type="checkbox"
                  :checked="selected.length === data.length && data.length > 0"
                  @change="toggleAll"
                />
              </th>
              <th width="5">No</th>
              <th width="15" class="text-center">Aksi</th>
              <th>NIP</th>
              <th>Nama</th>
              <th>Jabatan</th>
              <th>Tanggal Masuk</th>
              <th>Masa Kerja</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="8" class="text-center py-4">Memuat data...</td>
            </tr>
            <tr v-else-if="data.length === 0">
              <td colspan="8" class="text-center py-4">Tidak ada data</td>
            </tr>

            <tr
              v-else
              v-for="(item, index) in data"
              :key="item.id"
              :class="{ 'table-danger': item.status === 'Nonaktif' }"
            >
              <td>
                <input
                  v-if="canCRUD"
                  type="checkbox"
                  :checked="selected.includes(item.id)"
                  @change="toggleSelect(item.id)"
                />
              </td>
              <td class="text-center">
                {{
                  pagination
                    ? (pagination.page - 1) * pagination.limit + index + 1
                    : index + 1
                }}
              </td>
              <td class="text-nowrap">
                <div class="d-flex">
                  <NuxtLink
                    :to="`/pegawai/${item.id}`"
                    class="text-dark"
                    title="Detail"
                  >
                    <IconFileDescription stroke="1" size="20" />
                  </NuxtLink>
                  <a
                    href="javascript:;"
                    class="text-dark"
                    title="Download PDF"
                    @click="downloadPDF(item.id)"
                  >
                    <IconCloudDownload stroke="1" size="20" />
                  </a>
                  <NuxtLink
                    v-if="canCRUD"
                    :to="`/pegawai/form/${item.id}`"
                    class="text-primary"
                    title="Edit"
                  >
                    <IconPencil stroke="1.5" size="20" />
                  </NuxtLink>

                  <a
                    v-if="canCRUD"
                    href="javascript:;"
                    class="text-danger"
                    title="Hapus"
                    @click="deleteItem(item.id)"
                  >
                    <IconTrash stroke="1.5" size="20" />
                  </a>
                </div>
              </td>
              <td>{{ item.nip }}</td>
              <td>
                <div class="d-flex align-items-center gap-1">
                  <img
                    v-if="item.foto"
                    :src="`/images/pegawai/${item.foto}`"
                    alt=""
                    style="width: 28px; height: 28px"
                    class="rounded-pill"
                  />
                  {{ item.nama }}
                </div>
              </td>
              <td>{{ item.jabatan || "-" }}</td>
              <td>{{ formatDate(item.tanggal_masuk) }}</td>
              <td>{{ formatMasaKerja(item) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="pagination" class="card-footer d-flex align-items-center">
        <span class="text-secondary">Total: {{ pagination.total }} data</span>
        <ul class="pagination ms-auto m-0">
          <li class="page-item" :class="{ disabled: page <= 1 }">
            <a
              class="page-link"
              href="javascript:;"
              @click="page = Math.max(1, page - 1)"
              >Prev</a
            >
          </li>
          <li
            v-for="p in pagination.totalPages"
            :key="p"
            class="page-item"
            :class="{ active: p === page }"
          >
            <a class="page-link" href="javascript:;" @click="page = p">{{
              p
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: page >= pagination.totalPages }"
          >
            <a
              class="page-link"
              href="javascript:;"
              @click="page = Math.min(pagination.totalPages, page + 1)"
              >Next</a
            >
          </li>
        </ul>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.style-pointer {
  cursor: pointer;
}
.dropdown-item:active {
  background-color: var(--bs-light);
  color: var(--bs-body-color);
}
</style>
