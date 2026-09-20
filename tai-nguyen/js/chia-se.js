document.getElementById('btnShare')?.addEventListener('click', async () => {
  const shareData = {
    title: document.title,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.log('Đã hủy chia sẻ');
    }
  } else {
    // Fallback: Tự động copy link nếu trình duyệt không hỗ trợ Web Share API
    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép liên kết bài viết vào bộ nhớ tạm!');
  }
});