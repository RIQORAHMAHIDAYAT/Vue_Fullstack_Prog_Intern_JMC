<template>
  <PegawaiForm :id="id" />
</template>

<script setup>
definePageMeta({ title: "Edit Pegawai", middleware: "auth" })
useSeoMeta({ title: "Edit Pegawai" })
const route = useRoute()
const id = String(route.params.id)

import PegawaiForm from "~/features/DataPegawai/components/PegawaiForm.vue"
</script>
