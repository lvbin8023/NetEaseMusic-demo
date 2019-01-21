$(function () {
  let urlLocation = window.location.search;
  let urlId = parseInt(urlLocation.match(/\bid=([^&]*)/)[1]);

  $.get('//plggyay5q.bkt.clouddn.com/song.json').then(function (response) {
    //歌曲
    let songs = response;
    let song = songs.filter((s) => {
      return s.id === urlId;
    })[0];
    let {
      url,
      name,
      singer,
      lyric
    } = song;

    //初始化歌曲播放和歌词文本
    initPlayer.call(undefined, url);
    initText(name, singer, lyric);

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

      //歌词滚动
      setInterval(() => {
        let seconds = audio.currentTime;
        let munites = ~~(seconds / 60);
        let left = seconds - munites * 60;
        let time = `${pad(munites)}:${pad(left)}`;
        let $lines = $('.lines>p');
        let $whichLine;
        for (let i = 0; i < $lines.length; i++) {
          let currentLineTime = $lines.eq(i).attr('data-time');
          let nextLineTime = $lines.eq(i + 1).attr('data-time');
          if ($lines[i + 1] != undefined && currentLineTime < time && nextLineTime > time) {
            $whichLine = $lines.eq(i);
          }
        }
        if ($whichLine) {
          $whichLine.addClass('active').prev().removeClass('active');
          let $top = $whichLine.offset().top;
          let $lineTop = $('.lines').offset().top;
          let $delta = $top - $lineTop - $('.lyric').height()/3;
          $('.lines').css('transform',`translateY(-${$delta}px)`);
        }
      }, 300);
    }

    //时间格式转换
    function pad(number) {
      return number < 10 ? '0' + number : '' + number;
    }

    //歌名和歌词渲染
    function initText(name, singer, lyric) {
      $('.songName').text(`${name} - ${singer}`);
      parseLyric.call(undefined, lyric);
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