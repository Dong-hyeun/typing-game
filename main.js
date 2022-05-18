window.onload = _ => {
  let history = [];
  let am;
  let textList;
  let showText;
  let input;
  let count;
  let idx;
  let showTime;
  let times;
  let timers;
  let initMin;
  let min;
  let incMsg;
  let isOk;
  //-->

  function 타이머() {
    let setTime = 3600;
    let time = setTime;

    showTime = document.querySelector('#innerNum');

    times = setInterval(function () {
      min = Math.floor(Number(time / 60));

      if (time === setTime) {
        initMin = min;
      }

      if (min < 0) {
        clearInterval(times);
        showTime.innerHTML = '시간 초과';
        showTime.style.fontSize = '18px';
        incMsg.classList.add('hidden');
        게임결과에따른텍스트보이기(input);
      } else {
        const mins = min <= 5;
        // mins 변수는 여기서만 사용하므로 지역변수로 선언
        showTime.innerText = `${min}`;
        showTime.style.color = mins ? 'red' : '';
      }
      time--;
    }, 20);
  }

  function 초기화() {
    input = document.querySelector('#input-typing');
    score = document.querySelector('.ctx>.innerNum');
    incMsg = document.querySelector('.inc-msg');
    showText = document.querySelector('#show-text');
    timers = document.querySelector('.timers');

    showText.addEventListener('selectstart', event => {
      // 드래그 방지
      event.preventDefault();
    });

    count = 0;
    isOk = false;
    input.focus();
    showText.textContent = textList[idx];

    타이머();
    앱의메인로직();
    무작위다음단계로넘기();
  }

  function 무작위다음단계로넘기() {
    incMsg.classList.add('hiddren');
    if (textList.length > history.length) {
      while (true) {
        idx = Math.round(Math.random() * (textList.length - 1)); //무작위 인덱스 추출
        if (!history.includes(idx)) {
          break;
        }
      }
      history.push(idx);
      showText.textContent = textList[idx];
    }
  }
  function 입력박스가비어있지않는가() {
    return input.value !== '';
  }
  function 맞힌갯수에숫자올리기() {
    count++;
    score.textContent = count;
  }
  function 맞춘갯수가전체목록수보다작은가() {
    console.log(count, count < textList.length - 1);
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
  function 게임결과에따른텍스트보이기(input) {
    showText.style.top = '38%';
    showText.style.left = '50%';

    showText.innerHTML = `
    <h1 class="esc-tit">${
      isOk
        ? `축하합니다<br>성공했어요!!<br><span class="end-showText">걸린시간은 ${
            initMin - min
          }분이에요.</span>`
        : `아쉽네요😅<br>시간 초과되었어요!<br> 총 ${count} 개 입력했어요 ~ !`
    }</h1>
    <span class="esc-txt">다시 하려면 클릭해주세요!</span>
    `;

    showText.style.cursor = 'pointer';
    showText.style.position = 'absolute';
    //  showText.style.top = '50%';
    //  showText.style.left = '50%';
    showText.style.transform = 'translate(-50%, -50%)';
    showText.style.color = `${isOk ? 'green' : 'red'}`;

    isOk && timers.classList.add('success-end');

    input.disabled = true; // input 비활성화
    input.value = ''; //input 값 초기화

    showText.addEventListener('click', () => {
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
        let str = `<strong id='st'>${input.value}</strong>${textList[
          idx
        ].substring(input.value.length, textList[idx].length)}`;
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
          맞힌갯수에숫자올리기();
          무작위다음단계로넘기();
        }
      } else {
        isOk = true;
        맞힌갯수에숫자올리기();
        clearInterval(times);
        게임결과에따른텍스트보이기(input);
      }
      input.value = '';
      console.log('isOk?', isOk);
    });
  }

  // 게임 음원 불러오기
  $.get('./data/audio.json', audio_data => {
    am = new AudioManager(audio_data, function (err) {
      if (err) {
        console.error('다음 건들에 대해서 로드 실패');
      }
      console.log('모든 음원리소스 로드 완료');
      폰트로드하고초기화();

      // 폰트 및 list.json 데이터를 성공적으로 불러온 상태
      // 여기부터 초기화 함수등을 실행 -->

      // container 요소 보이기
      let startNav = document.querySelector('#typing-start');
      const container = document.querySelector('#container');
      container.style.opacity = 1;

      //타이핑 시작
      startNav.addEventListener('click', function (e) {
        console.log('타이핑 시작 -->');
        e.target.classList.add('hiddren');
        container.style.display = 'block';
        초기화();
      });
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
              let res = await fetch('./data/list.json'); //통신 >> 통신완료후 res === 통신의 결과,
              let rr = await res.json(); //통신된 결과로 json(), text() 이렇게 얻고 싶은 형태로 가져옴
              textList = rr.list;
            })();
          },
        );
      } catch (e) {
        console.error(`error message:${e.message}`);
        throw 'Fails to load fonts. It is sad.';
      }
    })();
  }
};

/* 
  - 함수를 통한 기능별로 정리해봄
  - 아쉬운점은 비슷한 기능끼리 묶다보니까 코드가 복잡해짐 
*/
