<template>
  <PegawaiForm />
</template>

<script setup>
definePageMeta({ title: "Tambah Pegawai", middleware: "auth" })
useSeoMeta({ title: "Tambah Pegawai" })
import PegawaiForm from "~/features/DataPegawai/components/PegawaiForm.vue"
</script>
