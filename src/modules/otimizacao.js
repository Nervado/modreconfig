/**
 * @author Evandro Abreu 
 * To..Do... modificar funcao de geracao de novas configuracoes para incorporar restricoes
 */
//Teste de funcao para otimizacao de rede


exports.getOptimConfig = function(rgs,iteracoes = 10000){
    let rgs_ = rgs
    //let iteracoes = 1000
    let vetor = rgs
    let i = 1
    let custo = Infinity
    let oldCusto = Infinity
    let optimConfig = []
    let tmp = {}

    rgs_.forEach( () => {
        //console.log(vetor)
        tmp = lookForBestConfigAtXnReqs(vetor,i,iteracoes)
        custo = tmp.custo
        if(custo < oldCusto){
            optimConfig = tmp.config
            oldCusto = custo
        }
        i++
    })       

    //
    
    let iniReq = []
    let finReq = []
    let sizeReq = []  
    let accQtdRegs = 0    
    let isSetd = false

    if (optimConfig.length === 1 && isSetd == false){
        iniReq.push(rgs_[0])
        sizeReq.push(rgs_[rgs_.length - 1] - rgs_[0] + 1)
        finReq.push(rgs_[rgs_.length - 1])
        isSetd = true
        //console.log('problema caso 1')
    }
    
    if (optimConfig.length === rgs_.length && isSetd == false){
        rgs_.forEach(el => {
            iniReq.push(el)
            sizeReq.push(1)
            finReq.push(el+1)
        })
        isSetd = true
        //console.log('problema caso 2')
    }
    
    if (isSetd == false){
        //console.log('problema caso 3')
        optimConfig.forEach(qtdRgs =>{            
            if(qtdRgs === 1){
                accQtdRegs += qtdRgs 
                iniReq.push(rgs_[accQtdRegs-1])
                sizeReq.push(1)            
                finReq.push(rgs_[accQtdRegs-1] + 1)
            }   
            if(qtdRgs > 1){
                sliceRegs = rgs_.slice(accQtdRegs, accQtdRegs + qtdRgs)                               
                diff = sliceRegs[sliceRegs.length - 1] - sliceRegs[0] + 1
                accQtdRegs += qtdRgs
                iniReq.push(sliceRegs[0])
                sizeReq.push(diff)
                finReq.push(sliceRegs[0] + diff)            
            }
        })
    }

    //console.log(iniReq,sizeReq,finReq,rgs,optimConfig,oldCusto)

    //return {custo: oldCusto, config: optimConfig}
    //console.log(finReq)
    return {iniReq: iniReq,finReq: finReq, sizeOtm: sizeReq,timeReq:oldCusto}
}

function lookForBestConfigAtXnReqs(rgs,numReqs, iteracoes = 10000){
    //console.log('minha config',finalCost([ 32, 40, 42, 96, 97, 100, 1000 ],[1,2,2,1,1]))

function configuracoesPossiveis(quantidaderegistradores, quantidadederequisicoes){
    let config = []
    for (let i = 0; i< quantidadederequisicoes; i++){
        config.push(quantidaderegistradores - quantidadederequisicoes + 1)
    }
    return config
}

//Modificacao para melhorar a geracao de configuracoes validas
//modificao para nao viciar sorteios em teste....######

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
            //console.log(randomized,numberOfLottery)
       } 
       return randomized
    }

    
}

//fim da modificacao


//fim da modificacao


/**
 * @author: Evandro Abreu
 * @param: Modificar para refletir restricoes de configuracoes possiveis 
 * 
 */
function calculaConfiguracao( config ){
    let NMAX = config[0]   
    let RandQtd = 0
    let possibleConfig = []
    if (config.length == 1) {return config}
    //restricoes  [ x y z k], 10 R, N regs - numero de locus + 1, sortei x, N regs - numero de locus + 1 -x
    //exemplo       
    if (config.length > 1){
        config.forEach( (e , indice) => {
            //possibleConfig.push(getRandom(e))
            RandQtd = getRandom(NMAX)
            //console.log('NMAX:',NMAX,'Sorteio',RandQtd)
            if(indice === config.length - 1) RandQtd = NMAX
            possibleConfig.push(RandQtd)
            NMAX = (NMAX - RandQtd) + 1
        });
        //console.log(possibleConfig)
        possibleConfig = randomizeAllIndexs(possibleConfig)
        //console.log(possibleConfig)
        return possibleConfig;
    }         
}

function getRandom(max) {
    //sleep(1000)
    return Math.floor(Math.random() * max + 1)
    
}

function checkConfig (rgs,possibleConfig) {
    let acc = 0
    //console.log(possibleConfig)
    possibleConfig.forEach(e => {acc = acc + e })
    return acc
}

let numRegs = rgs.length
let config = configuracoesPossiveis(numRegs,numReqs)
let possibleConfig = calculaConfiguracao(config)
let checkResult = 0; 
let validConfig = [];

for(let i=0;i<iteracoes ;i++){
    //sleep(10)
    possibleConfig = calculaConfiguracao(config)
    checkResult = checkConfig(rgs,possibleConfig) 
    if (checkResult === numRegs) {
        //console.log(possibleConfig) //comentar ao final do dubug
        validConfig.push(possibleConfig)
    }
}

function isEquals(a,b){
      
    let isEquals = true    
    
    for(let i = 0;i<a.length;i++){
        //console.log(a[i],b[i])
        if(a[i] !== b[i]) isEquals = false      
    }      
    
    //console.log(isEquals)
    return isEquals
}

let finalValidConfigArrays = []

let validConfig_ = validConfig

while(validConfig_.length > 0){
   
    let elementInSearch = validConfig_[0]

    validConfig_.shift()
    //console.log(validConfig_.length)

    let found = false
    validConfig_.forEach( elementFound =>{
        //console.log(elementFound,elementInSearch,isEquals(elementFound,elementInSearch))
        if (isEquals(elementFound,elementInSearch)) found = true 
    })

    if (found === false) finalValidConfigArrays.push(elementInSearch) 
}

//nova funcao de calculo de custo de transacao modbus

function totalTransTime(qtdRegs){
    let byte = 8 //bits
    let rateTransm = 38400 //baud
    let sinalizacaoInicioFim = 3.5 * byte  
    let slvCode = byte
    let funCode = byte
    let regAddr = 2 * byte
    let regQtd  = 2 * byte 
    let crcSize = 2 * byte
    let requestTime  = (sinalizacaoInicioFim + slvCode + funCode + regAddr + regQtd + crcSize + sinalizacaoInicioFim)/rateTransm
    let responseTime = (sinalizacaoInicioFim + slvCode + funCode + qtdRegs*regQtd + crcSize + sinalizacaoInicioFim)/rateTransm
    let totalTransTime = requestTime + responseTime
    return totalTransTime*1000
}

//console.log(requestTime*1000, responseTime*1000,totalTransTime*1000) //ms

//console.log(finalValidConfigArrays)

//Dado um Array de registradores e uma configuracao valida, calcular o custo de transmissao em ms

function finalCost(rgs,configDistribuition){
    //console.log(rgs)
    let diff = 0
    let finalCost = 0
    let sliceRegs = []
    let accQtdRegs = 0;
    if(rgs.length === configDistribuition.length ){
        diff = 1
        finalCost = configDistribuition.length * totalTransTime(diff)
        //console.log(rgs,configDistribuition,totalTransTime(diff),diff,finalCost)
    }
    
    if(rgs.length > configDistribuition.length){
        configDistribuition.forEach(qtdRgs =>{
            
            if(qtdRgs === 1){
                accQtdRegs += qtdRgs 
                finalCost += totalTransTime(1)
                //console.log('qtdRgs',qtdRgs,'accQtdRegs:',accQtdRegs,'configDistr:',configDistribuition,'CustoAcc:',finalCost)
            } //slice(1,4) extrai do segundo até o quarto elemento (elementos de índice 1, 2 e 3).
            if(qtdRgs > 1){
                sliceRegs = rgs.slice(accQtdRegs, accQtdRegs + qtdRgs)                               
                diff = sliceRegs[sliceRegs.length - 1] - sliceRegs[0] + 1
                //console.log('Slice:',sliceRegs,'diff:',diff) 
                accQtdRegs += qtdRgs
                finalCost += totalTransTime(diff)
                //console.log('qtdRgs',qtdRgs,'accQtdRegs:',accQtdRegs,'configDistr:',configDistribuition,'CustoAcc:',finalCost)
               // console.log(rgs,configDistribuition,totalTransTime(diff),diff)
            }
        })
    }

    return finalCost
}

let oldLowerCost = Infinity
let newLowerCost = 0
let newBestConfig = []

finalValidConfigArrays.forEach(config =>{
    newLowerCost = finalCost(rgs,config)
    if(newLowerCost  < oldLowerCost ) {
        oldLowerCost = newLowerCost
        newBestConfig = config   
        //console.log(config)
    }     
})


//for debug
//console.log(newBestConfig,oldLowerCost,finalValidConfigArrays,finalValidConfigArrays.length)
//to do... retornar vetores iniReq, fin Req e SizeReq.....

    return {config : newBestConfig, custo: oldLowerCost}

}