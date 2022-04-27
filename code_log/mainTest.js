window.onload = _ => {
  let history = [];
  let textList;
  let showText;
  let input;
  let count;
  let idx;
  let am;
  let startNav;
  let times;
  let funcStartCount = 0;

  let incMsg;
  //------------

  function 타이머() {
    let time = 1600;
    let min = '';

    let showTime = document.querySelector('#innerNum');
    times = setInterval(function () {
      let mins;

      min = Math.floor(Number(time / 60));
      mins = min <=5;

      if (min < 0) {
        clearInterval(times);
        showTime.innerHTML = '시간 초과';
        showTime.style.fontSize = '18px';
        console.log('clear몇번');
        게임끝나면텍스트보이기(input);
      } else {
        showTime.innerText = `${min}`;
        showTime.style.color = mins ? 'red' : '';
      }

      time--;
    }, 20);
  }

  function 초기화() {
    console.log('초기화함수');
    incMsg = document.querySelector('.inc-msg');
    showText = document.querySelector('#show-text');
    showText.addEventListener('selectstart', event => {
      event.preventDefault();
    }); // 드래그 방지
    input = document.querySelector('#input-typing');
    score = document.querySelector('.ctx>.innerNum');
    count = 0;
    타이머();
    앱의메인로직();
    console.log('초기화함수idx', idx);
    showText.textContent = textList[idx];
    무작위다음단계로넘기();
  }

  function 무작위다음단계로넘기() {
    console.log('무작위함수실행');
    //무자위로 나오는 지 확인 필요
    incMsg.classList.add('hiddren');
    if (textList.length > history.length) {
      while (true) {
        idx = Math.round(Math.random() * (textList.length - 1)); //무작위 인덱스 추출
        if (!history.includes(idx)) {
          break;
        }
      }
      history.push(idx);
      console.log(history);
      showText.textContent = textList[idx];
    }
  }
  function 입력박스가비어있지않는가() {
    return input.value !== '';
  }
  function 맞힌갯수에숫자올리기() {
    ++count;
    score.textContent = count; // 맞힌 갯수 표시
  }
  function 맞춘갯수가전체목록수보다작은가() {
    console.log(count < textList.length - 1);
    return count < textList.length - 1;
  }
  function 텍스트색상표시(isCorrectText) {
    isCorrectText
      ? incMsg.classList.add('hidden')
      : incMsg.classList.remove('hidden');
  }
  function 입력한것같은지확인() {
    const isCheck = showText.textContent === input.value;
    텍스트색상표시(isCheck);
    return isCheck;
  }
  function 게임끝나면텍스트보이기(input) {
    console.log('실행', ++funcStartCount);
    const hd = document.createElement('h1');
    hd.id = 'gameOverMessege';
    const escText = document.createElement('span');
    escText.className = 'esc-text';
    showText.appendChild(hd);
    showText.appendChild(escText);
    showText.style.top = '38%';
    showText.style.left = '50%';
    showText.innerHTML = `
            <h1 id="gameOverMessege">GAME OVER</h1>
            <span class="esc-txt">다시 하려면 클릭해주세요!</span>`;
    showText.style.cursor = 'pointer';
    showText.style.position = 'absolute';
    //  showText.style.top = '50%';
    //  showText.style.left = '50%';
    showText.style.transform = 'translate(-50%, -50%)';
    showText.style.color = 'red';
    input.value = '';
    input.disabled = true;

    showText.addEventListener('click', () => {
      console.log('클릭');
      window.location.reload();
    });
  }
  function 앱의메인로직() {
    try {
      am.grant_permission(); // 최초1회실행
    } catch (err) {
      console.error(err);
    }

    input.addEventListener('keyup', e => {
      am.play('voic', {
        start: function (task) {
          // console.log('재생이 시작되었습니다');
        },
        end: function (task) {
          // console.log('재생이 종료되었습니다');
        },
      });

      let 엔터를눌렀는가 = e.keyCode === 13;
      let 타이핑값이같은가 = textList[idx].indexOf(input.value) === 0;
      if (타이핑값이같은가) {
        let str = `<strong id='st'>${input.value}</strong>${textList[idx].substring(input.value.length, textList[idx].length)}`;
        showText.innerHTML = str;
      } else {
        showText.textContent = textList[idx];
      }
      if (!엔터를눌렀는가) {
        return;
      }
      if (!입력박스가비어있지않는가()) {
        return;
      }
      if (맞춘갯수가전체목록수보다작은가()) {
        if (입력한것같은지확인()) {
          무작위다음단계로넘기();
          맞힌갯수에숫자올리기();
        }
      } else {
        console.log('게임종료');
        clearInterval(times)
        게임끝나면텍스트보이기(input);
      }
      input.value = '';
    });
  }

  // 게임 음원 불러오기
  $.get('./api/audio.json', audio_data => {
    am = new AudioManager(audio_data, function (err) {
      if (err) {
        console.error('다음 건들에 대해서 로드 실패');
      }
      console.log('모든 음원리소스 로드 완료');
      폰트로드하고초기화();
    });
  });

  function 폰트로드하고초기화() {
    (async () => {
      try {
        // font_loader will raise exception on even 1 thing fail. if not returns true
        await font_loader(
          [
            //폰트 리스트
            {
              name: 'NEXON Lv1 Gothic OTF Light',
              path: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON%20Lv1%20Gothic%20OTF%20Light.woff',
            },
            {
              name: 'GongGothicMedium',
              path: 'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10@bd5e3f271dde160c10fde61328f5ed320e45d490/GongGothicMedium.woff',
            },
          ],
          font_name => {
            console.log(font_name + ' loading complete');
            (async function () {
              let res = await fetch('./api/testingList.json'); // 텍스트용
              let rr = await res.json(); //통신된 결과로 json(), text() 이렇게 얻고 싶은 형태로 가져옴
              textList = rr.list;
              startNav = document.querySelector('#typing-start');

              document.querySelector('#container').style.opacity = 1;
              //list.json 데이터를 성공적으로 불러왔으면 container 요소 보이기

              //타이핑 시작
              startNav.addEventListener('click', function (e) {
                container.style.display = 'block';
                초기화();
              });
            })();
          }
        );
      } catch (e) {
        console.log(e);
        console.log('Fails to load fonts. It is sad.');
      }
    })();
  }
};
