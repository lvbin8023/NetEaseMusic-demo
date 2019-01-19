$(function () {
  let urlLocation = window.location.search;
  let urlId = parseInt(urlLocation.match(/\bid=([^&]*)/)[1]);

  $.get('../song.json').then(function (response) {
    //歌曲
    let songs = response;
    let song = songs.filter((s) => {
      return s.id === urlId;
    })[0];
    let {url,name,singer,lyric} = song;

    //初始化歌曲播放和歌词文本
    initPlayer.call(undefined,url);
    initText(name,singer,lyric);

    //歌曲播放
    function initPlayer(url) {
      let audio = document.createElement('audio');
      audio.src = url;
      audio.oncanplay = function () {
        audio.play();
        $('.disc-container').addClass('playing');
      };

      $('.icon-pause').on('click', function () {
        audio.pause();
        $('.disc-container').removeClass('playing');
      });

      $('.icon-play').on('click', function () {
        audio.play();
        $('.disc-container').addClass('playing');
      });
    }

    //歌名和歌词渲染
    function initText(name, singer, lyric) {
      $('.songName').text(`${name} - ${singer}`);
      parseLyric.call(undefined,lyric);
    }

    //获取歌词
    function parseLyric(lyric) {
      let array = lyric.split('\n');
      let regex = /^\[(.+)\](.*)/;
      array = array.map(function (string) {
        let matchs = string.match(regex);
        if (matchs) {
          return {
            time: matchs[1],
            words: matchs[2]
          };
        }
      });
      let $lyric = $('.lyric');
      array.map(function (object) {
        if (!object) {
          return false;
        }
        let $p = $('<p/>');
        $p.attr('data-time', object.time).text(object.words);
        $p.appendTo($lyric.children('.lines'));
      });
    }
  });
});