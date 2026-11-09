const formSiswa = document.getElementById("form-siswa");
const dataSiswa = document.getElementById("data-siswa");
const penyimpananSiswa = "dataSiswa";

let daftarSiswa = [];

try {
  const dataTersimpan = localStorage.getItem(penyimpananSiswa);
  daftarSiswa = dataTersimpan ? JSON.parse(dataTersimpan) : [];

  if (!Array.isArray(daftarSiswa)) {
    throw new Error("Format data siswa tersimpan tidak valid.");
  }
} catch (error) {
  console.error("Gagal membaca data siswa dari penyimpanan browser:", error);
  alert("Data siswa tersimpan tidak dapat dibaca. Silakan periksa penyimpanan browser.");
}

function simpanDataSiswa() {
  try {
    localStorage.setItem(penyimpananSiswa, JSON.stringify(daftarSiswa));
    return true;
  } catch (error) {
    console.error("Gagal menyimpan data siswa:", error);
    alert("Data tidak dapat disimpan di browser ini.");
    return false;
  }
}

function tampilkanDataSiswa() {
  dataSiswa.replaceChildren();

  if (daftarSiswa.length === 0) {
    const barisKosong = document.createElement("tr");
    const selKosong = document.createElement("td");
    selKosong.colSpan = 8;
    selKosong.className = "empty-state";
    selKosong.textContent = "Belum ada data siswa.";
    barisKosong.append(selKosong);
    dataSiswa.append(barisKosong);
    return;
  }

  daftarSiswa.forEach((siswa, index) => {
    const baris = document.createElement("tr");
    const nilaiSiswa = [
      index + 1,
      siswa.nis,
      siswa.nama,
      siswa.kelas,
      siswa.jenisKelamin,
      siswa.agama,
      siswa.alamat,
    ];

    nilaiSiswa.forEach((nilai, kolomIndex) => {
      const sel = document.createElement("td");

      if (kolomIndex === 1) {
        const badge = document.createElement("span");
        badge.className = "badge-nis";
        badge.textContent = nilai;
        sel.append(badge);
      } else {
        sel.textContent = nilai;
      }

      baris.append(sel);
    });

    const selAksi = document.createElement("td");
    const tombolHapus = document.createElement("button");
    tombolHapus.type = "button";
    tombolHapus.className = "btn-hapus";
    tombolHapus.textContent = "Hapus";
    tombolHapus.dataset.index = index;
    selAksi.append(tombolHapus);
    baris.append(selAksi);
    dataSiswa.append(baris);
  });
}

formSiswa.addEventListener("submit", (event) => {
  event.preventDefault();

  const siswaBaru = {
    nis: document.getElementById("nis").value.trim(),
    nama: document.getElementById("nama").value.trim(),
    kelas: document.getElementById("kelas").value.trim(),
    jenisKelamin: document.querySelector('input[name="jenis-kelamin"]:checked').value,
    agama: document.getElementById("agama").value.trim(),
    alamat: document.getElementById("alamat").value.trim(),
  };

  daftarSiswa.push(siswaBaru);
  if (!simpanDataSiswa()) {
    daftarSiswa.pop();
    return;
  }

  tampilkanDataSiswa();
  formSiswa.reset();
  document.getElementById("nis").focus();
});

dataSiswa.addEventListener("click", (event) => {
  const tombolHapus = event.target.closest(".btn-hapus");
  if (!tombolHapus) return;

  const index = Number(tombolHapus.dataset.index);
  const siswaDihapus = daftarSiswa.splice(index, 1)[0];
  if (!simpanDataSiswa()) {
    daftarSiswa.splice(index, 0, siswaDihapus);
    return;
  }

  tampilkanDataSiswa();
});

tampilkanDataSiswa();
