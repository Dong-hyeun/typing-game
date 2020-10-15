window.onload = (event) => {
    let history = [];
    let textList = [
       "document.querySelector",
       "setInterval",
       "setTimeout",
       "document.body.setAttribute",
       "Math.floor",
       "innerHTML",
       "string",
       "let a = 12",
       "textContent",
       "position",
       "display: flex",
       "require",
       "window.innerHeight",
       "sort",
       "appendChild",
       "forEach",
    ];
    let showText;
    let input;
    let ctx;
    let count;
    let idx;
 
    //------------
    function timers() {
       let time = 3600;
       let min = "";
 
       let showTime = document.querySelector('#tCt');
       let times = setInterval(function () {
          min = Math.floor(Number(time / 60));
 
          showTime.innerText = `${min}`;
          let mins = (min <= 5);
          showTime.style.color = mins ? 'red' : '';
          time--
          if (time < 0) {
             clearInterval(times);
             showTime.innerText = '시간 초과';
             게임종료()
          }
       }, 20);
 
    }
 
 
    (function 초기화() {
       showText = document.querySelector('#show-text');
       showText.addEventListener('selectstart', (event) => {
          event.preventDefault(); 
       }); // 드래그 방지
       input = document.querySelector('#input-typing');
       ctx = document.querySelector('.ctx');
       count = 0;
       timers()
       무작위다음단계로넘기();
    } ()); 
 
 
    function 무작위다음단계로넘기() {
       if (textList.length > history.length) {
          while (true) {
             idx = Math.round(Math.random() * (textList.length - 1));
             if (!history.includes(idx)) {
                break;
             } else {
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
       ctx.textContent = count; // 맞힌 갯수 표시
    }
    function 맞춘갯수가전체목록수보다작은가() {
       return count < textList.length - 1;
    }
    function 입력한것같은지확인() {
       return showText.textContent === input.value;
    }
    function 게임끝나면텍스트보이기(input) {
       showText.innerHTML = `
            <h1>GAME OVER</h1>
            <span class="esc-txt">다시 하려면 클릭해주세요!</span>`;
       showText.style.cursor = 'pointer';
       showText.style.position = 'absolute';
       showText.style.top = '50%';
       showText.style.left = '50%';
       showText.style.transform = 'translate(-50%, -50%)';
       showText.style.color = 'red';
       input.value = '';
       input.disabled = true;
 
       showText.addEventListener('click', () => {
          window.location.reload(true);
       });
 
    }
    function 게임종료() {
       게임끝나면텍스트보이기(input)
    }
    function 틀렸을때() {
       console.log('다시 해봐!!');
    }
    function 앱의메인로직() {
       input.addEventListener('keyup', (e) => {
          let 엔터를눌렀는가 = (e.keyCode === 13);
          let 타이핑값이같은가 = textList[idx].indexOf(input.value) === 0
          if (타이핑값이같은가) {
             let str = `<strong id='st'>${input.value}</strong>${textList[idx].substring(input.value.length, textList[idx].length)}`;
             showText.innerHTML = str;
          } else {
             showText.textContent = textList[idx];
          }
          if (!엔터를눌렀는가) { return; }
          if (!입력박스가비어있지않는가()) { return; }
          if (맞춘갯수가전체목록수보다작은가()) {
             if (입력한것같은지확인()) {
                무작위다음단계로넘기();
                맞힌갯수에숫자올리기();
             } else {
                틀렸을때();
             }
          } else {
             게임종료();
          }
          input.value = '';
       });
    }
 
 
    // 초기화();
    앱의메인로직();
 };
