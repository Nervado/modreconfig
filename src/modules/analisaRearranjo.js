remotas = require('./remotas')
let remotaPn03 = remotas.getRemota('RemotaPn02') 

//linhas de saidas discretas - copiado 

//

function getFatordeEscalaCorrente(tipo){
    const tipos = ['p122','p127','p225','p241','p243','p632']
    const escala_correntes = [100,100,100,1000,1000,0]
    let cont = 0;
    let indice = 0;
    tipos.forEach(function(element){
        if(tipo === element){
            indice = cont
        }
        cont += 1
    })
    return escala_correntes[indice]
}

//
function getFatorEscalaAnalogicas(tipo,medida){
    const matrix_escalas = [
        //I V P R F
        ['/100','','','',''],//p120-p123
        ['/100','/100','/10000000','/10000000',''],//p125-127
        ['/100','','','',''],//p225
        ['/1000','','/1000','/1000',''],//p241
        ['/1000','','/1000','/1000',''],//p243
        ['','','','','']//p632
    ]
    let indices = getReleIndice(tipo,medida)
    //console.log(indices)
    return matrix_escalas[indices.tipo][indices.medida]
}


//Retorna indice para acesso a DB de dados recebidos (leitura de words)
function getWordsIndex(rede, indice, reg = '0.0', bit = 0){
    let word = null//retorna o indice da word
    word = rede[indice].getRegPos(parseInt(reg.split('.')[0])) + getOffsetsRegs(rede,indice,reg.split('.')[0])    
    
    word *= 2
    //console.log(word)    
    //console.log(reg,word)
return word
}

//saida.byte = rede[indice].getRegPos(parseInt(reg.split('.')[0])) + getOffsetsRegs(rede,indice,reg.split('.')[0])

//
function getReleIndice(tipo,medida){
    const medidas = ['I','V','P','R','F']
    const tipos = ['p122','p127','p225','p241','p243','p632']
    const indices = {tipo: null, medida: null}
    for(i in medidas){
        if(medidas[i] === medida){
            indices.medida = i
        }
    }
    for(i in tipos){
        if(tipos[i]===tipo){
            indices.tipo = i
        }
    }
    return indices
}

//
function getFuncaoConvercao(tipo,medida){
    //console.log(tipo, medida)
    //let check = tipo != undefined ? true:false
    //if(check === true){
        const matrix_convercao = [
            //I V P R F
            ['DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DD','-','-','-','-'],//p120-p123
            ['DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DD','DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DD','DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DD','DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DD','WORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DW'],//p125-127
            ['DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DD','-','-','-','WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DD'],//p225
            ['DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DD','-','REAL_TO_DINT(DWORD_TO_REAL(WORD_TO_BLOCK_DB(INT_TO_WORD(-))-DINT_TO_WORD(-)-DD','REAL_TO_DINT(DWORD_TO_REAL(WORD_TO_BLOCK_DB(INT_TO_WORD(-))-DINT_TO_WORD(-)-DD','-'],//p241
            ['DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(-)-DINT_TO_WORD(-)-DD','-','REAL_TO_DINT(DWORD_TO_REAL(WORD_TO_BLOCK_DB(INT_TO_WORD(-))-DINT_TO_WORD(-)-DD','REAL_TO_DINT(DWORD_TO_REAL(WORD_TO_BLOCK_DB(INT_TO_WORD(-))-DINT_TO_WORD(-)-DD','-'],//p243
            ['-','-','-','-','-']//p632
    ]
    let indices = getReleIndice(tipo,medida)
        //console.log(indices)
    return matrix_convercao[indices.tipo][indices.medida].split('-')
    //}
    //else{return null}
}

//Retorna numero da DB associada aos registradores lidos de um relé
function getNumDb(rele, painel){
    let nomeDb = rele.dataSymblDbs
    for(let i in painel.dataSymblDbs){
        if(nomeDb === painel.dataSymblDbs[i]){
             numDb = painel.dataRecDbsNs[i]
        }
    }
    return numDb
}

//Retorna os offsets de registradores 
function getOffsetsRegs(rede,indice,reg){
    let offSetReg = 0
    let offSetRegs = []
    rede.forEach(function(rele){offSetRegs.push(rele.getNumberOfReg())})
    for(let i = 0; i < offSetRegs.length;i++){
        //console.log(offSetReg)
        if(i === indice){break}
        offSetReg += offSetRegs[i]
    }
    //console.log(offSetReg)
    //console.log(offSetRegs)
    return offSetReg
}

//Retorna indices para acesso a DB de dados recebidos (leitura de bits)
function getBitsIndex(rede, indice, reg = '0.0', bit = 0){
    //console.log(rede[indice].tag, reg, bit)
    saida = {byte: null, bit: null}
    saida.byte = rede[indice].getRegPos(parseInt(reg.split('.')[0])) + getOffsetsRegs(rede,indice,reg.split('.')[0])
    saida.bit = bit
    
    //alterar para o formato HB - LB = [Registrador] => R[15 14 13... 2 1 0] => [BYTE 0] [BYTE 1]=>[7 6 ... 0 1][ 7 6 ..0 1]
    //W
    //[0 1 2 3 4 5]

    if (saida.bit > 7) { //mapear para o HB 
        saida.bit -= 8
        saida.byte *= 2
    }else{//mapear para o LB
        saida.byte *= 2
        saida.byte += 1
    }   
    
    //if(saida.bit > 7){
    //    saida.byte *= 2
    //    saida.byte += 1 
    //    saida.bit -=8 
    //}else{
    //    saida.byte *= 2
    //}       
    //console.log(saida)
    return saida
}

//
function escreveDOs(q,end,comentario,nodb){
    //Definir posição da leitura dos bits registradores
    //Estrutura da FC
    //let comandos = ''
    //let nodb = 301
    let linha = ''
    //let comentario = 'Funcao de Bloqueio 86 Trafo TF-514001A'
    //Exemplo de linha de saída -- bits
    linha = `Q${q} := WORD_TO_BLOCK_DB(INT_TO_WORD(${nodb})).DX[${end.byte},${end.bit}]; //` + `${comentario}`
    //comandos+=linha
    //let fc = `    
     //FUNCTION FC33 : BOOL
       //    BEGIN //code section
           
         //   ${comandos};

     //END_FUNCTION   
    //`
    return linha    
}  

//

exports.setLinhasRearanjo = function setLinhasRearanjo(rede,numFC){
    //let check = false
    let comandos = '\n' 
    for(let i=0; i< rede.length;i++){
        if(rede[i].q.length > 0 ){
            for(let k= 0; k<rede[i].q.length; k++){
                if(numFC === rede[i].numeroDaFC[parseInt(rede[i].qi[k])]){
                    //console.log(getBitsIndex(rede, i, rede[i].registradores[rede[i].qi[k]] , rede[i].registradores[rede[i].qi[k]]))
                    comandos+='   '
                    comandos+=escreveDOs(rede[i].q[k],getBitsIndex(rede, i, rede[i].registradores[rede[i].qi[k]],rede[i].registradores[rede[i].qi[k]].split('.')[1]),
                    rede[i].qc[rede[i].qi[k]],getNumDb(rede[i],remotaPn03))
                    comandos+=` sinal: ${rede[i].comandos[rede[i].qi[k]]};`
                    comandos+='\n'
                    //console.log('chamada reaj: ',getWordsIndex(rede, i, '32.0'))
                }
            }
        }
    }
    comandos+='\n'
    
    //linhas de tensões 
    let s
    let medidas = ['V','V','V']
    for(let i=0; i< rede.length;i++){
        if( rede[i].qwv.length > 0 ){
           //console.log(rede[i].qwv.length)
            for(k = 0; k < rede[i].qwv.length; k++){
                if(numFC === rede[i].numeroDaFC[parseInt(rede[i].qiv[k])]){
                    
                    s = getFuncaoConvercao(rede[i].tipo,medidas[k])
                    //console.log('medida procurada:',medidas[k])
                    comandos+='\n   tmp'+ (k + 1) +' := ' + `DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(${getNumDb(rede[i],remotaPn03)})).DD[${getWordsIndex(rede, i, rede[i].registradores[rede[i].qiv[k]])}])`
                    +`${getFatorEscalaAnalogicas(rede[i].tipo,'V')};`
                    comandos+='\n   ' + `QW${rede[i].qwv[k]} := ${s[2]}tmp${k+1});//${rede[i].qcv[k]}, sinal: ${rede[i].comandos[rede[i].qiv[k]]}\n`
                    
                }
            }                 
        }
    }
    
    //linhas de médias de correntes para todos os relés
    medidas = ['I','I','I']
    for(let i=0; i < rede.length;i++){
        if(rede[i].qwi.length > 0 ){
            for(k=0;k < 3;k++){
                if(numFC === rede[i].numeroDaFC[parseInt(rede[i].qii[k])]){
                    s = getFuncaoConvercao(rede[i].tipo,medidas[k])
                    comandos+='\n   tmp'+(k+1)+' := ' + `DWORD_TO_DINT(WORD_TO_BLOCK_DB(INT_TO_WORD(${getNumDb(rede[i],remotaPn03)})).DD[${getWordsIndex(rede, i, rede[i].registradores[rede[i].qii[k]])}])`
                    +`/${getFatordeEscalaCorrente(rede[i].tipo)};`
                }         
            }
            comandos+='\n   '+`QW${rede[i].qwi} := DINT_TO_WORD((tmp1 + tmp2 + tmp3 )/3)`+';//' + `${rede[i].qci}`+'\n'
        }
    }
    
    //linhas de potencias 
    medidas = ['P','R','F']
    for(let i=0; i< rede.length;i++){
        if(rede[i].qwp.length > 0 ){
            for(k = 0; k < rede[i].qwp.length; k++){
                if(numFC === rede[i].numeroDaFC[parseInt(rede[i].qip[k])]){
                    s = getFuncaoConvercao(rede[i].tipo,medidas[k])
                    comandos+='\n   tmp'+ (k + 1) +' := ' + s[0]+`${getNumDb(rede[i],remotaPn03)})).${s[4]}[${getWordsIndex(rede, i, rede[i].registradores[rede[i].qip[k]])}]`+ s[1]
                    +`${getFatorEscalaAnalogicas(rede[i].tipo,'V')};`
                    comandos+=`\n   QW${rede[i].qwp[k]} := ${s[2]}tmp${k+1});//${rede[i].qcp[k]}\n`
                    
                }
            }                 
        }
    }          
        
            return comandos      
    
    }    
 
exports.getOffSetDbLocal = function(rede, indice, reg , bit){
    return getWordsIndex(rede, indice, reg, bit)
}