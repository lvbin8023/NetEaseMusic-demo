$(function () {
  $.get('http://plggyay5q.bkt.clouddn.com/song.json', function (response) {
    let items = response;
    items.forEach(item => {
      let $li = $(`<li>
        <a href="./song.html?id=${item.id}" target="_blank">
          <h3>${item.name}</h3>
          <p>
            <svg class="sq" aria-hidden="true">
              <use xlink:href="#icon-sq"></use>
            </svg>
            演唱者-${item.singer}</p>
          <svg class="play" aria-hidden="true">
            <use xlink:href="#icon-play-circled"></use>
          </svg>
        </a>
      </li>`);
      $('#latestMusic').append($li);
    });
    $('#loading').remove();
  });
});