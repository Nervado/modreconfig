const optmz =  require('./otimizacao')

'use strict'

let rgs = [ 32, 40, 42, 96, 97, 100, 101, 104, 105, 224, 274, 275, 316, 317, 320, 321 ]
//let rgs = [32, 40, 42, 96, 97, 100,1000]

//let optm = optmz.getOptimConfig(rgs,1000); 

///console.log(optm)



/**
 * @author: Evandro
 * 
 * Modificar 
 * 
 * 
 */

function calculaConfiguracao( config ){
    let possibleConfig = []    
    let NMAX = config[0]   
    let RandQtd = 0
    if (config.length == 1) {return config}    
    if (config.length > 1){        
        config.forEach( (el,indice) => {
            //possibleConfig.push(getRandom(e))
            RandQtd = getRandom(NMAX)
            console.log('NMAX:',NMAX,'Sorteio',RandQtd)
            //modificacao para ultima iteracao 
            if(indice === config.length - 1) RandQtd = NMAX                      
            possibleConfig.push(RandQtd)
            NMAX = (NMAX - RandQtd) + 1
            console.log('Atual NMAX:',NMAX)
        });
        
        return possibleConfig;
    }         
}

let config = [9,0,0,0]

//console.log(calculaConfiguracao(config))




/* let seterConfig =  optm.config
let custo = optm.custo
let iniReq = []
let finReq = []
let sizeReq = []  
let accQtdRegs = 0   

let isSetd = false
if (seterConfig.length == 1 && isSetd == false){
    iniReq.push(rgs[0])
    sizeReq.push(seterConfig[0])
    finReq.push(rgs[0])
    isSetd = true
}

if (seterConfig.length == rgs.length && isSetd == false){
    rgs.forEach(el => {
        iniReq.push(el)
        sizeReq.push(1)
        finReq.push(el+1)
    })
    isSetd = true
}

if (isSetd == false){
    seterConfig.forEach(qtdRgs =>{            
        if(qtdRgs === 1){
            accQtdRegs += qtdRgs 
            iniReq.push(rgs[accQtdRegs-1])
            sizeReq.push(1)            
            finReq.push(rgs[accQtdRegs-1] + 1)
        }   
        if(qtdRgs > 1){
            sliceRegs = rgs.slice(accQtdRegs, accQtdRegs + qtdRgs)                               
            diff = sliceRegs[sliceRegs.length - 1] - sliceRegs[0] + 1
            accQtdRegs += qtdRgs
            iniReq.push(sliceRegs[0])
            sizeReq.push(diff)
            finReq.push(sliceRegs[0] + diff)            
        }
    })
}
console.log(iniReq,sizeReq,finReq,rgs,seterConfig,custo) */

//modificao para nao viciar sorteios

function getRandomWith0(max) {
    //sleep(1000)
    return Math.floor(Math.random() * max)    
}

function changeIndexOfArrayElements(array,i,j){
    let copia  = array
    let changingValue = copia[i]
    copia[i] = copia[j]
    copia[j] = changingValue
    return copia
}


function randonChangeIndexs(array){
    let newarray = []
    array.forEach(el=>{
        newarray.push(el)
    })
    //console.log(newarray)
    let i = getRandomWith0(newarray.length)
    let j = getRandomWith0(newarray.length)
    //console.log(i,j)
    return changeIndexOfArrayElements(newarray,j,i)
}

function randomizeAllIndexs(array){
    let randomized = []
    let numberOfLottery = 0
    if( array.length === 1) {
       return  array
    } 
    else {
       numberOfLottery = array.length - 1 
       while (numberOfLottery > 0){
            randomized =  randonChangeIndexs(array)
            numberOfLottery--
            console.log(randomized,numberOfLottery)
       } 
       return randomized
    }

    
}

//fim da modificacao

let array  = [1,4,6,12,14,56,78]
let array2 = []

console.log(randomizeAllIndexs(array))

