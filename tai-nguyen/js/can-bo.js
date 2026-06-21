function khoiTaoCanBo() {

    const dsNguoi = document.querySelectorAll('.nguoi');

    dsNguoi.forEach(item => {

        item.addEventListener('click', () => {

            dsNguoi.forEach(x =>
                x.classList.remove('active')
            );

            item.classList.add('active');

            document.getElementById('anhHienThi').src =
                item.dataset.anh;

            document.getElementById('tenHienThi').textContent =
                item.dataset.ten;

            document.getElementById('ghiChuHienThi').textContent =
                item.dataset.ghichu;
        });

    });

}