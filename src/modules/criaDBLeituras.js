reaj = require('./analisaRearranjo')


//converte em hexa
function binarificar(nr,t){
    let conv
    //let str = nr.toString(2) //Binário
    let str = parseInt(nr).toString(16) //Hexadecimal ///modificado
    if(t === 'b' ){conv = '00'.slice(str.length) + str}
    if(t === 'w' ){conv = '0000'.slice(str.length) + str}
    return conv
}


exports.escreveDBLeituras = function escreveDBLeituras(rede,numDB){
    let dblocal = numDB - 98

    //linhas no formato do data block original
    let declaracoes = ''
    let inicializacoes = ''

    //linhas da DB config para novo bloco
    let declaracoes2 = ''
    let inicializacoes2 = ''

    //linhas da DB status para novo bloco
    let declaracoes3 = ''
    let inicializacoes3 = ''
    //calculos desnecessários...extrair dados do vetorRedes...
    //numero de slaves
    let no_slaves = 6
    let no_reqs =  4
    let maxreqs = no_slaves * no_reqs
    let iSalvo = 1
    
    //define novas declaracoes de escrita..1 por relé da rede
    for(let i = 0;i<rede.length;i++){
        
        //
        declaracoes2 += `
        config_req${iSalvo} : "modbus_config";`

        //
        declaracoes3 += `
        status_req${iSalvo} : "modbus_status";`

        //
        inicializacoes2 +=`                
        config_req${iSalvo}.endDoSlave := B#16#${binarificar(rede[i].endereco,'b')}; 
        config_req${iSalvo}.functionCode := B#16#${binarificar(6,'b')};  
        config_req${iSalvo}.enderecoInicial := W#16#${binarificar(parseInt(rede[i].registradores[0].split('.')),'w')}; 
        config_req${iSalvo}.numeroDeVariaveisLidas := W#16#0000; 
        config_req${iSalvo}.dbLocal := 1000; 
        config_req${iSalvo}.offsetLocal := 0; 
        config_req${iSalvo}.periodo := 1; 
        config_req${iSalvo}.controleAutomaticoDeTaxa := FALSE; 
        config_req${iSalvo}.spare_bit1 := FALSE; 
        config_req${iSalvo}.spare_bit2 := FALSE; 
        config_req${iSalvo}.spare_bit3 := FALSE; 
        config_req${iSalvo}.spare_bit4 := FALSE; 
        config_req${iSalvo}.spare_bit5 := FALSE; 
        config_req${iSalvo}.spare_bit6 := FALSE; 
        config_req${iSalvo}.spare_bit7 := FALSE; 
        config_req${iSalvo}.spare_byte := B#16#0;
        `
        //
        inicializacoes3 +=`
        status_req${iSalvo}.falhaDeComunicacao := FALSE; 
        status_req${iSalvo}.requisicaoLiberada := FALSE; 
        status_req${iSalvo}.requisicaoFeita := FALSE; 
        status_req${iSalvo}.bit_spare3 := FALSE; 
        status_req${iSalvo}.bit_spare4 := FALSE; 
        status_req${iSalvo}.bit_spare5 := FALSE; 
        status_req${iSalvo}.bit_spare6 := FALSE; 
        status_req${iSalvo}.bit_spare7 := FALSE; 
        status_req${iSalvo}.word_spare := W#16#0; 
        status_req${iSalvo}.sendStatus := W#16#0; 
        status_req${iSalvo}.rcvStatus := W#16#0; 
        status_req${iSalvo}.systatStatus := W#16#0; 
        status_req${iSalvo}.numDeFalhas := W#16#0; 
        status_req${iSalvo}.periodoCalculado := W#16#0;
        `
        //
        iSalvo++
    }        

    let offSetDbLocal = 0
    rede.forEach(function(rele,index){
        //console.log(index)
        let point = /./g
        let  tag = rele.tag.replace('.', '')
        tag = tag.replace('.','') 
        tag = tag.replace('.','')
        tag = tag.replace('-','_')
        tag = tag.replace('-','')
        
        //console.log(tag)
        let p = 1
        let linhasDeclacaracoes =``
        for(let i = 0; i<rele.sizeReq.length; i++){
            
            declaracoes2 += `
        config_req${iSalvo} : "modbus_config";`
            //
            inicializacoes2 +=`                
        config_req${iSalvo}.endDoSlave := B#16#${binarificar(rele.endereco,'b')}; 
        config_req${iSalvo}.functionCode := B#16#${binarificar(4,'b')}; 
        config_req${iSalvo}.enderecoInicial := W#16#${binarificar(rele.iniRange[i],'w')}; 
        config_req${iSalvo}.numeroDeVariaveisLidas := W#16#${binarificar(rele.sizeReq[i],'w')}; 
        config_req${iSalvo}.dbLocal := ${dblocal}; 
        config_req${iSalvo}.offsetLocal := ${offSetDbLocal*2}; 
        config_req${iSalvo}.periodo := 1; 
        config_req${iSalvo}.controleAutomaticoDeTaxa := FALSE; 
        config_req${iSalvo}.spare_bit1 := FALSE; 
        config_req${iSalvo}.spare_bit2 := FALSE; 
        config_req${iSalvo}.spare_bit3 := FALSE; 
        config_req${iSalvo}.spare_bit4 := FALSE; 
        config_req${iSalvo}.spare_bit5 := FALSE; 
        config_req${iSalvo}.spare_bit6 := FALSE; 
        config_req${iSalvo}.spare_bit7 := FALSE; 
        config_req${iSalvo}.spare_byte := B#16#0;
        `
        offSetDbLocal += rele.sizeReq[i]
        
        //
        declaracoes3 += `
        status_req${iSalvo} : "modbus_status";`
        
        //
        inicializacoes3 +=`
        status_req${iSalvo}.falhaDeComunicacao := FALSE; 
        status_req${iSalvo}.requisicaoLiberada := FALSE; 
        status_req${iSalvo}.requisicaoFeita := FALSE; 
        status_req${iSalvo}.bit_spare3 := FALSE; 
        status_req${iSalvo}.bit_spare4 := FALSE; 
        status_req${iSalvo}.bit_spare5 := FALSE; 
        status_req${iSalvo}.bit_spare6 := FALSE; 
        status_req${iSalvo}.bit_spare7 := FALSE; 
        status_req${iSalvo}.word_spare := W#16#0; 
        status_req${iSalvo}.sendStatus := W#16#0; 
        status_req${iSalvo}.rcvStatus := W#16#0; 
        status_req${iSalvo}.systatStatus := W#16#0; 
        status_req${iSalvo}.numDeFalhas := W#16#0; 
        status_req${iSalvo}.periodoCalculado := W#16#0;
        `
        //


        //console.log('chamada 1',rele.iniRange[i],index,reaj.getOffSetDbLocal(rede, index, toString(rele.iniRange[i])))

            //
            iSalvo++
            linhasDeclacaracoes += `LT${p}: FRAME_LEITURA;//comando de leitura 1 relé p22x
            `
            p++
        }    

        declaracoes +=`
        _${tag}:STRUCT    
            ${linhasDeclacaracoes}        
        END_STRUCT; //...        
        `   


        let k = 1
        rele.iniRange.forEach(function(iniRange){
            
            inicializacoes +=`
                _${tag}.LT${k}.slave_Id := B#16#${binarificar(rele.endereco,'b')};//BYTE; //endereço do slave 1
                _${tag}.LT${k}.function_Code := B#16#${binarificar(4,'b')};//BYTE; //função modbus 1 B#16#03;
                _${tag}.LT${k}.reg_Inicial := W#16#${binarificar(iniRange,'w')};//WORD; //endereço modbus do registrador inicial 2 W#16#0015;//21
                _${tag}.LT${k}.numero_Registradores := ${rele.sizeReq[k-1]} ;//INT;//numero de registradores de 16 bits a ser lido 2 //6
            `        
            //console.log('chamada 2',iniRange,reaj.getOffSetDbLocal(rede, index, toString(iniRange)))
        k++
        })    
        inicializacoes +=``
    
    })
    //i = 1;   


    let dbLeituras = { declaracoes: declaracoes, 
                       inicializacoes: inicializacoes, 
                       declaracoes2: declaracoes2, 
                       inicializacoes2:inicializacoes2,
                       declaracoes3: declaracoes3, 
                       inicializacoes3:inicializacoes3 }
    return dbLeituras
    }
    


//
exports.setDBLeituras = function setDBLeituras(dbLinhas,numDB, param){

let db = ` 
DATA_BLOCK DB${numDB}
     FRAME   
BEGIN

//Novo trecho de codigo para parametros modbus

    ${dbLinhas.inicializacoes}

    END_DATA_BLOCK

TYPE FRAME
    STRUCT
        ${dbLinhas.declaracoes}            
    END_STRUCT;    
END_TYPE

TYPE FRAME_LEITURA //Frame Modbus para ler os registradores
    STRUCT
       slave_Id: BYTE; //endereço do slave 
       function_Code: BYTE; //função modbus 
       reg_Inicial: WORD; //endereço modbus do registrador inicial
       numero_Registradores: INT;//numero de registradores de 16 bits a ser lido 
    END_STRUCT
END_TYPE 
 `

 //introduzir templates strings
 let db2 = `
 DATA_BLOCK DB ${numDB - 200}
 TITLE =
 AUTHOR : RODOLPHO
 VERSION : 0.2

     STRUCT 	
         ${dbLinhas.declaracoes2}   
     END_STRUCT ;	
 BEGIN
     ${dbLinhas.inicializacoes2}
 END_DATA_BLOCK`
 //console.log(db2)

 //introduzir templates strings
 let db3 = `
 DATA_BLOCK DB ${numDB - 200  + 2}
 TITLE =
 AUTHOR : RODOLPHO
 VERSION : 0.2

     STRUCT 	
         ${dbLinhas.declaracoes3}   
     END_STRUCT ;	
 BEGIN
     ${dbLinhas.inicializacoes3}
 END_DATA_BLOCK`
 //console.log(db3)

 let saida
 if(param === 1) {saida = db}
 if(param === 2) {saida = db2 + db3}
 return saida
}

