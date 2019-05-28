const optmz =  require('./otimizacao')
//Função que retorna objeto rede com todos os dados do levantamento por CP

//tamanho de requisições 
function getSizeReqs(indice,map){
    let _map = map[indice]
    let sizeReqs = []
    let sizeMap = _map.length/2
    //console.log(sizeMap)
    //ToDo...
    for(let i = 0; i<sizeMap; i++){
        sizeReqs.push(_map[i+sizeMap] - _map[i]) 
    }
    //ToDo modificar para nova configuracao de saida, apos a funcao de otimizacao       
    return sizeReqs
}

//indice no array map
function getIndiceMap(tipo,tipos){
    let contador = 0
    let saida
    tipos.forEach(element => {
        if(element === tipo){saida = contador}
        contador++
    });
    return saida
}

//calcula tamanho otimo das requisições
function fitReqs(regs,vetorAssRegs,registradores){     
    //adiciona registradores dos analogicos, modificacao necessaria devido a nova otimizacao de rede em 18/01/2019
    let regs_ = []
    let p = 0
    registradores.forEach(re => {
        regs.forEach(reg => {
           // vetorAssRegs.forEach( assReg => {
                if (reg === parseInt(re.split('.')[0])){
                    
                    if (vetorAssRegs[p] === 1){
                            regs_.push(reg)               
                        }
                    if (vetorAssRegs[p] === 2){
                            regs_.push(reg)
                            regs_.push(reg+1)
                        }
                
                //console.log(regs_)
                    }  
           //})
        })
        p++
    })
   
    regs_ = selectRegs(regs_,0)   
    regs_ = agroupBits(regs_)    
    //o vetor regs_ contem as correcoes para o caso de ler analogicos 
    let teste = optmz.getOptimConfig(regs_,1000)    
    let faixas = {iniReq: teste.iniReq, finReq: teste.finReq, sizeOtm: teste.sizeOtm,timeReq:teste.timeReq}
    return faixas
}

//Ajuste do tamanho das requisições
function ajusteFaixasdeRequisicoes(registradores,vetorAssRegs){
    let sizeReqs = registradores
    
    //seleciona e ordena
    sizeReqs = selectRegs(sizeReqs)   
    
    //agrupa requisicoes dentro do mesmo registrador
    sizeReqs = agroupBits(sizeReqs)
    
    //otimiza rede
    sizeReqs = fitReqs(sizeReqs,vetorAssRegs,registradores)
    
    //retorna
    return sizeReqs
}

//seleciona e ordena os registradores a serem lidos
function selectRegs(regs, remove=2){
    let selection = regs.slice(remove).map(function(el){return parseInt(el)})
    selection.sort(function(a,b){
        return a-b
    })    
    return selection
}

//agrupar
function agroupBits(regs){       
    let grupos = regs.filter(function(elem, pos, self) {
        return self.indexOf(elem) == pos;
    })
    //console.log(grupos)
    return grupos
}

//Cria objetos relés
function Rele(tag, tipo, endereco, nReq, sizeReq){
    this.tag = tag //sugestão de nome: usar tag da carga 
    this.tipo = tipo //p122, p12x...etc
    this.endereco = endereco //variável visivel fora do objeto
    this.nReq = nReq,//número de requisições modbus
    this.sizeReq = sizeReq //= sizeReq,//número de registradores em cada requisição modbus
    this.tempoLeitura = 0 //in ms
    this.getNumbOfBits = () => {//método visível
        let total
        //soma a quantidade de registradores
        //console.log(sizeReq)
        total = this.sizeReq.reduce(function(anterior, atual){
            //console.log(atual)
            return parseInt(anterior) + parseInt(atual)
        })
        //console.log(total*16)
        return total*16
        //return 16*nReq*sizeReq
    }
    this.getNumberOfReg = () => {
        return parseInt(this.getNumbOfBits())/16
        //return nReq*sizeReq
    }
    this.getRegPos = (numReg) => {
        //ToDo...retonar a posição de um registrador, dado o endereço modbus - offset em numero de words/registradores de 16bits
        let pos = 0
        for(let  i in this.finRange){
            //console.log(pos)
            if((numReg < this.finRange[i] ) && (numReg >= this.iniRange[i] )){//atentar para os limites da faixa de acordo com a imp
                pos += numReg - this.iniRange[i]
                break
            }
            pos += this.finRange[i] - this.iniRange[i]
        }
        return pos
    }    
    this.iniRange
    this.finRange
    this.comentarios
    this.registradores
    this.comandos    
    this.numeroDaFC
    //saidas booleanas
    this.q  = []//saidas booleanas    
    this.qa = []
    this.qc = []
    this.qi = []
    //médias de correntes
    this.qwi = []
    this.qai = []
    this.qci = []
    this.qii = [] 
    //tensões
    this.qwv = []
    this.qav = []
    this.qcv = []
    this.qiv = []    
    //potencias e fator de potencia
    this.qwp = []
    this.qap = []
    this.qcp = []
    this.qip = []    
    //quantidade de registradores associados a leitura
    this.vetorAssRegs = []
    this.netWorkIsOptmzd = false
}

//cria estrutura da rede
exports.criaRede = function(parametros, tipos, dataSymblDbs){//(parametros,tags,adresses, relayTypes, tipos, map)
    let rede = []
    let releIndice
    //Mapa Modbus Genérico com as faixas de leitura por relés (registradores)
    let map = [
        [16, 33, 48, 24, 36, 54],//p122
        [16, 42, 48, 29, 43, 200],//p127
        [16, 42, 48, 29, 43, 54],//p225
        [5, 20, 30, 6, 29, 39],//p241
        [1, 20, 30, 8, 29, 39],//p243
        [7, 20, 30, 40, 10, 29, 39, 100]//p632
    ]
     
        for(let i in parametros.modbusAdress){
            releIndice = getIndiceMap(parametros.relaysFounds[i],tipos)
            nReq = 3
            sizeReq = getSizeReqs(releIndice,map)            
            rede.push(new Rele(parametros.tags[i], parametros.relaysFounds[i] , parametros.modbusAdress[i], nReq, sizeReq))            
            rede[i].comentarios = parametros.matrix_comentarios[i]
            rede[i].registradores = parametros.matrix_registradores[i]                        
            //identifica registradores para valores analogicos
            rede[i].registradores.forEach( reg => {
                let rg = reg.split('.')
                if(rg[1] > -1 & rg[1] < 15){
                    rede[i].vetorAssRegs.push(1)
                }else{
                    rede[i].vetorAssRegs.push(2)
                }  
            })            
            rede[i].comandos = parametros.matrix_comandos[i] 
            rede[i].dataSymblDbs = dataSymblDbs            
            let optmz = ajusteFaixasdeRequisicoes(rede[i].registradores,rede[i].vetorAssRegs)
            rede[i].iniRange = optmz.iniReq           
            rede[i].finRange = optmz.finReq           
            rede[i].sizeReq = optmz.sizeOtm   
            rede[i].nReq = rede[i].sizeReq.length
            rede[i].tempoLeitura = optmz.timeReq   
            rede[i].netWorkIsOptmzd = true           
            rede[i].numeroDaFC = parametros.matrix_numeroDaFC[i]         
            
        }
        return rede
}


/**
 * @author Evandro Abreu
 * 20-01-2019
 * 1. To...Do, DB 20X de configuracao deve ter a informacao de onde salvar os valores recebidos???
 * 2. Ajuste de iteracoes do metodo de escrita da DB de leituras modbus,
 * ...Testado em 20/01/2019 verificada a correta iteracao para geraco dos strucst dos codigos fontes dos dbs 201 de config.
 * 3. Testar posicionamento de registradores e bits com o método de escrita da function control de rearranjo, ta tudo certo!
 * ...Testado em 20/01/2019 feitos calculos manuais para os dois primeiros slaves da rede 1, CP1 do painel 01
 * 4. ...
 */