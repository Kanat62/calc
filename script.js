const btns = document.querySelector('.calculator__btns')
const displayCalc = document.querySelector('.display__calculation')
const displayEqual = document.querySelector('.display__equals')

const operators = ['+', '-', '*', '/', '.']
let again = null

let sizeCalc = 37
let sizeEqual = 24
let count = 0
btns.onclick = e =>{
    const value = e.target.dataset.type

    if(value === undefined || value === '#')  return
    if(displayCalc.textContent === '0'){
        if(!operators.includes(value)) displayCalc.textContent = '' 
    }
    if(value === '=') { return equalAnimation(value) }
    if(again){
        displayCalc.style = ''
        displayEqual.style = ''
        displayCalc.innerText = ''
        displayEqual.innerText = ''
        again = false
    }
    if(value === 'clear'){ return clear() }
    if(value === 'delete') { return deleteLast(value) }
    if(operators.includes(value)){
        let str = displayCalc.innerText
        let lastStr = str[str.length - 1]
        if(operators.includes(lastStr) && value !== '.' && lastStr !== '.') {
            let replace = lastStr.replace(lastStr, value)
            let slice = str.slice(0, str.length - 1)
            return displayCalc.innerText = slice + replace
        }else if( lastStr === '.' && value === '.'){
            return
        }
    }
   
    displayCalc.textContent += value
    equal(value)

    if(displayCalc.offsetWidth > 310){
        count +=2
        displayCalc.style.fontSize = sizeCalc - count + "px"
    }
}

function clear() {
    displayCalc.innerText = '0'
    displayEqual.innerText = ''
    lastOperator = ''
    displayCalc.style.fontSize = sizeCalc + 'px'
}
function deleteLast(value) {
    const arr = displayCalc.textContent.split('')
    arr.pop()
    displayCalc.textContent = arr.join('')
    if(arr.length === 0) {displayCalc.textContent = '0'}
    lastOperator = ''
    equal(arr.pop())
}
function equalAnimation(elem) {
    if(displayCalc.innerText === ''){
        return displayCalc.innerText = '0'
    }
    displayCalc.style = `
        transition: 0.2s ease-in-out;
        height: 45px;
        font-size: 24px;
    `
    displayEqual.style = `
        transition: .2s ease-in-out;
        height: 64px;
        font-size: 37px;
    `
    again = true
}
function equal(value) {
    if(displayCalc.innerText.search(/[^0-9*/+-.]/mi) !== -1) return
    let str = displayCalc.innerText
    if(str === '0'){
        return displayEqual.innerText = ''
    }
    if(!operators.includes(value)){
        let result = eval(displayCalc.innerText)
        if(result.toString().includes('.')&&result.toString().length > 9){
             return deleteZero(result)
        }
        displayEqual.innerText = '=' + result
    }
    function deleteZero(num) {
        let arr = num.toFixed(9).split('').reverse()
        for(let i = 0; i < arr.length; i++){
            if(arr[i] === '0'){ delete arr[i] }
            else{ break }
           
        }
        return displayEqual.innerText = '=' + arr.reverse().join('')
    }
 
}


const percent = document.querySelector('.percent')
const inputAll = document.querySelectorAll('input[type="text"]')
let isActive = true

percent.onclick = function () {
    clicktoPercent()    
    percentAnimation()
}
function percentAnimation() {
    const displayWrapper = document.querySelector('.display__wrapper')
    const displayWrapper2 = document.querySelector('.display__wrapper.border')
    const blockNum = document.querySelector('.block-num')
    const blockPercent = document.querySelector('.block-percent')

    if(isActive){ 
        displayWrapper.style = 'display:none;'
        displayWrapper2.style = 'display:none;'
        blockNum.style = `animation: moveRight .5s ease-in-out forwards;`
        blockPercent.style = `animation: moveLeft .5s ease-in-out forwards;`
    
        document.querySelector('.display__wrapper div').textContent = '0'
        document.querySelector('.display__wrapper.border div').textContent = ''

        document.querySelector('.clear').onclick = ()=>{
            inputAll.forEach(item =>{
                item.value = ''
                document.querySelector('.general-percent').value = 100             
            })
        }    
        screenTap()
        return isActive = false
    }
    if(!isActive) {
        displayWrapper.style = 'display:flex;'
        displayWrapper2.style = 'display:flex;'
        blockNum.style = `animation:moveRightToLeft .5s ease-in-out forwards; `
        blockPercent.style = `animation: moveLeftToRight .5s ease-in-out forwards; `

        document.querySelector('.display__wrapper div').textContent = '0'
        document.querySelector('.display__wrapper.border div').textContent = ''
        return isActive = true
    }
}
function clicktoPercent() {
    const generalPercent = document.querySelector('.general-percent')
    generalPercent.value = '100'

    setTimeout(()=>{
        inputAll.forEach(item =>{
            if(item.classList.contains('general-percent')) return
            item.onkeypress = e =>{
                return true
            }
            item.value = ''
        })
    },500)

    calcingPercent()

    function calcingPercent(obj) {
        const equal = document.querySelector('.equal')
        equal.onclick = ()=>{
            const inputVal = {}
            let count = 0
            inputVal[2] = '100'
            inputAll.forEach((item, index) =>{
                if(item.value !== '') {
                    inputVal[index] = +item.value
                    count++
                }else{
                    inputVal[index] = item.value
                }
            })
            if(count !== 3) return     
            if(inputVal[0] === '' ){
                let answer0 = inputVal[1] * inputVal[2] / inputVal[3]
                calc(answer0, '.general-num')
            }
            if( inputVal[1] === '' ){
                let answer1 = inputVal[0] * inputVal[3] / inputVal[2]
                calc(answer1, '.part-num')
            }
            if( inputVal[2] === '' ){
                let answer2 = inputVal[0] * inputVal[3] / inputVal[1]
                calc(answer2, '.general-percent')
            }
            if(inputVal[3] === '' ){
                let answer3 = inputVal[1] * inputVal[2] / inputVal[0]
                calc(answer3, '.part-percent')
            }
            function calc(num, itemClass) {
                let str = num.toString()
                if(str.includes('.')){
                    let arr = num.toFixed(2).split('').reverse()
                    for(let i = 0; i < arr.length; i++){
                        if(arr[i] === '0'){ delete arr[i] }
                        else{ break }
                    }
                    arr = arr.reverse().join('')
                    if(arr[arr.length - 1] === '.'){
                        arr = arr.split('')
                        arr.pop()
                        return document.querySelector(itemClass).value = arr.join('')
                    }                   
                    return document.querySelector(itemClass).value = arr
                }else{
                    return document.querySelector(itemClass).value =  num
                }
            }
        } 
    }
}

function screenTap() {
    let input = null
    const percentBtn = document.querySelectorAll('.percent-btn')
   
    inputAll.forEach(item =>{

        item.oninput = function(e){
            this.value = this.value.replace(/[^0-9\.]/g, '')

            const pointIdex = this.value.indexOf('.')
            if(pointIdex !== -1){
                if(this.value[pointIdex + 1]) {
                    this.value = this.value.slice(0,pointIdex + 1) + this.value.slice(pointIdex + 1 ).replace('.','')
                }
            }
        }
        item.onclick = ()=>{
            input = item
        }
    })
   
    percentBtn.forEach(item =>{
        item.onclick = ()=>{
            const text = item.textContent
            if(input !== null){
                if(item.dataset.type === 'delete'){
                     const arr = input.value.split('')
                     arr.pop()
                     input.value = arr.join('')
                }
                input.value += text
                const pointIdex = input.value.indexOf('.')
                if(pointIdex !== -1){
                    if(input.value[pointIdex + 1]) {
                        input.value = input.value.slice(0,pointIdex + 1) + input.value.slice(pointIdex + 1 ).replace('.','')
                    }
                }
                inputFocus(input)
            }            
        }
        function inputFocus(input) {
            input.focus();
            let val = input.value;
            input.value = '';
            input.value = val;
        }
    })
} 
const imgOperator = document.querySelectorAll('.img-operator')
imgOperator.forEach(item => {
    item.ondragstart = (e) =>{
        e.preventDefault();
    }
})

root = document.documentElement;
window.addEventListener('resize', (e) => {
    if(window.innerWidth <= 400){
        root.style.setProperty('--change1', 275 + "px"); 
        root.style.setProperty('--change2', 210 + "px"); 
        root.style.setProperty('--change3', 275 + "px"); 
        root.style.setProperty('--change4', 210 + "px"); 
    }else{
        root.style.setProperty('--change1', 245 + "px"); 
        root.style.setProperty('--change2', 245 + "px"); 
        root.style.setProperty('--change3', 240 + "px"); 
        root.style.setProperty('--change4', 240 + "px"); 
    }
});
if(window.innerWidth <= 400){
    root.style.setProperty('--change1', 275 + "px"); 
    root.style.setProperty('--change2', 210 + "px"); 
    root.style.setProperty('--change3', 275 + "px"); 
    root.style.setProperty('--change4', 210 + "px"); 
}else{
    root.style.setProperty('--change1', 245 + "px"); 
    root.style.setProperty('--change2', 245 + "px"); 
    root.style.setProperty('--change3', 245 + "px"); 
    root.style.setProperty('--change4', 245 + "px"); 
}
// ===========================
const devName = document.querySelector('#hide-name')
devName.onclick = ()=>{
    document.querySelector('.dev-name').classList.toggle('active')
}