ALTER TABLE pegawai
  ADD COLUMN `jenis_kontrak` enum('PKWT','PKWTT','Magang') DEFAULT 'PKWTT' AFTER `status`;

UPDATE pegawai SET jenis_kontrak = 'PKWTT' WHERE jenis_kontrak IS NULL;
