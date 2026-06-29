<template>
  <div>
    <div class="card mb-3">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4 col-lg-3">
            <label class="form-label">Nama Role</label>
            <input :value="roleData?.nama_role" type="text" class="form-control" readonly disabled />
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="table-responsive card-body p-0">
        <table class="table table-vcenter">
          <thead>
            <tr>
              <th width="5">No</th>
              <th>Modul/Fitur</th>
              <th class="text-center">Akses</th>
              <th class="text-center">Create</th>
              <th>Read</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="7" class="text-center py-4">Memuat data...</td></tr>
            <tr v-else-if="!roleData" colspan="7" class="text-center py-4">Role tidak ditemukan</tr>
            <tr v-for="(item, index) in roleData?.permissions || []" :key="item.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td>{{ item.modul_fitur }}</td>
              <td class="text-center">
                <IconCircleCheckFilled v-if="item.akses" class="text-green" />
                <IconXboxXFilled v-else class="text-red" />
              </td>
              <td class="text-center">
                <IconCircleCheckFilled v-if="item.create" class="text-green" />
                <IconXboxXFilled v-else class="text-red" />
              </td>
              <td>{{ item.read }}</td>
              <td>{{ item.update }}</td>
              <td>{{ item.delete }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ title: "Hak Akses", middleware: "auth" })
useSeoMeta({ title: "Hak Akses" })
import { IconCircleCheckFilled, IconXboxXFilled } from "@tabler/icons-vue"
const { get } = useApi()
const route = useRoute()

const roleData = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await get(`/role/${route.params.id}`)
    roleData.value = res.data
  } catch {} finally { loading.value = false }
})
</script>
