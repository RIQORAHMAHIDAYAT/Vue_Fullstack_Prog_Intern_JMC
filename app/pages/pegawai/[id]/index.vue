<template>
  <div class="row g-3">
    <div v-if="loading" class="col-12 text-center py-4">Memuat data...</div>
    <template v-else-if="pegawai">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Data Diri</h3></div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-12">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <img :src="fotoUrl" alt="" class="foto-ptofil" />
                  </div>
                  <div class="col">
                    <div class="datagrid-item mb-4">
                      <div class="datagrid-title">NIP</div>
                      <div class="datagrid-content">
                        {{ pegawai.nip || "-" }}
                      </div>
                    </div>
                    <div class="datagrid-item">
                      <div class="datagrid-title">Nama Lengkap</div>
                      <div class="datagrid-content">
                        {{ pegawai.nama_pegawai || "-" }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Email</div>
                  <div class="datagrid-content">{{ pegawai.email || "-" }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Nomor HP</div>
                  <div class="datagrid-content">
                    {{ pegawai.nomor_hp || "-" }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Tempat Lahir</div>
                  <div class="datagrid-content">
                    {{ pegawai.tempat_lahir || "-" }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Tanggal Lahir</div>
                  <div class="datagrid-content">
                    {{ formatDate(pegawai.tanggal_lahir) }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Usia</div>
                  <div class="datagrid-content">
                    {{ pegawai.usia || "-" }} tahun
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Pendidikan</div>
                  <div
                    class="datagrid-content"
                    v-for="p in pegawai.pendidikan || []"
                    :key="p.id"
                  >
                    {{ p.tingkat_pendidikan || "-" }} /
                    {{ p.nama_sekolah || "-" }} / {{ p.tahun_lulus || "-" }}
                  </div>
                  <div
                    class="datagrid-content"
                    v-if="!pegawai.pendidikan?.length"
                  >
                    -
                  </div>
                </div>
              </div>
              <div class="col-12">
                <div class="datagrid-item">
                  <div class="datagrid-title">Alamat Lengkap</div>
                  <div class="datagrid-content">
                    {{ pegawai.alamat_lengkap || "-" }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="datagrid-item">
                  <div class="datagrid-title">Kecamatan</div>
                  <div class="datagrid-content">
                    {{ pegawai.kecamatan || "-" }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="datagrid-item">
                  <div class="datagrid-title">Kabupaten</div>
                  <div class="datagrid-content">
                    {{ pegawai.kabupaten || "-" }}
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="datagrid-item">
                  <div class="datagrid-title">Provinsi</div>
                  <div class="datagrid-content">
                    {{ pegawai.provinsi || "-" }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Status Pernikahan</div>
                  <div class="datagrid-content">
                    {{ pegawai.status_kawin || "-" }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Jumlah Anak</div>
                  <div class="datagrid-content">
                    {{ pegawai.jumlah_anak ?? "-" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Data Kepegawaian</h3>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div class="col-12">
                <div class="datagrid-item">
                  <div class="datagrid-title">Tanggal Masuk</div>
                  <div class="datagrid-content">
                    {{ formatDate(pegawai.tanggal_masuk) }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Jabatan</div>
                  <div class="datagrid-content">
                    {{ pegawai.jabatan || "-" }}
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Departemen</div>
                  <div class="datagrid-content">
                    {{ pegawai.departemen || "-" }}
                  </div>
                </div>
              </div>

              <!-- SEKARANG SUDAH DIPERBAIKI MENJADI TAMPILAN DATA TEKS (BUKAN INPUT FORM) -->
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Jenis Kelamin</div>
                  <div class="datagrid-content">
                    {{ pegawai.jenis_kelamin || "-" }}
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Jarak Rumah-Kantor</div>
                  <div class="datagrid-content">
                    {{ pegawai.jarak_rumah_kantor || "-" }} km
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="datagrid-item">
                  <div class="datagrid-title">Status</div>
                  <div class="datagrid-content">
                    {{ pegawai.status || "-" }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer d-flex">
            <div class="d-flex gap-2 ms-auto">
              <button class="btn btn-primary" @click="downloadPDF">
                Download PDF
              </button>
              <button class="btn btn-outline-primary" @click="goBack()">
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
definePageMeta({ title: "Detail Pegawai", middleware: "auth" });
useSeoMeta({ title: "Detail Pegawai" });
const { get } = useApi();
const { goBack } = useGoBack();
const route = useRoute();

const pegawai = ref(null);
const loading = ref(true);

const fotoUrl = computed(() => {
  if (!pegawai.value?.foto_pegawai) return "/favicon.png";
  return `/images/pegawai/${pegawai.value.foto_pegawai}`;
});

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function downloadPDF() {
  window.open(`/api/export/pegawai/${route.params.id}.pdf`, "_blank");
}

onMounted(async () => {
  try {
    const res = await get(`/pegawai/${route.params.id}`);
    pegawai.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.foto-ptofil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>